import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';

// checks if it can be instantiated wothout errors
describe('HomeService', () => {
  let service: HomeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
