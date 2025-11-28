import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoruceniArtikliComponent } from './poruceni-artikli.component';

describe('PoruceniArtikliComponent', () => {
  let component: PoruceniArtikliComponent;
  let fixture: ComponentFixture<PoruceniArtikliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoruceniArtikliComponent]
    });
    fixture = TestBed.createComponent(PoruceniArtikliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
