import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Definimos las reglas de validación: ambos campos son obligatorios
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, dni } = this.loginForm.value;
      
      this.authService.login(email, dni).subscribe({
        next: () => {
          // Si el backend responde con el Token, leemos el rol y redirigimos
          const rol = this.authService.getRole();
          if (rol === 'admin') {
            this.router.navigate(['/dashboard']); // Docente
          } else if (rol === 'user') {
            this.router.navigate(['/galeria']);   // Estudiante
          } else {
            this.router.navigate(['/dashboard']); // Directivo
          }
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = 'Credenciales incorrectas. Verifica tu Gmail o DNI.';
        }
      });
    }
  }
}