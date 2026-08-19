import type { Branch } from "./branch";

export interface Doctor {
  _id: string;
  name: string;
  specialty: string;
  branch: Branch | string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateDoctorInput {
  name: string;
  specialty: string;
  branchId: string;
}

export type UpdateDoctorInput =
  Partial<CreateDoctorInput>;
