import { Routes } from '@angular/router';
import { GaleriaComponent } from './components/galeria/galeria.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FeedbackComponent } from './components/feedback/feedback.component';

export const routes: Routes = [
  { path: '', component: GaleriaComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'feedback/:id', component: FeedbackComponent },
  { path: '**', redirectTo: '' }
];