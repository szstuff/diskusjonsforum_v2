import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
// gets the URL from the HTML tag 'base'
export function getBaseUrl() {
  return document.getElementsByTagName('base')[0].href;
}

// dependency injection gets configurated
const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];

// checks if the enviroment is set
if (environment.production) {
  // enable production mode if it is in production
  enableProdMode();
}

// bootstraps the angular application
platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err)); // error handling

