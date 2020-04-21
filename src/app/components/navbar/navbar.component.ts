import { ChartService } from 'src/app/services/chart.service';

import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  selected$: Observable<string>;

  constructor(
    private ngxCsvParser: NgxCsvParser,
    public chartService: ChartService) {
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
        (records: any[]) => {
          records.forEach(record => {
            record.date = new Date(+record.year_ref, 0, +record.week_ref * 7 - 7);
            delete record.year_ref;
            delete record.week_ref;
          });
          this.chartService.setRecords(records);
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
