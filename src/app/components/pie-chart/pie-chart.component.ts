import { ChartService } from 'src/app/services/chart.service';

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import * as dc from 'dc';
import { PieChart } from 'dc';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements AfterViewInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

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

  ngOnDestroy(): void {
    this.chartService.selectedSegments = this.pieChart.filters();
    this.subscriptions.unsubscribe();
  }

  private initPieChart() {
    this.pieChart = dc.pieChart(this.graphContainer.nativeElement);
    const dimension = this.chartService.pieChartDimenstion;
    const group = dimension.group().reduceSum((record) => record.markdown);
    this.pieChart
      .width(768)
      .height(480)
      .dimension(dimension)
      .group(group)
      .legend(dc.legend())
      .render();
    // Select previous
    console.time('a');
    this.pieChart.onClick({ key: 'CC' });
    // this.chartService.selectedSegments
    //   .map((current) => ({ key: current }))
    //   .forEach((current) => this.pieChart.onClick(current));
    console.timeEnd('a');
    // this.pieChart.filter(this.chartService.selectedSegments);
  }

  showFilters() {

  }

  private subscribeOnSelectedFieldChanges() {
    const selectFieldSubscription = this.chartService.selectedField$.subscribe((fieldValue) => {
      this.pieChart
        .group()
        .reduceSum((record) => record[fieldValue]);
      this.pieChart.redraw();
    });
    this.subscriptions.add(selectFieldSubscription);
  }

  private subscribeOnRecorChanges() {
    const recordsSubscription = this.chartService.records$.subscribe(() => {
      this.pieChart.redraw();
    });
    this.subscriptions.add(recordsSubscription);
  }

}
