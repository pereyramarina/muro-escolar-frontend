import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment'; 

// Definimos la estructura de la respuesta que nos da el Backend
interface AuthResponse {
  access_token: string;
  perfil: {
    nombre: string;
    apellido: string;
    role: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Tomamos la URL base del backend desde los environments que configuraste
  private apiUrl = `${environment.apiUrl}/auth/login`;

  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales del alumno (Gmail y DNI) al API Gateway.
   */
  login(email: string, dni: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(this.apiUrl, { email, dni }).pipe(
      tap(response => {
        // Guardamos el token de acceso de forma segura en el navegador
        localStorage.setItem('token', response.access_token);
        // Guardamos el rol para saber qué vistas mostrar
        localStorage.setItem('user_role', response.perfil.role);
        localStorage.setItem('user_profile', JSON.stringify(response.perfil));
      })
    );
  }

  logout(): void {
    localStorage.clear();
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}