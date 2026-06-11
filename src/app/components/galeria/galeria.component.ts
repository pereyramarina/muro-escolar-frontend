import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; 
import { ObrasService, Obra } from '../../services/obras.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  private obrasService = inject(ObrasService);
  private fb = inject(FormBuilder);

  public obras: Obra[] = [];
  public obraForm: FormGroup; 
  public esAlumno: boolean = false; 

  // --- VARIABLES DE PAGINACIÓN ---
  public paginaActual: number = 1;
  public paginasTotales: number = 1;
  public limitePorPagina: number = 10;

  constructor() {
    this.obraForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required],
      imagenUrl: ['', Validators.required],
      alumnoId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.verificarRol();
    this.obtenerObrasDelServidor(this.paginaActual);
  }

  private verificarRol(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        this.esAlumno = payloadJson.rol === 'alumno'; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.esAlumno = false;
      }
    }
  }

  private obtenerObrasDelServidor(page: number): void {
    this.obrasService.obtenerObras(page, this.limitePorPagina).subscribe({
      next: (respuesta: any) => { 
        this.obras = respuesta.datos; 
        this.paginaActual = respuesta.paginaActual;
        this.paginasTotales = respuesta.paginasTotales;
      },
      error: (error) => console.error('Error de red:', error)
    });
  }

  public cambiarPagina(nuevaPagina: number): void {
    if (nuevaPagina >= 1 && nuevaPagina <= this.paginasTotales) {
      this.paginaActual = nuevaPagina;
      this.obtenerObrasDelServidor(this.paginaActual);
    }
  }

  public guardarObra(): void {
    if (this.obraForm.valid) {
      this.obrasService.subirObra(this.obraForm.value).subscribe({
        next: (nuevaObra) => {
          // Si sube un trabajo nuevo, lo enviamos de regreso a la página 1 para que lo vea
          this.paginaActual = 1;
          this.obtenerObrasDelServidor(this.paginaActual);
          this.obraForm.reset();
          alert('¡Obra publicada con éxito en el Muro!');
        },
        error: (error) => {
          console.error('Error al subir la obra:', error);
          alert('Hubo un error al guardar. Revisa la consola.');
        }
      });
    }
  }
}