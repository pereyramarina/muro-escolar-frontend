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
  rolSeleccionado: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      dni: ['', [Validators.required, Validators.minLength(7)]]
    });
  }

  seleccionarRol(rol: string) {
    this.rolSeleccionado = rol;
    this.mensajeError = '';
    this.loginForm.reset();
  }

  volver() {
    this.rolSeleccionado = null;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, dni } = this.loginForm.value;
      
      this.authService.login(email, dni).subscribe({
        next: () => {
          const rolReal = this.authService.getRole(); 
          
          if (rolReal === 'docente') {
            this.router.navigate(['/galeria']); 
          } else if (rolReal === 'alumno') {
            this.router.navigate(['/galeria']); 
          } else if (rolReal === 'directivo') {
            this.router.navigate(['/dashboard']); 
          } else {
            this.router.navigate(['/login']); 
          }
        },
        error: (err) => {
          console.error(err);
          this.mensajeError = 'Credenciales incorrectas. Verifica tu correo o DNI.';
        }
      });
    }
  }
}