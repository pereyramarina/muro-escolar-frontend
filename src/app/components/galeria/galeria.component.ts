import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'; 
import { ObrasService, Obra } from '../../services/obras.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule], 
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})
export class GaleriaComponent implements OnInit {
  private obrasService = inject(ObrasService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  public obras: Obra[] = [];
  public obraForm: FormGroup; 
  public esAlumno: boolean = false; 
  public esDocente: boolean = false;

  // --- VARIABLES DE PAGINACIÓN ---
  public paginaActual: number = 1;
  public paginasTotales: number = 1;
  public limitePorPagina: number = 10;

  // --- VARIABLE DE BÚSQUEDA ---
  public searchControl = new FormControl('');

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
    const rol = this.authService.getRole();
    this.esAlumno = (rol === 'alumno');
    this.esDocente = (rol === 'docente');
  }

  private obtenerObrasDelServidor(page: number): void {
    const termino = this.searchControl.value || ''; 

    this.obrasService.obtenerObras(page, this.limitePorPagina, termino).subscribe({
      next: (respuesta: any) => { 
        this.obras = respuesta.datos; 
        this.paginaActual = respuesta.paginaActual;
        this.paginasTotales = respuesta.paginasTotales;
      },
      error: (error) => console.error('Error de red:', error)
    });
  }

  public realizarBusqueda(): void {
    this.paginaActual = 1; 
    this.obtenerObrasDelServidor(this.paginaActual);
  }

  public limpiarBusqueda(): void {
    this.searchControl.setValue('');
    this.realizarBusqueda();
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
          this.paginaActual = 1;
          this.searchControl.setValue(''); 
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