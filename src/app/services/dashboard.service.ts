import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.apiUrl}/reportes`; 

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las estadísticas globales y el desglose técnico.
   * El Token del docente se inyecta automáticamente gracias al Interceptor.
   */
  obtenerMetricas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}