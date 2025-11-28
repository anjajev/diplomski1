import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilkorisnikComponent } from './profilkorisnik.component';

describe('ProfilkorisnikComponent', () => {
  let component: ProfilkorisnikComponent;
  let fixture: ComponentFixture<ProfilkorisnikComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProfilkorisnikComponent]
    });
    fixture = TestBed.createComponent(ProfilkorisnikComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
