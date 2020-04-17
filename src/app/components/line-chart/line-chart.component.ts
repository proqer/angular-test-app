import { ChartService } from 'src/app/services/chart.service';

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { LineChart } from 'dc';
import * as dc from 'dc';
import * as d3 from 'd3';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  @ViewChild('graphContainer')
  private graphContainer: ElementRef;
  private lineChart: LineChart;

  constructor(private chartService: ChartService) { }

  ngAfterViewInit(): void {
    this.initLineChart();
    this.subscribeOnRecorChanges();
    this.subscribeOnSelectedFieldChanges();
  }

  ngOnDestroy(): void {
    // this.chartService.selectedSegments = this.pieChart.filters();
    this.subscriptions.unsubscribe();
  }

  private initLineChart() {
    this.lineChart = dc.lineChart(this.graphContainer.nativeElement);
    const dimension = this.chartService.lineChartDimenstion;
    const group = dimension.group().reduceSum((record) => record.markdown);
    this.lineChart
      .width(1000)
      .height(400)
      .margins({ top: 10, right: 10, bottom: 20, left: 40 })
      .transitionDuration(500)
      .dimension(dimension)
      .group(group)
      .elasticY(true)
      .x(d3.scaleTime().domain([27, 38])) // TODO
      .render();
  }

  private subscribeOnSelectedFieldChanges() {
    const selectFieldSubscription = this.chartService.selectedField$.subscribe((fieldValue) => {
      this.lineChart
        .group()
        .reduceSum((record) => record[fieldValue]);
      this.lineChart.redraw();
    });
    this.subscriptions.add(selectFieldSubscription);
  }

  private subscribeOnRecorChanges() {
    const recordsSubscription = this.chartService.records$.subscribe(() => {
      this.lineChart.redraw();
    });
    this.subscriptions.add(recordsSubscription);
  }

}
