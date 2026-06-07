import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router'; 
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.css'
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  cargando = false;
  obraId: number = 0; 

  // Variables para controlar la notificación UX
  mensajeNotificacion: string = '';
  tipoNotificacion: string = ''; 

  constructor(
    private fb: FormBuilder, 
    private http: HttpClient,
    private route: ActivatedRoute 
  ) {
    this.feedbackForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(10)]],
      calificacion: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      
      if (idParam && idParam !== 'undefined' && idParam !== 'NaN') {
        this.obraId = Number(idParam);
      } else {
        console.error('Error de enrutamiento: ID inválido.');
        this.obraId = 0; 
      }
    });
  }

  // Método para manejar la aparición y desaparición del Toast
  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error') {
    this.mensajeNotificacion = mensaje;
    this.tipoNotificacion = tipo;

    // La notificación desaparece sola después de 4 segundos
    setTimeout(() => {
      this.mensajeNotificacion = '';
    }, 4000);
  }

  enviarFeedback() {
    if (this.feedbackForm.valid && this.obraId > 0) {
      this.cargando = true;
      
      const payload = {
        id_obra: this.obraId,
        id_docente: 2, 
        comentario_pedagogico: this.feedbackForm.value.comentario
      };

      // Solicitud HTTP utilizando la variable de entorno desacoplada
      this.http.post(`${environment.apiUrl}/feedback`, payload).subscribe({
        next: (res) => {
          this.mostrarNotificacion('Registro procesado exitosamente.', 'exito');
          this.cargando = false;
          this.feedbackForm.reset();
        },
        error: (err) => {
          console.error('Fallo en la comunicación:', err);
          this.mostrarNotificacion('Excepción al registrar el feedback. Revisa la consola.', 'error');
          this.cargando = false;
        }
      });
    } else {
      this.mostrarNotificacion('Validación fallida: Revisa los datos del formulario.', 'error');
    }
  }
}