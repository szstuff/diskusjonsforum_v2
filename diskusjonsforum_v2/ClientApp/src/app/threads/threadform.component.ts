import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ThreadService } from './threads.service';

@Component({
  selector: 'app-threads-threadform', // custom HTML tag
  templateUrl: './threadform.component.html', // path to the HTML file
  //styleUrls: ['./thread-form.component.css'],
})

export class ThreadformComponent {
  threadForm: FormGroup; // provides the object FormGRoup as threadForm

  constructor(
    private _formBuilder: FormBuilder, // the form for creating threads
    private _router: Router, //lets us nagivate to different routers within the angular application
    private _threadService: ThreadService, //encapsulate functionality linked to ThreadService
    private _http: HttpClient) // sends HTTP requests and receives HTTP responses
  {
    this.threadForm = _formBuilder.group({
      // uses _formBuilder to create threadForm a formgroup
      title: ['', Validators.required], // Validators.required ensures the input title is not empty
      body: ['', Validators.required] // ensures the input of the body is not empty
    });
  }


  onSubmit() { // the method gets triggered when a thread is submitted
    console.log("ThreadCreate from submitted:"); // Logs when the thread has been submitted
    console.log(this.threadForm); // logs the object "threadForm"
    console.log('The thread ' + this.threadForm.value.title + ' is created.'); // logs a message telling the thread has been created
    console.log(this.threadForm.touched); //Logs if the threadForm control has been touched or not
    const newThread = this.threadForm.value; //Gets the current values of the threadForm control
    const createUrl = "api/thread/create"; //navigates to the URL for creating new thread
    this._threadService.createThread(newThread) //makes http post request with the data from newThread
      .subscribe(response => {
      if (response.success) {
        // if the response is a sucsess a message is logged from the server
        console.log(response.message);
        this._router.navigate(['/threads']);  // navigates back to /threads
      }
      else { // if it's not succesfull a failed success message is logged
        console.log('Thread creation failed');
      }
    });
  }

  backToThreads() {
    this._router.navigate(['/threads']); //navigates back to the threads
  }
}
