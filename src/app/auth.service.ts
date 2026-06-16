import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment'; 

interface AuthResponse {
  access_token: string;
  perfil: {
    id: number; 
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

  login(email: string, dni: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, dni }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('user_role', response.perfil.role);
        localStorage.setItem('user_id', response.perfil.id.toString());
        localStorage.setItem('user_profile', JSON.stringify(response.perfil));
      })
    );
  }

  registrarUsuario(datosUsuario: any): Observable<any> {
    const token = localStorage.getItem('token');
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.apiUrl}/registrar`, datosUsuario, { headers });
  }

  logout(): void {
    localStorage.clear();
  }

  getRole(): string | null {
    return localStorage.getItem('user_role');
  }

  getUserId(): number | null {
    const id = localStorage.getItem('user_id');
    return id ? parseInt(id, 10) : null;
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}