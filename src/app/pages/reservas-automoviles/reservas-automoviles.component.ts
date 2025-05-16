import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservacionesService } from '../../services/reservaciones.service';
import { Reservaciones } from '../../entities/reservaciones';
import { CardReservacionComponent } from '../../components/card-reservacion/card-reservacion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reservas-automoviles',
  standalone: true,
  imports: [CardReservacionComponent, CommonModule],
  templateUrl: './reservas-automoviles.component.html',
  styleUrl: './reservas-automoviles.component.css'
})
export class ReservasAutomovilesComponent implements OnInit {

  reservaciones: Reservaciones[] = [];
  reservaciones2: Reservaciones[] = [];
  origen: string = '';
  destino: string = '';
  fecha: string = '';
  InRserva: boolean = false;

  constructor(
    private reservacionesService: ReservacionesService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Obtener todas las reservaciones
    this.reservacionesService.getReservaciones().subscribe(dato => {
      this.reservaciones2 = dato;
    });

    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.origen = params['origen'];
      this.destino = params['destino'];
      const fechaRaw = params['fecha'];

      if (this.origen && this.destino && fechaRaw) {
        const fechaDate = new Date(fechaRaw);

        if (isNaN(fechaDate.getTime())) {
          console.error("❌ Fecha inválida:", fechaRaw);
          this.InRserva = false;
          return;
        }

        // Formatear la fecha a 'yyyy-MM-dd'
        const fechaFormateada = fechaDate.toISOString().split('T')[0];

        // Llamar al servicio con los parámetros correctos
        this.reservacionesService.buscarReservaciones(this.origen, this.destino, fechaFormateada)
          .subscribe(
            reservaciones => {
              this.reservaciones = reservaciones;
              console.log("✅ Reservaciones encontradas:", reservaciones);
              this.InRserva = true;
            },
            error => {
              console.error("❌ Error al obtener reservaciones:", error);
              this.InRserva = false;
            }
          );
      } else {
        console.log('⚠ No se recibieron parámetros completos.');
        this.InRserva = false;
      }
    });
  }
}
