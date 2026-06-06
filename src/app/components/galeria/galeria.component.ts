import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-galeria',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galeria.component.html',
  styleUrl: './galeria.component.css'
})
export class GaleriaComponent implements OnInit {
  listaObras: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerObras();
  }

  obtenerObras() {
    this.http.get<any>('http://localhost:3000/obras').subscribe({
      next: (respuesta) => {
        // Aseguramos que los datos estén presentes
        this.listaObras = respuesta.datos || []; 
        console.log('Obras cargadas con éxito:', this.listaObras);
      },
      error: (error) => {
        console.error('Hubo un error al cargar las obras:', error);
      }
    });
  }
}