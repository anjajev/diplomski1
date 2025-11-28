import { TestBed } from '@angular/core/testing';

import { ProdavnicaService } from './prodavnica.service';

describe('ProdavnicaService', () => {
  let service: ProdavnicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProdavnicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
