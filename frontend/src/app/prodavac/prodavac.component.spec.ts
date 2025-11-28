import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdavacComponent } from './prodavac.component';

describe('ProdavacComponent', () => {
  let component: ProdavacComponent;
  let fixture: ComponentFixture<ProdavacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProdavacComponent]
    });
    fixture = TestBed.createComponent(ProdavacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
