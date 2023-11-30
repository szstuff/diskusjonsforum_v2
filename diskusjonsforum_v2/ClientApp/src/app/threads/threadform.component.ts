import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThreadService } from './threads.service';

@Component({
  selector: 'app-threads-threadform',
  templateUrl: './threadform.component.html', // path to the HTML component
  styleUrls: ['../../css/thread_view.css'],
})

export class ThreadformComponent {
  threadForm: FormGroup; // Initialise a FormGroup object

  constructor(
    private _formBuilder: FormBuilder,
    private _router: Router, // Initialise router object for navigation
    private _threadService: ThreadService,
    private _http: HttpClient)
  {
    this.threadForm = _formBuilder.group({
      // Define FormBuilder input validation rules
      createdBy: ['', [Validators.required, Validators.maxLength(30)]],
      threadTitle: ['', [Validators.required, Validators.maxLength(100)]],
      threadBody: ['', [Validators.required, Validators.maxLength(2500)]],
    });
  }


  onSubmit() {
    console.log("ThreadCreate from submitted:");
    console.log(this.threadForm);
    console.log('The thread ' + this.threadForm.value.title + ' is created.');
    console.log(this.threadForm.touched);
    const newThread = this.threadForm.value; // Creates a Thread object with values from the form
    this._threadService.createThread(newThread) //Send the new thread to ThreadService->ThreadController to save
      .subscribe(response => {
      if (response.success) {
        console.log(response.message);
        this._router.navigate(['/threads']);  // navigates back to /threads
      }
      else {
        console.log('Thread creation failed');
      }
    });
  }

  backToThreads() {
    this._router.navigate(['/threads']); //navigates back to table view of threads
  }
}
