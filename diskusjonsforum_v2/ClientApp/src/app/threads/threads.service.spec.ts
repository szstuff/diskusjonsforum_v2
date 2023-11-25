import { TestBed } from '@angular/core/testing';

import { ThreadService } from './threads.service';

describe('ThreadsService', () => {
  let service: ThreadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThreadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
