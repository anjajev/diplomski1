import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrethodneKupovineComponent } from './prethodne-kupovine.component';

describe('PrethodneKupovineComponent', () => {
  let component: PrethodneKupovineComponent;
  let fixture: ComponentFixture<PrethodneKupovineComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PrethodneKupovineComponent]
    });
    fixture = TestBed.createComponent(PrethodneKupovineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
