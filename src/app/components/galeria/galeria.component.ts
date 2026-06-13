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
  
  // Archivo binario capturado
  public archivoSeleccionado: File | null = null; 

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

  // Captura del archivo físico
  public capturarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  public guardarObra(): void {
    if (this.obraForm.valid && this.archivoSeleccionado) {
      
      const formData = new FormData();
      formData.append('titulo', this.obraForm.get('titulo')?.value);
      formData.append('descripcion', this.obraForm.get('descripcion')?.value);
      formData.append('alumnoId', this.obraForm.get('alumnoId')?.value);
      formData.append('imagen', this.archivoSeleccionado); 

      this.obrasService.subirObra(formData).subscribe({
        next: (nuevaObra) => {
          this.paginaActual = 1;
          this.searchControl.setValue(''); 
          this.obtenerObrasDelServidor(this.paginaActual);
          this.obraForm.reset();
          this.archivoSeleccionado = null; 
          alert('¡Obra publicada con éxito en el Muro!');
        },
        error: (error) => {
          console.error('Error al subir la obra:', error);
          alert('Hubo un error al guardar. Revisa la consola.');
        }
      });
    } else {
      alert('Por favor, completa los campos de texto y selecciona una imagen.');
    }
  }
}