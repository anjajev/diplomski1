import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OmiljeneProdavniceComponent } from './omiljene-prodavnice.component';

describe('OmiljeneProdavniceComponent', () => {
  let component: OmiljeneProdavniceComponent;
  let fixture: ComponentFixture<OmiljeneProdavniceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OmiljeneProdavniceComponent]
    });
    fixture = TestBed.createComponent(OmiljeneProdavniceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
