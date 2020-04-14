import { Injectable } from '@angular/core';
import { Record } from '../shared/record';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  private recordsSubject: BehaviorSubject<Record[]> = new BehaviorSubject([]);
  private selectedFieldSubject: BehaviorSubject<string> = new BehaviorSubject('markdown');

  public readonly records$: Observable<Record[]> = this.recordsSubject.asObservable();
  public readonly selectedField$: Observable<string> = this.selectedFieldSubject.asObservable();

  constructor() { }

  selectField(fieldValue: string) {
    this.selectedFieldSubject.next(fieldValue);
  }

  setRecords(records: Record[]) {
    this.recordsSubject.next(records);
  }

}
