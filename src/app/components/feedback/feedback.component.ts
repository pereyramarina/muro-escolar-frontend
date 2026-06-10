import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; 
import { FeedbackService } from '../../services/feedback.service';

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
  obraId: number = 0; // Restaurado a número

  mensajeNotificacion: string = '';
  tipoNotificacion: string = ''; 

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private feedbackService = inject(FeedbackService);

  constructor() {
    this.feedbackForm = this.fb.group({
      comentario: ['', [Validators.required, Validators.minLength(10)]],
      calificacion: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    
    if (idParam && idParam !== 'undefined' && idParam !== 'NaN') {
      this.obraId = Number(idParam);
    } else {
      this.obraId = 0; 
    }
  }

  mostrarNotificacion(mensaje: string, tipo: 'exito' | 'error') {
    this.mensajeNotificacion = mensaje;
    this.tipoNotificacion = tipo;
    setTimeout(() => { this.mensajeNotificacion = ''; }, 4000);
  }

  enviarFeedback() {
    if (this.feedbackForm.valid && this.obraId > 0) {
      this.cargando = true;
      
      const payload = {
        id_obra: this.obraId,
        id_docente: 2, 
        comentario_pedagogico: this.feedbackForm.value.comentario,
        calificacion: this.feedbackForm.value.calificacion
      };

      this.feedbackService.enviarFeedback(payload).subscribe({
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
      this.mostrarNotificacion('Validación fallida: Verifica los datos.', 'error');
    }
  }
}