import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  public get selectedField(): string {
    return this.chartService.selectedField;
  }

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
  }

}
