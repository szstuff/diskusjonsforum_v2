import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ThreadsComponent } from './threads/threads.component';
import { ThreadformComponent } from './threads/threadform.component';
import { ThreadViewComponent } from './threads/thread-view.component';

const routes: Routes = [
  { path: 'threads', component: ThreadsComponent },
  { path: 'threads/create', component: ThreadformComponent },
  { path: 'threads/:id', component: ThreadViewComponent },
  { path: '', redirectTo: '/threads', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
