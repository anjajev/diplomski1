import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DodavanjeArtiklaComponent } from './dodavanje-artikla.component';

describe('DodavanjeArtiklaComponent', () => {
  let component: DodavanjeArtiklaComponent;
  let fixture: ComponentFixture<DodavanjeArtiklaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DodavanjeArtiklaComponent]
    });
    fixture = TestBed.createComponent(DodavanjeArtiklaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
