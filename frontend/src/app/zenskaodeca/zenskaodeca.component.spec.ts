import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZenskaodecaComponent } from './zenskaodeca.component';

describe('ZenskaodecaComponent', () => {
  let component: ZenskaodecaComponent;
  let fixture: ComponentFixture<ZenskaodecaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ZenskaodecaComponent]
    });
    fixture = TestBed.createComponent(ZenskaodecaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
