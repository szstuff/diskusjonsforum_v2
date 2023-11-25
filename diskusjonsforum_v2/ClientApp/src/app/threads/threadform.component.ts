import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-threads-threadform',
  templateUrl: './threadform.component.html',
  //styleUrls: ['./thread-form.component.css'],
})

export class ThreadformComponent {
  threadForm: FormGroup;

  constructor(private _formBuilder: FormBuilder, private _router: Router, private _http: HttpClient) {
    this.threadForm = _formBuilder.group({
      title: ['', Validators.required],
      body: ['', Validators.required]
    });
  }


  onSubmit() {
    console.log("ThreadCreate from submitted:");
    console.log(this.threadForm);
    console.log('The item ' + this.threadForm.value.title + ' is created.');
    console.log(this.threadForm.touched);
    const newThread = this.threadForm.value;
    const createUrl = "api/thread/create";
    this._http.post<any>(createUrl, newThread).subscribe(response => {
      if (response.success) {
        console.log(response.message);
        this._router.navigate(['/threads']);
      }
      else {
        console.log('Thread creation failed');
      }
    });
  }

  backToThreads() {
    this._router.navigate(['/threads']);
  }
}
