import { Routes } from '@angular/router';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeedbackComponent } from './components/feedback/feedback.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  // 1. Ruta por defecto: Apenas entra, lo mandamos a loguearse
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  
  // 2. Pantalla de Autenticación
  { path: 'login', component: LoginComponent },
  
  // 3. Vistas Principales del Muro Escolar
  { 
    path: 'galeria', 
    component: GaleriaComponent,
    canActivate: [authGuard] // Bloqueado si no hay token
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] // Bloqueado si no hay token
  },
  { 
    path: 'feedback/:id', 
    component: FeedbackComponent,
    canActivate: [authGuard] // Bloqueado si no hay token
  },
  
  // 4. Ruta comodín (Wildcard): Si escriben una URL que no existe, vuelven al login
  { path: '**', redirectTo: 'login' }
];