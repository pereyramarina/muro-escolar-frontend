import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Definimos el contrato de datos (Interface) para tipar estrictamente la respuesta
export interface Obra {
  _id?: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  alumnoId: string;
  fechaCreacion?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private apiUrl = `${environment.apiUrl}/obras`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista completa de obras desde el backend.
   * El Token JWT se inyecta automáticamente gracias al Interceptor.
   */
  obtenerObras(): Observable<Obra[]> {
    return this.http.get<Obra[]>(this.apiUrl);
  }

  /**
   * Envía una nueva obra al servidor.
   */
  subirObra(obra: Partial<Obra>): Observable<Obra> {
    return this.http.post<Obra>(this.apiUrl, obra);
  }
}