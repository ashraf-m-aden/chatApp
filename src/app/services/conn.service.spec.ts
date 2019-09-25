import { TestBed } from '@angular/core/testing';

import { ConnService } from './conn.service';

describe('ConnService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConnService = TestBed.get(ConnService);
    expect(service).toBeTruthy();
  });
});
