import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VentaService } from 'src/app/service/venta.service';
import { IonHeader, IonButton, IonToolbar, IonTitle, IonButtons, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.page.html',
  styleUrls: ['./historial-ventas.page.scss'],
  standalone:false,
})
export class HistorialVentasPage implements OnInit {
  ventas: any[] = [];

  constructor(private ventaService: VentaService, private router: Router,) {}

  ngOnInit() {
    this.cargarVentas();
  }

  cargarVentas() {
    this.ventaService.getVentas().subscribe({
      next: (data) => {
        this.ventas = data;
      },
      error: (err) => {
        console.error('Error al cargar ventas', err);
      },
    });
  }

  goBack() {
    this.router.navigate(['/principal']);
  }
}
