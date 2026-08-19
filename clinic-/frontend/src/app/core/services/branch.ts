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
  Branch,
  CreateBranchInput,
  UpdateBranchInput
} from "../../models/branch";

@Injectable({
  providedIn: "root"
})
export class BranchService {

  private readonly http =
    inject(HttpClient);

  private readonly url = `${API_BASE_URL}/branches`;

  getBranches(): Observable<ApiResponse<Branch[]>> {
    return this.http.get<ApiResponse<Branch[]>>(this.url);
  }

  getBranchById(id: string): Observable<ApiResponse<Branch>> {
    return this.http.get<ApiResponse<Branch>>(`${this.url}/${id}`);
  }

  createBranch(branch: CreateBranchInput): Observable<ApiResponse<Branch>> {
    return this.http.post<ApiResponse<Branch>>(this.url, branch);
  }

  updateBranch(id: string, updates: UpdateBranchInput): Observable<ApiResponse<Branch>> {
    return this.http.put<ApiResponse<Branch>>(`${this.url}/${id}`, updates);
  }

  deactivateBranch(id: string): Observable<ApiResponse<Branch>> {
    return this.http.patch<ApiResponse<Branch>>(`${this.url}/${id}/deactivate`, {});
  }

}
