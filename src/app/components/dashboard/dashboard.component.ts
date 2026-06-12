import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  
  public metricas: any = null;
  public registroForm: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    dni: ['', [Validators.required, Validators.minLength(7)]],
    role: ['alumno', Validators.required]
  });

  ngOnInit() { 
    this.cargarMetricas();
  }

  // Implementación del patrón Mapper para adaptar el payload del Backend a la Vista
  cargarMetricas() {
    this.dashboardService.obtenerMetricas().subscribe({
      next: (res: any) => {
        if (!res || !res.datos) return;
        
        const d = res.datos;
        const total = d.metricas_globales?.total_obras_registradas || 0;
        
        this.metricas = {
          totalObras: total,
          totalFeedbacks: d.metricas_globales?.total_feedbacks_emitidos || 0,
          alumnosActivos: d.metricas_globales?.total_alumnos || 'N/A',
          desgloseTecnicas: (d.distribucion_por_tecnica || []).map((item: any) => ({
            tecnica: item.tecnica,
            cantidad: item.cantidad,
            porcentaje: total > 0 ? Math.round((item.cantidad / total) * 100) : 0
          }))
        };
      },
      error: (err) => console.error('Error de red al obtener métricas:', err)
    });
  }

  registrarUsuario() {
    if (this.registroForm.valid) {
      const data = {
        nombre: this.registroForm.value.nombre,
        apellido: this.registroForm.value.apellido,
        email: this.registroForm.value.email,
        dni: this.registroForm.value.dni,
        role: this.registroForm.value.role
      };
      
      console.log('Enviando desde Frontend:', data);
      
      this.authService.registrarUsuario(data).subscribe({
        next: () => { 
          alert('¡Usuario registrado exitosamente!'); 
          this.registroForm.reset({ role: 'alumno' }); 
        },
        error: (err) => {
          console.error('Error capturado en Frontend:', err);
          alert(err.error?.message || 'Error en registro');
        }
      });
    }
  }

  exportarPDF() { window.print(); }
}