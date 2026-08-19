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
  RegisterUserInput,
  User
} from "../../models/user";

@Injectable({
  providedIn: "root"
})
export class UserService {

  private readonly http =
    inject(HttpClient);

  private readonly url = `${API_BASE_URL}/users`;

  getUsers(): Observable<ApiResponse<User[]>> {
    return this.http.get<ApiResponse<User[]>>(this.url);
  }

  getUserById(id: string): Observable<ApiResponse<User>> {
    return this.http.get<ApiResponse<User>>(`${this.url}/${id}`);
  }

  registerUser(user: RegisterUserInput): Observable<ApiResponse<User>> {
    return this.http.post<ApiResponse<User>>(`${this.url}/register`, user);
  }

}
