import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../components/services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario tiene sesión activa, el portero lo deja pasar
  if (authService.isLoggedIn()) {
    return true;
  } 
  
  // Si no, lo devuelve a la pantalla de login
  router.navigate(['/login']);
  return false;
};