import { Component, OnInit } from '@angular/core';
import { VentaService } from 'src/app/service/venta.service';
import { ProductoService } from 'src/app/service/producto.service'; // Asegúrate que exista
import { Router } from '@angular/router';
import { IonHeader, IonCardSubtitle, IonContent, IonIcon } from "@ionic/angular/standalone";

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.page.html',
  styleUrls: ['./estadisticas.page.scss'],
  standalone:false,
})
export class EstadisticasPage implements OnInit {
  fechaActual = new Date();
  nombreMesActual = '';
  anioActual = 0;
  gananciasDelMes = 0;
  totalVentas = 0;
  totalProductos = 0;
  topVentasDelMes: any[] = [];
  productosMasVendidos: any[] = [];
  productosConMasStock: any[] = [];
  productosConMenosStock: any[] = [];
  mostrarModal: boolean = false;
tituloModal: string = '';
productosModal: any[] = [];

  constructor(
    private ventaService: VentaService,
    private router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit() {
    this.actualizarMes();
    this.cargarProductos();
  }

  

  actualizarMes() {
    this.nombreMesActual = this.fechaActual.toLocaleString('es-CL', { month: 'long' });
    this.anioActual = this.fechaActual.getFullYear();
    this.obtenerVentasDelMes();
  }

  cambiarMes(direccion: number) {
    this.fechaActual.setMonth(this.fechaActual.getMonth() + direccion);
    this.actualizarMes();
  }

  obtenerVentasDelMes() {
  this.ventaService.getVentas().subscribe((ventas) => {
    const mes = this.fechaActual.getMonth();
    const anio = this.fechaActual.getFullYear();

    const ventasDelMes = ventas.filter((venta) => {
      const fechaVenta = new Date(venta.fecha);
      return (
        fechaVenta.getMonth() === mes &&
        fechaVenta.getFullYear() === anio
      );
    });

    this.totalVentas = ventasDelMes.length;
    this.gananciasDelMes = ventasDelMes.reduce((acc, venta) => acc + venta.montoTotal, 0);

    // Calcular productos más vendidos este mes
    const contadorProductos: { [nombre: string]: { nombre: string, cantidadVendida: number, gananciaTotal: number } } = {};

    ventasDelMes.forEach((venta: any) => {
      venta.VentaProductos.forEach((vp: any) => {
        const nombre = vp.producto?.nombre ?? 'Desconocido';
        const ganancia = vp.precioUnitario * vp.cantidad;

        if (!contadorProductos[nombre]) {
          contadorProductos[nombre] = {
            nombre,
            cantidadVendida: 0,
            gananciaTotal: 0,
          };
        }

        contadorProductos[nombre].cantidadVendida += vp.cantidad;
        contadorProductos[nombre].gananciaTotal += ganancia;
      });
    });

    const top = Object.values(contadorProductos)
      .sort((a, b) => b.gananciaTotal - a.gananciaTotal)
      .slice(0, 5);

    this.topVentasDelMes = top;
  });
}

  cargarProductos() {
    this.productoService.getProductos().subscribe((productos) => {
      this.totalProductos = productos.length;

      const ordenadosPorStock = [...productos].sort((a, b) => b.stock - a.stock);

      this.productosConMasStock = ordenadosPorStock.slice(0, 3);
      this.productosConMenosStock = ordenadosPorStock.reverse().slice(0, 3);
    });
  }

  // 2. Método para abrir el modal con tipo de estadística
verMasEstadistica(tipo: string) {
  this.tituloModal = '';
  this.productosModal = [];

  if (tipo === 'ventas') {
    this.tituloModal = 'Productos más vendidos';
    this.ventaService.getVentas().subscribe((ventas) => {
      const contador: { [nombre: string]: { nombre: string, cantidadVendida: number } } = {};

      ventas.forEach((venta: any) => {
        venta.VentaProductos.forEach((vp: any) => {
          const nombre = vp.producto?.nombre ?? 'Desconocido';
          if (!contador[nombre]) {
            contador[nombre] = { nombre, cantidadVendida: 0 };
          }
          contador[nombre].cantidadVendida += vp.cantidad;
        });
      });

      this.productosModal = Object.values(contador).sort((a, b) => b.cantidadVendida - a.cantidadVendida);
      this.mostrarModal = true;
    });
  } else if (tipo === 'stockMas') {
    this.tituloModal = 'Productos con más stock';
    this.productoService.getProductos().subscribe((productos) => {
      this.productosModal = [...productos].sort((a, b) => b.stock - a.stock);
      this.mostrarModal = true;
    });
  } else if (tipo === 'stockMenos') {
    this.tituloModal = 'Productos con menos stock';
    this.productoService.getProductos().subscribe((productos) => {
      this.productosModal = [...productos].sort((a, b) => a.stock - b.stock);
      this.mostrarModal = true;
    });
  }
}

// 3. Método para cerrar el modal
cerrarModal() {
  this.mostrarModal = false;
  this.productosModal = [];
  this.tituloModal = '';
}

  goBack() {
    this.router.navigate(['/principal']);
  }
}
