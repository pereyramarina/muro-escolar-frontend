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
  
  // Variable para controlar la visibilidad del formulario en el HTML
  public esAlumno: boolean = false; 

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
    this.obtenerObrasDelServidor();
  }

  private verificarRol(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payloadBase64 = token.split('.')[1];
        const payloadJson = JSON.parse(atob(payloadBase64));
        
        // Verificamos si el rol es 'alumno' para mostrarle el formulario
        this.esAlumno = payloadJson.rol === 'alumno'; 
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.esAlumno = false;
      }
    }
  }

  private obtenerObrasDelServidor(): void {
    this.obrasService.obtenerObras().subscribe({
      next: (respuesta: any) => { 
        this.obras = respuesta.datos; 
      },
      error: (error) => console.error('Error de red:', error)
    });
  }

  public guardarObra(): void {
    if (this.obraForm.valid) {
      this.obrasService.subirObra(this.obraForm.value).subscribe({
        next: (nuevaObra) => {
          this.obtenerObrasDelServidor();
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