import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf
import { AuthService } from './auth.service';   // Tu servicio de seguridad

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'muro-escolar-frontend';

  // Inyectamos el servicio de forma pública para usarlo en el HTML
  constructor(public authService: AuthService) {}

  // Lógica para decidir si mostrar el botón del Panel Analítico
  get esDirectivo(): boolean {
    return this.authService.getRole() === 'directivo';
  }

  // Lógica para cerrar sesión
  cerrarSesion(): void {
    this.authService.logout();
    window.location.href = '/login'; // Redirige y refresca el estado
  }
}