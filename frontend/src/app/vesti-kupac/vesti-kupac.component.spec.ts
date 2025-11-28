import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VestiKupacComponent } from './vesti-kupac.component';

describe('VestiKupacComponent', () => {
  let component: VestiKupacComponent;
  let fixture: ComponentFixture<VestiKupacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VestiKupacComponent]
    });
    fixture = TestBed.createComponent(VestiKupacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
