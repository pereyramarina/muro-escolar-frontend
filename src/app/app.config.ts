import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
// Importamos el módulo para hacer peticiones al backend
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Registramos el cliente HTTP a nivel global
    provideHttpClient() 
  ]
};