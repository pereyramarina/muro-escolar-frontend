import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  obtenerObras(page: number = 1, limit: number = 10): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<any>(this.apiUrl, { params });
  }

  subirObra(obra: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, obra);
  }
}