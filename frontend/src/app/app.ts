import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// Componente principal de la aplicación: contiene la barra de navegación
// y el espacio donde se muestran las demás pantallas.
@Component({
  selector: 'app-root',
  // Herramientas que usa la plantilla (app.html):
  // RouterOutlet muestra la pantalla actual, RouterLink crea los enlaces
  // y RouterLinkActive marca el enlace de la página donde estoy.
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
