import { ChartService } from 'src/app/services/chart.service';
import { Record } from 'src/app/shared/record';

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, from } from 'rxjs';

import * as dc from 'dc';
import { PieChart } from 'dc';
import * as crossfilter from 'crossfilter2';
import { mergeMap, reduce, groupBy, take, flatMap } from 'rxjs/operators';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit, AfterViewInit {

  @ViewChild('graphContainer')
  private graphContainer: ElementRef;
  private pieChart: PieChart;
  private cf: any;

  selectedField$: Observable<string>;
  records$: Observable<Record[]>;

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.selectedField$ = this.chartService.selectedField$;
    this.records$ = this.chartService.records$;
  }

  ngAfterViewInit(): void {
    this.pieChart = dc.pieChart(this.graphContainer.nativeElement);
    this.cf = crossfilter();
    this.drawChart();

    this.records$.pipe(
      flatMap(records => this.getSumByCategory(records)),
    ).subscribe((records) => {
      this.cf.remove();
      this.cf.add(records);
      this.pieChart.redraw();
    });

    this.selectedField$.subscribe((selectedField) => {
      this.changSelected(selectedField);
    });
  }

  private getSumByCategory(records: Record[]): Observable<any> {
    /* [{category: 'a', margin: 1, markdown: 2, revenues: 3},
        {category: 'a', margin: 1, markdown: 2, revenues: 3},
        {category: 'b', margin: 1, markdown: 2, revenues: 3}]
        =>
       [{category: 'a', margin: 2, markdown: 4, revenues: 6},
        {category: 'b', margin: 1, markdown: 2, revenues: 3}]
   */
    return from(records)
      .pipe(
        groupBy(p => p.item_category),
        mergeMap((group$) => {
          return group$.pipe(reduce((acc, current) => {
            acc.category = current.item_category;
            acc.markdown += +current.markdown;
            acc.revenues += +current.revenues;
            acc.margin += +current.margin;
            return acc;
          }, {
            category: '',
            markdown: 0,
            revenues: 0,
            margin: 0,
          }));
        }),
        reduce((acc, current) => [...acc, current], []),
        take(1)
      );
  }

  private changSelected(field: string) {
    const dimension = this.cf.dimension((d) => `${d.category}: ${+d[field].toFixed(4)}`);
    const group = dimension.group().reduceSum((d) => +d[field]);
    this.pieChart
      .dimension(dimension)
      .group(group)
      .redraw();
  }

  private drawChart(): void {
    const dimension = this.cf.dimension(() => '');
    const group = dimension.group().reduceSum(() => 0);
    this.pieChart
      .width(768)
      .height(480)
      .dimension(dimension)
      .group(group)
      .legend(dc.legend())
      .on('renderlet', (chart) => {
        chart.selectAll('path').on('click', (d) => {
          console.log(d);
        });
      })
      .render();
  }

}
