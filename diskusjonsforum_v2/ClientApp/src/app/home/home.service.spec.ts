import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';

// checks if it can be instantiated without errors
describe('HomeService', () => {
  let service: HomeService;
// sets up testing and uses "Homeservice"
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HomeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
