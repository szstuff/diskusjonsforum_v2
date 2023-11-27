import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { CommentsComponent } from './comments/comments.component';
import { ThreadformComponent} from "./threads/threadform.component";
import { CommentformComponent} from "./comments/commentform.component";
import { ThreadViewComponent } from "./threads/thread-view.component";

// defines the components
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ThreadsComponent,
    CommentsComponent,
    ThreadformComponent,
    CommentformComponent,
    ThreadViewComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule, // provides modules that are necessary to make HTTP request
    FormsModule, // supports template-driven
    ReactiveFormsModule, // support for reactive forms
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' }, // redirects to HomeComponent if the Url is emptty
      { path: 'threads', component: ThreadsComponent}, // if the URL is /threads, ThreadsComponent is diisplayed
      { path: 'comments', component: CommentsComponent}, // if the URL is /comments, CommentsComponent is displayed
      {path: 'threadForm', component: ThreadformComponent}, // if the URL is /threadForm, ThreadformComponent is displayed
      {path: 'commentForm', component: CommentformComponent}, // if  the URL is /commentForm, CommentformComponent is displayed
      {path: 'thread-view/:id', component: ThreadViewComponent }, // :id specifies a route parameter for a dynamic routing. When the pattern is matched by the URL ThreadViewComponent is displayed
      {path: '**', redirectTo: '', pathMatch: 'full'} // wildcard route matches any path that does not equal with the prior configurations. Redirects to the default route
    ])
  ],
  providers: [],
  bootstrap: [AppComponent] // root component of the application
})
export class AppModule { }
