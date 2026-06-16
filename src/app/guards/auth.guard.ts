import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  } 
  
  const rolUsuario = authService.getRole();

  if (state.url.includes('/feedback') && rolUsuario !== 'docente') {
    alert('Acceso denegado: Solo el personal docente puede realizar evaluaciones.');
    router.navigate(['/galeria']);
    return false;
  }

  if (state.url.includes('/dashboard') && rolUsuario !== 'directivo') {
    alert('Acceso denegado: Esta área es exclusiva para personal directivo.');
    router.navigate(['/galeria']);
    return false;
  }

  return true;
};