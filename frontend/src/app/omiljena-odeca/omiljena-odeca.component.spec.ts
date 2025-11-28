import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmiljenaOdecaComponent } from './omiljena-odeca.component';

describe('OmiljenaOdecaComponent', () => {
  let component: OmiljenaOdecaComponent;
  let fixture: ComponentFixture<OmiljenaOdecaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OmiljenaOdecaComponent]
    });
    fixture = TestBed.createComponent(OmiljenaOdecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
