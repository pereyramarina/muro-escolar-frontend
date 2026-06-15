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
  
  public archivoSeleccionado: File | null = null; 

  public paginaActual: number = 1;
  public paginasTotales: number = 1;
  public limitePorPagina: number = 10;
  public searchControl = new FormControl('');
  public tecnicasDisponibles: string[] = ['Acuarela', 'Óleo', 'Acrílico', 'Arte Digital', 'Dibujo a Lápiz', 'Técnica Mixta', 'Escultura', 'Fotografía'];
  public imagenModalActiva: string | null = null;
  
  // Variable para validar la autoría de la obra
  public idUsuarioLogueado: string = '';

  constructor() {
    this.obraForm = this.fb.group({
      titulo: ['', Validators.required],
      descripcion: ['', Validators.required] 
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
    // Inicializamos la identidad del usuario actual
    this.idUsuarioLogueado = this.authService.getUserId()?.toString() || '';
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

  public capturarArchivo(event: any): void {
    const archivo = event.target.files[0];
    if (archivo) {
      this.archivoSeleccionado = archivo;
    }
  }

  public abrirModal(url: string): void {
    this.imagenModalActiva = url;
  }

  public cerrarModal(): void {
    this.imagenModalActiva = null;
  }

  public guardarObra(): void {
    if (this.obraForm.valid && this.archivoSeleccionado) {
      
      const formData = new FormData();
      formData.append('titulo', this.obraForm.get('titulo')?.value);
      formData.append('descripcion', this.obraForm.get('descripcion')?.value);
      
      const idAlumno = this.authService.getUserId();
      formData.append('alumnoId', idAlumno ? idAlumno.toString() : ''); 
      
      formData.append('imagen', this.archivoSeleccionado); 

      this.obrasService.subirObra(formData).subscribe({
        next: (nuevaObra) => {
          this.paginaActual = 1;
          this.searchControl.setValue(''); 
          this.obtenerObrasDelServidor(this.paginaActual);
          this.obraForm.reset();
          this.obraForm.get('descripcion')?.setValue('');
          this.archivoSeleccionado = null; 
          alert('¡Obra publicada con éxito en el Muro!');
        },
        error: (error) => {
          console.error('Error al subir la obra:', error);
          alert('Hubo un error al guardar. Revisa la consola.');
        }
      });
    } else {
      alert('Por favor, completa el título, selecciona una técnica y adjunta una imagen.');
    }
  }

  // --- NUEVO MÉTODO PARA ELIMINAR OBRA ---
  public eliminarObra(idObra: number | undefined, idAlumnoObra: string): void {
    if (!idObra) return;

    if (this.idUsuarioLogueado !== idAlumnoObra) {
      alert('Acción denegada: Restricción de autoría.');
      return;
    }

    if (confirm('¿Confirmar eliminación permanente del registro?')) {
      this.obrasService.eliminarObra(idObra).subscribe({
        next: () => {
          alert('Registro eliminado.');
          this.obtenerObrasDelServidor(this.paginaActual); 
        },
        error: (err) => {
          console.error('Falla en la red:', err);
          alert('Error en la transacción HTTP.');
        }
      });
    }
  }
}