import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  selectedField$: Observable<string>;

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.selectedField$ = this.chartService.selectedField$;
  }

}
