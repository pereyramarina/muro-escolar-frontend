import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

// 1. Agregamos withInterceptors a la importación
import { provideHttpClient, withInterceptors } from '@angular/common/http'; 
// 2. Importamos el archivo que acabamos de crear
import { authInterceptor } from './interceptors/auth.interceptor'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 3. Registramos el interceptor en el motor HTTP
    provideHttpClient(withInterceptors([authInterceptor])) 
  ]
};