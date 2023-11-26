import { TestBed } from '@angular/core/testing';

import { ThreadService } from './threads.service';

describe('ThreadsService', () => {
  let service: ThreadService;

  beforeEach(() => { //executed before each test case
    TestBed.configureTestingModule({}); // sets up testing module
    service = TestBed.inject(ThreadService); // ThreadService is used as a reference for the testing
  });

  it('should be created', () => {
    expect(service).toBeTruthy(); // checks if service has a true bool
  });
});
