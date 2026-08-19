import {
  Component,
  inject,
  OnInit,
  signal
} from "@angular/core";

import { FormsModule } from "@angular/forms";
import { DatePipe } from "@angular/common";

import { AppointmentService } from "../../core/services/appointment";
import { DoctorService } from "../../core/services/doctor";
import { BranchService } from "../../core/services/branch";
import { UserService } from "../../core/services/user";

import type { Appointment, CreateAppointmentInput } from "../../models/appointment";
import type { Doctor } from "../../models/doctor";
import type { Branch } from "../../models/branch";
import type { User } from "../../models/user";

@Component({
  selector: "app-appointments",
  imports: [
    FormsModule,
    DatePipe
  ],
  templateUrl: "./appointments.html",
  styleUrl: "./appointments.css"
})
export class Appointments implements OnInit {

  private readonly appointmentService = inject(AppointmentService);

  private readonly doctorService = inject(DoctorService);

  private readonly branchService = inject(BranchService);

  private readonly userService = inject(UserService);

  appointments = signal<Appointment[]>([]);

  doctors = signal<Doctor[]>([]);

  branches = signal<Branch[]>([]);

  patients = signal<User[]>([]);

  loading = signal(false);

  message = signal("");

  completingId = signal<string | null>(null);

  completeForm = {
    diagnosis: "",
    prescription: ""
  };

  form: CreateAppointmentInput = {
    patientId: "",
    doctorId: "",
    branchId: "",
    time: ""
  };

  ngOnInit(): void {
    this.loadLookups();
    this.loadAppointments();
  }

  loadLookups(): void {

    this.doctorService.getDoctors().subscribe({
      next: (response) => this.doctors.set(response.data)
    });

    this.branchService.getBranches().subscribe({
      next: (response) => this.branches.set(response.data)
    });

    this.userService.getUsers().subscribe({
      next: (response) => {
        this.patients.set(
          response.data.filter((user) => user.role === "patient")
        );
      }
    });
  }

  loadAppointments(): void {

    this.loading.set(true);
    this.message.set("");

    this.appointmentService
      .getAppointments()
      .subscribe({

        next: (response) => {

          this.appointments.set(response.data);

          this.loading.set(false);
        },

        error: () => {

          this.message.set("Could not load appointments");

          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    this.form = {
      patientId: "",
      doctorId: "",
      branchId: "",
      time: ""
    };
  }

  bookAppointment(): void {

    this.message.set("");

    this.appointmentService.createAppointment(this.form).subscribe({
      next: () => {
        this.message.set("Appointment booked successfully");
        this.resetForm();
        this.loadAppointments();
      },

      error: (error) => {
        this.message.set(
          error?.error?.message ?? "Could not book appointment"
        );
      }
    });
  }

  confirmAppointment(id: string): void {

    this.appointmentService.confirmAppointment(id).subscribe({
      next: () => {
        this.message.set("Appointment confirmed");
        this.loadAppointments();
      },
      error: () => {
        this.message.set("Could not confirm appointment");
      }
    });
  }

  cancelAppointment(id: string): void {

    const confirmed =
      window.confirm(
        "Cancel this appointment?"
      );

    if (!confirmed) {
      return;
    }

    this.appointmentService.cancelAppointment(id).subscribe({
      next: () => {
        this.message.set("Appointment cancelled");
        this.loadAppointments();
      },
      error: () => {
        this.message.set("Could not cancel appointment");
      }
    });
  }

  startComplete(id: string): void {
    this.completingId.set(id);
    this.completeForm = {
      diagnosis: "",
      prescription: ""
    };
  }

  cancelComplete(): void {
    this.completingId.set(null);
  }

  submitComplete(): void {

    const id = this.completingId();

    if (!id) {
      return;
    }

    this.appointmentService
      .completeAppointment(id, this.completeForm.diagnosis, this.completeForm.prescription)
      .subscribe({
        next: () => {
          this.message.set("Appointment completed");
          this.completingId.set(null);
          this.loadAppointments();
        },
        error: () => {
          this.message.set("Could not complete appointment");
        }
      });
  }

  patientName(appointment: Appointment): string {
    return typeof appointment.patient === "string"
      ? appointment.patient
      : appointment.patient.name;
  }

  doctorName(appointment: Appointment): string {
    return typeof appointment.doctor === "string"
      ? appointment.doctor
      : appointment.doctor.name;
  }

  branchName(appointment: Appointment): string {
    return typeof appointment.branch === "string"
      ? appointment.branch
      : appointment.branch.name;
  }

}
