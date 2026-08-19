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
  CreateDoctorInput,
  Doctor,
  UpdateDoctorInput
} from "../../models/doctor";

@Injectable({
  providedIn: "root"
})
export class DoctorService {

  private readonly http =
    inject(HttpClient);

  private readonly url = `${API_BASE_URL}/doctors`;

  getDoctors(): Observable<ApiResponse<Doctor[]>> {
    return this.http.get<ApiResponse<Doctor[]>>(this.url);
  }

  getDoctorById(id: string): Observable<ApiResponse<Doctor>> {
    return this.http.get<ApiResponse<Doctor>>(`${this.url}/${id}`);
  }

  createDoctor(doctor: CreateDoctorInput): Observable<ApiResponse<Doctor>> {
    return this.http.post<ApiResponse<Doctor>>(this.url, doctor);
  }

  updateDoctor(id: string, updates: UpdateDoctorInput): Observable<ApiResponse<Doctor>> {
    return this.http.put<ApiResponse<Doctor>>(`${this.url}/${id}`, updates);
  }

  deactivateDoctor(id: string): Observable<ApiResponse<Doctor>> {
    return this.http.patch<ApiResponse<Doctor>>(`${this.url}/${id}/deactivate`, {});
  }

}
