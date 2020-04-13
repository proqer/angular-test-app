import { Component, OnInit } from '@angular/core';
import { ChartService } from 'src/app/services/chart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {

  selectedField$: Observable<string>;

  constructor(private chartService: ChartService) { }

  ngOnInit(): void {
    this.selectedField$ = this.chartService.selectedField$;
  }

}
