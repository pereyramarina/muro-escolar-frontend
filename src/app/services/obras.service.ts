import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Obra {
  id?: number;
  id_obra?: number;
  _id?: string;
  titulo: string;
  descripcion: string;
  imagenUrl: string;
  alumnoId: string;
  calificacion?: number;
  comentario_docente?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ObrasService {
  private apiUrl = `${environment.apiUrl}/obras`; 

  constructor(private http: HttpClient) {}

  obtenerObras(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  subirObra(obra: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, obra);
  }
}