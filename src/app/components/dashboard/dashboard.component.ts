import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  metricas: any = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerMetricas();
  }

  obtenerMetricas() {
    this.http.get<any>('http://localhost:3000/reportes').subscribe({
      next: (respuesta) => {
        const d = respuesta.datos;
        const totalObras = d.metricas_globales.total_obras_registradas;

        this.metricas = {
          totalObras: totalObras,
          totalFeedbacks: d.metricas_globales.total_feedbacks_emitidos,
          alumnosActivos: d.metricas_globales.total_alumnos || 'N/A',
          desgloseTecnicas: d.distribucion_por_tecnica.map((item: any) => ({
            tecnica: item.tecnica,
            cantidad: item.cantidad,
            porcentaje: totalObras > 0 ? ((item.cantidad / totalObras) * 100).toFixed(0) : 0
          }))
        };
      },
      error: (error) => {
        console.error('Error al conectar con el microservicio:', error);
      }
    });
  }

  exportarPDF() {
    // Esto abre el diálogo de impresión del navegador
    window.print();
  }
}