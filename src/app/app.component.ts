import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'muro-escolar-frontend';

  constructor(public authService: AuthService) {}

  get esDirectivo(): boolean {
    return this.authService.getRole() === 'directivo';
  }

  // Lógica para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout();
    window.location.href = '/login'; // Redirige y refresca el estado
  }
}