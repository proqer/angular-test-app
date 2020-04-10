import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  public get selectedField(): string {
    return this.chartService.selectedField;
  }

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
  }

}
