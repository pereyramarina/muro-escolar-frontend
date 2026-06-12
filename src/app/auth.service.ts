import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment'; 

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
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  /**
   * Envía las credenciales (Gmail y DNI) al API Gateway.
   */
  login(email: string, dni: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, dni }).pipe(
      tap(response => {
        // Guardamos el token de acceso de forma segura en el navegador
        localStorage.setItem('token', response.access_token);
        // Guardamos el rol para saber qué vistas mostrar
        localStorage.setItem('user_role', response.perfil.role);
        localStorage.setItem('user_profile', JSON.stringify(response.perfil));
      })
    );
  }

  registrarUsuario(datosUsuario: any): Observable<any> {
    // Rescatamos el token del directivo almacenado en el login
    const token = localStorage.getItem('token');
    
    // Inyectamos el token en los Headers para superar el JwtAuthGuard del backend
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Hacemos el POST a la nueva ruta protegida
    return this.http.post(`${this.apiUrl}/registrar`, datosUsuario, { headers });
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