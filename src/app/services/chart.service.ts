import { Injectable } from '@angular/core';
import { Record } from '../shared/record';
import { BehaviorSubject, Observable, from } from 'rxjs';

import * as crossfilter from 'crossfilter2';
import { Crossfilter } from 'crossfilter2';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  readonly cf: Crossfilter<Record> = crossfilter();

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

  private subscribeOnRecordsChange() {
    this.records$.subscribe((records) => {
      this.cf.remove();
      this.cf.add(records);
    });
  }

}
