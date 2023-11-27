import { TestBed } from '@angular/core/testing';

import { HomeService } from './home.service';

// checks if it can be instantiated without errors
describe('HomeService', () => {
  let service: HomeService;

  beforeEach(() => { //executed before each test case
    TestBed.configureTestingModule({}); // sets up testing module
    service = TestBed.inject(HomeService); // "HomeService" is used as reference for the testing
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // checks if service has a true bool
  });
});
