import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  metricas: any = null;

  // Inyectamos el servicio de forma limpia
  private dashboardService = inject(DashboardService);

  ngOnInit(): void {
    this.obtenerMetricas();
  }

  obtenerMetricas() {
    // Usamos el servicio centralizado para hacer la petición
    this.dashboardService.obtenerMetricas().subscribe({
      next: (respuesta: any) => {
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