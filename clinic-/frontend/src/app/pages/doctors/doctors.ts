import {
  Component,
  inject,
  OnInit,
  signal
} from "@angular/core";

import { FormsModule } from "@angular/forms";

import { DoctorService } from "../../core/services/doctor";
import { BranchService } from "../../core/services/branch";

import type { CreateDoctorInput, Doctor } from "../../models/doctor";
import type { Branch } from "../../models/branch";

@Component({
  selector: "app-doctors",
  imports: [
    FormsModule
  ],
  templateUrl: "./doctors.html",
  styleUrl: "./doctors.css"
})
export class Doctors implements OnInit {

  private readonly doctorService = inject(DoctorService);

  private readonly branchService = inject(BranchService);

  doctors = signal<Doctor[]>([]);

  branches = signal<Branch[]>([]);

  loading = signal(false);

  message = signal("");

  editingDoctorId = signal<string | null>(null);

  form: CreateDoctorInput = {
    name: "",
    specialty: "",
    branchId: ""
  };

  ngOnInit(): void {
    this.loadBranches();
    this.loadDoctors();
  }

  loadBranches(): void {

    this.branchService.getBranches().subscribe({
      next: (response) => {
        this.branches.set(response.data);
      },
      error: () => {
        this.message.set("Could not load branches");
      }
    });
  }

  loadDoctors(): void {

    this.loading.set(true);
    this.message.set("");

    this.doctorService
      .getDoctors()
      .subscribe({

        next: (response) => {

          this.doctors.set(response.data);

          this.loading.set(false);
        },

        error: () => {

          this.message.set("Could not load doctors");

          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    this.form = {
      name: "",
      specialty: "",
      branchId: this.branches()[0]?._id ?? ""
    };
  }

  saveDoctor(): void {

    this.message.set("");

    const editingId = this.editingDoctorId();

    if (editingId) {

      this.doctorService.updateDoctor(editingId, this.form)
        .subscribe({
          next: () => {
            this.message.set(
              "Doctor updated successfully"
            );
            this.cancelEdit();
            this.loadDoctors();
          },

          error: () => {
            this.message.set(
              "Could not update doctor"
            );
          }
        });

      return;
    }

    this.doctorService.createDoctor(this.form).subscribe({
      next: () => {
        this.message.set("Doctor created successfully");
        this.resetForm();
        this.loadDoctors();
      },

      error: () => {
        this.message.set(
          "Could not create doctor"
        );
      }
    });
  }

  deactivateDoctor(id: string): void {

    const confirmed =
      window.confirm(
        "Deactivate this doctor?"
      );

    if (!confirmed) {
      return;
    }

    this.doctorService.deactivateDoctor(id).subscribe({
      next: () => {
        this.message.set(
          "Doctor deactivated"
        );

        this.loadDoctors();
      },
      error: () => {

        this.message.set(
          "Could not deactivate doctor"
        );
      }
    });
  }

  startEdit(doctor: Doctor): void {

    this.editingDoctorId.set(doctor._id);
    this.form = {
      name: doctor.name,
      specialty: doctor.specialty,
      branchId:
        typeof doctor.branch === "string"
          ? doctor.branch
          : doctor.branch._id
    };
  }

  cancelEdit(): void {

    this.editingDoctorId.set(null);

    this.resetForm();
  }

  branchName(doctor: Doctor): string {
    return typeof doctor.branch === "string"
      ? doctor.branch
      : doctor.branch.name;
  }

}
