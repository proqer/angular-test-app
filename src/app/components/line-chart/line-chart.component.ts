import { ChartService } from 'src/app/services/chart.service';

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { LineChart } from 'dc';
import * as dc from 'dc';
import * as d3 from 'd3';

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
    this.chartService.selectedRange = this.lineChart.filter();
    this.subscriptions.unsubscribe();
    dc.deregisterChart(this.lineChart);
  }

  /**
   * Initialize lineChart with dimension and group from chartService
   */
  private initLineChart() {
    this.lineChart = dc.lineChart(this.graphContainer.nativeElement);
    const dimension = this.chartService.lineChartDimenstion;
    const group = this.chartService.lineChartGroup;
    this.lineChart
      .width(1000)
      .height(400)
      .margins({ top: 10, right: 10, bottom: 50, left: 80 })
      .transitionDuration(500)
      .dimension(dimension)
      .group(group)
      .elasticY(true)
      .x(d3.scaleTime())
      .elasticX(true)
      .xUnits(d3.timeWeeks)
      .render();
    // Select previous
    this.lineChart.filter(this.chartService.selectedRange);
  }

  /**
   * Change grouping on lineChart on selected field changing.
   */
  private subscribeOnSelectedFieldChanges() {
    const selectFieldSubscription = this.chartService.selectedField$.subscribe((fieldValue) => {
      this.lineChart
        .group()
        .reduceSum((record) => record[fieldValue]);
      this.lineChart.redraw();
    });
    this.subscriptions.add(selectFieldSubscription);
  }

  /**
   * Redraw lineChart on record change
   */
  private subscribeOnRecorChanges() {
    const recordsSubscription = this.chartService.records$.subscribe(() => {
      this.lineChart.redraw();
    });
    this.subscriptions.add(recordsSubscription);
  }

}
