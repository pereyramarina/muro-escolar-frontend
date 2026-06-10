import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  
  private apiUrl = `${environment.apiUrl}/feedback`; 

  constructor(private http: HttpClient) {}

  /**
   * Envía la evaluación del docente al microservicio correspondiente.
   */
  enviarFeedback(payload: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, payload);
  }
}