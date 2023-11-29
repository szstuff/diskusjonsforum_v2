import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { ThreadsComponent } from './threads/threads.component';
import { ThreadformComponent} from "./threads/threadform.component";
import { ThreadViewComponent } from "./threads/thread-view.component";
import {NgOptimizedImage} from "@angular/common";

// defines the components
@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    ThreadsComponent,
    ThreadformComponent,
    ThreadViewComponent
  ],
  // imports necessary modules and templates
    imports: [
        BrowserModule.withServerTransition({appId: 'ng-cli-universal'}),
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            {path: '', component: HomeComponent, pathMatch: 'full'},
            {path: 'threads', component: ThreadsComponent},
            {path: 'threadForm', component: ThreadformComponent},
            {path: 'thread-view/:id', component: ThreadViewComponent},
            {path: '**', redirectTo: '', pathMatch: 'full'}
        ]),
        NgOptimizedImage
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
