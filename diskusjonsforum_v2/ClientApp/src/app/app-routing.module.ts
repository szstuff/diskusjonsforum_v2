import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadsComponent } from './threads/threads.component';
import { ThreadformComponent } from './threads/threadform.component';
import { ThreadViewComponent } from './threads/thread-view.component';
// defines the routes for different components. The navigation is specified
const routes: Routes = [
  { path: 'threads', component: ThreadsComponent }, // when the URL is /threads, Threadscomponent is displayed
  { path: 'threads/create', component: ThreadformComponent }, // when the URL is /threads/create, ThreadformComponent is displayed
  { path: 'threads/:id', component: ThreadViewComponent }, // :id specifies a route parameter for a dynamic routing. When the pattern is matched by the URL ThreadViewComponent is displayed
  { path: '', redirectTo: '/threads', pathMatch: 'full' }, // when the path is empty it is redirected to /threads
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // imports Routermodel and configuers with the defined routes. It is configured by using the forRoot() method
  exports: [RouterModule] // Exports RouterModule and makes it available in other modules
})
export class AppRoutingModule { }
