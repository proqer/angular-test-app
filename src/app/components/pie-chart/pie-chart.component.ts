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

  constructor(private chartService: ChartService) { }

  ngAfterViewInit(): void {
    this.pieChart = dc.pieChart(this.graphContainer.nativeElement);
    this.chartService.initPieChart(this.pieChart);
  }

}
