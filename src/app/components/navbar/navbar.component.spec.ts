import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import { ChartService } from 'src/app/services/chart.service';
import { Record } from 'src/app/shared/record';
import { NgxCsvParser } from 'ngx-csv-parser';
import { of } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let chartService: ChartService;
  let ngxCsvParser: NgxCsvParser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [ChartService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    chartService = fixture.debugElement.injector.get(ChartService);
    ngxCsvParser = fixture.debugElement.injector.get(NgxCsvParser);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onFieldChange should call chartService#selectField', () => {
    const spy = spyOn(chartService, 'selectField');
    const fieldName = 'fieldName';
    component.onFieldChange(fieldName);
    expect(spy).toHaveBeenCalledWith(fieldName);
  });

  it('#onFileChange should call ngxCsvParser#parse', () => {
    const spy = spyOn(ngxCsvParser, 'parse').and.callThrough();
    const file = new File([''], null);
    component.onFileChange(file);
    expect(spy).toHaveBeenCalledWith(file, {});
  });

  it('#resetAll should call chartService#clearChartsFilters', () => {
    const spy = spyOn(chartService, 'clearChartsFilters');
    component.resetAll();
    expect(spy).toHaveBeenCalled();
  });
});
