import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoslatiArtikliComponent } from './poslati-artikli.component';

describe('PoslatiArtikliComponent', () => {
  let component: PoslatiArtikliComponent;
  let fixture: ComponentFixture<PoslatiArtikliComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PoslatiArtikliComponent]
    });
    fixture = TestBed.createComponent(PoslatiArtikliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
