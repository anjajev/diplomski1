import { TestBed } from '@angular/core/testing';

import { NarudzbineService } from './narudzbine.service';

describe('NarudzbineService', () => {
  let service: NarudzbineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NarudzbineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
