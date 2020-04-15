import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { Observable } from 'rxjs';
import { LineChart } from 'dc';
import * as dc from 'dc';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements AfterViewInit {

  @ViewChild('graphContainer')
  private graphContainer: ElementRef;
  private lineChart: LineChart;

  constructor(private chartService: ChartService) { }

  ngAfterViewInit(): void {
    this.lineChart = dc.lineChart(this.graphContainer.nativeElement);
    this.chartService.initLineChart(this.lineChart);
  }

}
