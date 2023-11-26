import { TestBed } from '@angular/core/testing';

import { CommentsService } from './comments.service';

//checks if the instance of CommentService is able to be created without errors.
describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
