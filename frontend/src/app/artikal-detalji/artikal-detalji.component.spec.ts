import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtikalDetaljiComponent } from './artikal-detalji.component';

describe('ArtikalDetaljiComponent', () => {
  let component: ArtikalDetaljiComponent;
  let fixture: ComponentFixture<ArtikalDetaljiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArtikalDetaljiComponent]
    });
    fixture = TestBed.createComponent(ArtikalDetaljiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
