import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reservaciones } from '../entities/reservaciones';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReservacionesService {
  private url = 'http://localhost:8082/api/reservaciones';

  constructor(private http: HttpClient, private authService: AuthService) {}

  public getReservaciones(): Observable<Reservaciones[]> {
    return this.http.get<Reservaciones[]>(`${this.url}/ver_todos`);
  }

  buscarReservaciones(origen: string, destino: string, fecha: string): Observable<Reservaciones[]> {
  const params = new HttpParams()
    .set('origen', origen)
    .set('destino', destino)
    .set('fecha', fecha); // fecha ya está formateada

  return this.http.get<Reservaciones[]>(`${this.url}/buscar_por_origen_destino_fecha`, { params });
}


  buscarReservacionesporDia(dia: number): Observable<Reservaciones> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.authService.isUsername() + ':' + this.authService.isPassword()),
      'Content-Type': 'application/json'
    });

    return this.http.post<Reservaciones>(`${this.url}/buscar_por_dia`, dia, { headers });
  }

  CancelarReservacion(id: number): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.authService.isUsername() + ':' + this.authService.isPassword()),
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.url}/borrar`, id, { headers });
  }

  BuscarReservacion(id: number): Observable<Reservaciones> {
    return this.http.post<Reservaciones>(`${this.url}/buscar`, id);
  }

  GuardarReservacion(reservacion: Reservaciones): Observable<Reservaciones> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.authService.isUsername() + ':' + this.authService.isPassword()),
      'Content-Type': 'application/json'
    });

    return this.http.post<Reservaciones>(`${this.url}/guardar`, reservacion, { headers });
  }

  ActualizarEstadoRservacion(id: number, estado: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: 'Basic ' + btoa(this.authService.isUsername() + ':' + this.authService.isPassword()),
      'Content-Type': 'application/json'
    });

    const body = {
      id_de_reserva: id,
      estado: estado
    };

    return this.http.put(`${this.url}/actalizar-estado`, body, { headers });
  }
}
