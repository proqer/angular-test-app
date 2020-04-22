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

  /**
   * Emmit new selected value
   *
   * @param fieldValue to be selected
   */
  selectField(fieldValue: string): void {
    this.selectedFieldSubject.next(fieldValue);
  }

  /**
   * Emmit new records
   *
   * @param records to be set
   */
  setRecords(records: Record[]): void {
    this.recordsSubject.next(records);
  }

  /**
   * Clear filters on all charts
   */
  clearChartsFilters() {
    this.pieChartDimenstion.filterAll();
    this.lineChartDimenstion.filterAll();
    this.selectedSegments = [];
    this.selectedRange = null;
    dc.filterAll();
    dc.redrawAll();
  }

  /**
   * Subscribe on changing records. Clear current data and set new.
   * Remove current selected filters
   */
  private subscribeOnRecordsChange() {
    this.records$.subscribe((records) => {
      this.clearChartsFilters();
      this.cf.remove();
      this.cf.add(records);
    });
  }

}
