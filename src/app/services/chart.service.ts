import { Record } from '../shared/record';

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, from } from 'rxjs';

import * as crossfilter from 'crossfilter2';
import { Crossfilter } from 'crossfilter2';
import * as dc from 'dc';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  readonly cf: Crossfilter<Record> = crossfilter();
  readonly pieChartDimenstion = this.cf.dimension((record) => record.item_category);
  readonly pieChartGroup = this.pieChartDimenstion.group().reduceSum((record) => record.markdown);
  readonly lineChartDimenstion = this.cf.dimension((record) => d3.timeWeek(record.date));
  readonly lineChartGroup = this.lineChartDimenstion.group().reduceSum((record) => record.markdown);

  selectedSegments: any[] = [];
  selectedRange: any;

  private recordsSubject: BehaviorSubject<Record[]> = new BehaviorSubject([]);
  private selectedFieldSubject: BehaviorSubject<string> = new BehaviorSubject('markdown');

  readonly records$: Observable<Record[]> = this.recordsSubject.asObservable();
  readonly selectedField$: Observable<string> = this.selectedFieldSubject.asObservable();

  constructor() {
    this.subscribeOnRecordsChange();
  }

  selectField(fieldValue: string): void {
    this.selectedFieldSubject.next(fieldValue);
  }

  setRecords(records: Record[]): void {
    this.recordsSubject.next(records);
  }

  clearCharts() {
    this.pieChartDimenstion.filterAll();
    this.lineChartDimenstion.filterAll();
    this.selectedSegments = [];
    this.selectedRange = null;
    dc.filterAll();
    dc.redrawAll();
  }

  private subscribeOnRecordsChange() {
    this.records$.subscribe((records) => {
      this.selectedSegments = [];
      this.selectedRange = null;
      this.cf.remove();
      this.cf.add(records);
    });
  }

}
