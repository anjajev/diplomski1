import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilprodavacComponent } from './profilprodavac.component';

describe('ProfilprodavacComponent', () => {
  let component: ProfilprodavacComponent;
  let fixture: ComponentFixture<ProfilprodavacComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilprodavacComponent]
    });
    fixture = TestBed.createComponent(ProfilprodavacComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
