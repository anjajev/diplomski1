import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoprodavciComponent } from './infoprodavci.component';

describe('InfoprodavciComponent', () => {
  let component: InfoprodavciComponent;
  let fixture: ComponentFixture<InfoprodavciComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoprodavciComponent]
    });
    fixture = TestBed.createComponent(InfoprodavciComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
