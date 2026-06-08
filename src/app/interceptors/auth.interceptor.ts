import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Buscamos el token que guardamos durante el login
  const token = localStorage.getItem('token');

  // Si hay un token, clonamos la petición original y le inyectamos la cabecera de seguridad
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq); // Enviamos la petición modificada al backend
  }

  // Si no hay token, la petición sigue su curso normal
  return next(req);
};