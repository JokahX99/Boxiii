import { Component, OnInit } from '@angular/core';
import { VentaService } from 'src/app/service/venta.service';

@Component({
  selector: 'app-historial-ventas',
  templateUrl: './historial-ventas.page.html',
  styleUrls: ['./historial-ventas.page.scss'],
  standalone:false,
})
export class HistorialVentasPage implements OnInit {
  ventas: any[] = [];

  constructor(private ventaService: VentaService) {}

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
}
