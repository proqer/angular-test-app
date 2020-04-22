import { TestBed } from '@angular/core/testing';

import { ChartService } from './chart.service';
import * as dc from 'dc';

describe('ChartService', () => {
  let service: ChartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#selectField should emmit fieldName to Subject', () => {
    // tslint:disable-next-line: no-string-literal
    const selectedFieldSubjectSpy = spyOn(service['selectedFieldSubject'], 'next');
    const fieldName = 'fieldName';
    service.selectField(fieldName);
    expect(selectedFieldSubjectSpy).toHaveBeenCalledWith(fieldName);
  });

  it('#setRecords should emmit records to Subject', () => {
    // tslint:disable-next-line: no-string-literal
    const recordsSubjectSpy = spyOn(service['recordsSubject'], 'next');
    const records = [];
    service.setRecords(records);
    expect(recordsSubjectSpy).toHaveBeenCalledWith(records);
  });

  it('#clearCharts should clear filters on charts', () => {
    const pieChartDimenstionSpy = spyOn(service.pieChartDimenstion, 'filterAll');
    const lineChartDimenstionSpy = spyOn(service.lineChartDimenstion, 'filterAll');
    const dcFilterAllSpy = spyOn(dc, 'filterAll');
    const dcredrawAllSpy = spyOn(dc, 'redrawAll');
    service.clearChartsFilters();
    expect(pieChartDimenstionSpy).toHaveBeenCalled();
    expect(lineChartDimenstionSpy).toHaveBeenCalled();
    expect(service.selectedSegments).toEqual([]);
    expect(service.selectedRange).toBe(null);
    expect(dcFilterAllSpy).toHaveBeenCalled();
    expect(dcredrawAllSpy).toHaveBeenCalled();
  });
});
