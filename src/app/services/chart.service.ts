import { Injectable } from '@angular/core';
import { Record } from '../shared/record';

@Injectable({
  providedIn: 'root'
})
export class ChartService {

  records: Record[];

  selectedField: string;

  constructor() { }

}
