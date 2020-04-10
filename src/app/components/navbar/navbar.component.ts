import { Component, OnInit } from '@angular/core';

import { NgxCsvParser, NgxCSVParserError } from 'ngx-csv-parser';

import { ChartService } from 'src/app/services/chart.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  public set selected(selectedValue: string) {
    this.chartService.selectedField = selectedValue;
  }

  constructor(
    private ngxCsvParser: NgxCsvParser,
    private chartService: ChartService) {
  }

  ngOnInit(): void {
  }

  onFileChange(files: File[]): void {
    this.ngxCsvParser
      .parse(files[0], {})
      .pipe()
      .subscribe(
        (result: Array<any>) => {
          this.chartService.records = result;
        },
        (error: NgxCSVParserError) => {
          // TODO error handling
          console.log('Error', error);
        });
  }

  resetAll() {
    // TODO
  }

}
