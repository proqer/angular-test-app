import { Injectable } from '@angular/core';
import { Record } from '../shared/record';
import { BehaviorSubject, Observable, from } from 'rxjs';

import * as dc from 'dc';
import * as d3 from 'd3';
import { PieChart, LineChart } from 'dc';
import * as crossfilter from 'crossfilter2';
import { flatMap, groupBy, mergeMap, reduce, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private pieChart: PieChart;
  private lineChart: LineChart;
  private cf: any = crossfilter();

  private recordsSubject: BehaviorSubject<Record[]> = new BehaviorSubject([]);
  private selectedFieldSubject: BehaviorSubject<string> = new BehaviorSubject('markdown');

  public readonly records$: Observable<Record[]> = this.recordsSubject.asObservable();
  public readonly selectedField$: Observable<string> = this.selectedFieldSubject.asObservable();

  constructor() { }

  selectField(fieldValue: string): void {
    this.selectedFieldSubject.next(fieldValue);
  }

  setRecords(records: Record[]): void {
    this.recordsSubject.next(records);
  }

  initPieChart(pieChart: PieChart): void {
    this.pieChart = pieChart;
    this.drawEmptyPieChart();
    // Subscribing on records changes
    this.records$.pipe(
      flatMap(this.getSumOfFieldsByCategory),
    ).subscribe((records) => {
      this.cf.remove();
      this.cf.add(records);
      this.pieChart.redraw();
    });
    // Subscribe on selected field change
    this.selectedField$.subscribe((fieldValue) => {
      const dimension = this.cf.dimension((d) => d.category);
      const group = dimension.group().reduceSum((d) => +d[fieldValue]);
      this.pieChart
        .dimension(dimension)
        .group(group)
        .redraw();
    });
  }

  initLineChart(lineChart: LineChart): void {
    this.lineChart = lineChart;
    this.drawEmptyLineChart();
    // Subscribing on records changes

    // Subscribe on selected field change

  }

  private drawEmptyLineChart(): void {
    const dimension = this.cf.dimension(() => '');
    const group = dimension.group().reduceSum(() => 0);
    this.lineChart
      .width(1000)
      .height(400)
      .transitionDuration(500)
      .dimension(dimension)
      .group(group)
      .elasticY(true)
      .x(d3.scaleLinear())
      .render();
  }

  private drawEmptyPieChart(): void {
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
          // TODO
        });
      })
      .render();
  }

  /**
   * [{category: 'a', margin: 1, markdown: 2, revenues: 3},
   *  {category: 'a', margin: 1, markdown: 2, revenues: 3},
   *  {category: 'b', margin: 1, markdown: 2, revenues: 3}]
   *    =>
   * [{category: 'a', margin: 2, markdown: 4, revenues: 6},
   *  {category: 'b', margin: 1, markdown: 2, revenues: 3}]
   */
  private getSumOfFieldsByCategory(records: Record[]): Observable<any> {
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

}
