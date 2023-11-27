import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
    imports: [AppModule, ServerModule], // depends on AppModule and ServerModule
    bootstrap: [AppComponent] // the component is specified to be bootstrapped
})
export class AppServerModule { }

