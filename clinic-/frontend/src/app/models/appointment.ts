import type { Branch } from "./branch";
import type { Doctor } from "./doctor";
import type { User } from "./user";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Appointment {
  _id: string;
  patient: User | string;
  doctor: Doctor | string;
  branch: Branch | string;
  time: string;
  status: AppointmentStatus;
  diagnosis?: string;
  prescription?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  branchId: string;
  time: string;
}
