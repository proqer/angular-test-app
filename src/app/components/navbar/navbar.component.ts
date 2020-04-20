import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import { ChartService } from 'src/app/services/chart.service';
import { Record } from 'src/app/shared/record';
import { Observable } from 'rxjs';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  selected$: Observable<string>;

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private chartService: ChartService) {
  }

  ngOnInit(): void {
    this.selected$ = this.chartService.selectedField$;
  }

  onFieldChange(changeEvent: MatSelectChange) {
    this.chartService.selectField(changeEvent.value);
  }

  onFileChange(files: File[]) {
    this.ngxCsvParser
      .parse(files[0], {})
      .pipe()
      .subscribe(
        (result: Record[]) => {
          this.chartService.setRecords(result);
        },
        (error: NgxCSVParserError) => {
          // TODO error handling
          console.log('Error', error);
        });
  }

  resetAll() {
    this.chartService.clearCharts();
  }

}
