import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadsComponent } from './threads/threads.component';
import { ThreadformComponent } from './threads/threadform.component';
import { ThreadViewComponent } from './threads/thread-view.component';
// defines the routes for different components. The navigation is specified
const routes: Routes = [
  { path: 'threads', component: ThreadsComponent }, // when the URL is /threads, Threadscomponent is displayed
  { path: 'threads/create', component: ThreadformComponent }, // when the URL is /threads/create, ThreadformComponent is displayed
  { path: 'threads/:id', component: ThreadViewComponent }, // when the URL is /threads/:id, ThreadViewComponent is displayed
  { path: '', redirectTo: '/threads', pathMatch: 'full' }, // when the URL is /
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
