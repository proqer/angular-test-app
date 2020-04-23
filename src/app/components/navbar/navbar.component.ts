import { ChartService } from 'src/app/services/chart.service';

import { Component, OnInit } from '@angular/core';
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

  /**
   * Select field value
   *
   * @param fieldName value of selection
   */
  changeSelectedField(fieldName: string) {
    this.chartService.selectField(fieldName);
  }

  /**
   * Parse file and save data for charts
   *
   * @param file to be parsed and saved.
   */
  parseFile(file: File) {
    this.ngxCsvParser
      .parse(file, {})
      .subscribe(
        (records: any[]) => {
          console.log(records);
          records.forEach(record => {
            record.date = new Date(+record.year_ref, 0, +record.week_ref * 7 - 7);
            delete record.year_ref;
            delete record.week_ref;
          });
          this.chartService.setRecords(records);
        });
  }

  /**
   * Clear filters for all charts
   */
  resetAll() {
    this.chartService.clearChartsFilters();
  }

}
