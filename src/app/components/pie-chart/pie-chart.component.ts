import { ChartService } from 'src/app/services/chart.service';

import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';

import * as dc from 'dc';
import { PieChart } from 'dc';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit {

  @ViewChild('graphContainer')
  private graphContainer: ElementRef;
  private pieChart: PieChart;

  constructor(private chartService: ChartService) {
  }

  ngAfterViewInit(): void {
    this.initPieChart();
    this.subscribeOnRecorChanges();
    this.subscribeOnSelectedFieldChanges();
  }

  private initPieChart() {
    this.pieChart = dc.pieChart(this.graphContainer.nativeElement);
    const dimension = this.chartService.cf.dimension((record) => record.item_category);
    const group = dimension.group().reduceSum((record) => record.markdown);
    this.pieChart
      .width(768)
      .height(480)
      .dimension(dimension)
      .group(group)
      .legend(dc.legend())
      .render();
  }

  showFilters() {
    console.log(this.pieChart.filters());
    this.pieChart.filter(['HH', 'FF']); // TODO
    this.pieChart.redraw();
  }

  private subscribeOnRecorChanges() {
    this.chartService.selectedField$.subscribe((fieldValue) => {
      this.pieChart
        .group()
        .reduceSum((record) => record[fieldValue]);
      this.pieChart.redraw();
    });
  }

  private subscribeOnSelectedFieldChanges() {
    this.chartService.records$.subscribe(() => {
      this.pieChart.redraw();
    });
  }

}
