import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// gets the URL from the HTML tag 'base'
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

// configurates tje dependency injection
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

// checks the enviroment
if (environment.production) {
  enableProdMode();
}


platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));

