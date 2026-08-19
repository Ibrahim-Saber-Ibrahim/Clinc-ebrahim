import {
  inject,
  Injectable
} from "@angular/core";

import {
  HttpClient
} from "@angular/common/http";

import {
  Observable
} from "rxjs";

import {
  API_BASE_URL
} from "../api.config";

import type {
  ApiResponse
} from "../../models/api-response";

import type {
  Appointment,
  CreateAppointmentInput
} from "../../models/appointment";

@Injectable({
  providedIn: "root"
})
export class AppointmentService {

  private readonly http =
    inject(HttpClient);

  private readonly url = `${API_BASE_URL}/appointments`;

  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(this.url);
  }

  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.url}/${id}`);
  }

  createAppointment(appointment: CreateAppointmentInput): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.url, appointment);
  }

  confirmAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.url}/${id}/confirm`, {});
  }

  cancelAppointment(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.url}/${id}/cancel`, {});
  }

  completeAppointment(
    id: string,
    diagnosis: string,
    prescription: string
  ): Observable<ApiResponse<Appointment>> {
    return this.http.patch<ApiResponse<Appointment>>(`${this.url}/${id}/complete`, {
      diagnosis,
      prescription
    });
  }

}
