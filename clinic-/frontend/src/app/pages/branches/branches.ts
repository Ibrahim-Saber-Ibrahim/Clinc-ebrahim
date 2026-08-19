import {
  Component,
  inject,
  OnInit,
  signal
} from "@angular/core";

import { FormsModule } from "@angular/forms";

import { BranchService } from "../../core/services/branch";

import type { Branch, CreateBranchInput } from "../../models/branch";

@Component({
  selector: "app-branches",
  imports: [
    FormsModule
  ],
  templateUrl: "./branches.html",
  styleUrl: "./branches.css"
})
export class Branches implements OnInit {

  private readonly branchService = inject(BranchService);

  branches = signal<Branch[]>([]);

  loading = signal(false);

  message = signal("");

  editingBranchId = signal<string | null>(null);

  form: CreateBranchInput = {
    name: "",
    address: "",
    phone: ""
  };

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {

    this.loading.set(true);
    this.message.set("");

    this.branchService
      .getBranches()
      .subscribe({

        next: (response) => {

          this.branches.set(response.data);

          this.loading.set(false);
        },

        error: () => {

          this.message.set("Could not load branches");

          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    this.form = {
      name: "",
      address: "",
      phone: ""
    };
  }

  saveBranch(): void {

    this.message.set("");

    const editingId = this.editingBranchId();

    if (editingId) {

      this.branchService.updateBranch(editingId, this.form)
        .subscribe({
          next: () => {
            this.message.set(
              "Branch updated successfully"
            );
            this.cancelEdit();
            this.loadBranches();
          },

          error: () => {
            this.message.set(
              "Could not update branch"
            );
          }
        });

      return;
    }

    this.branchService.createBranch(this.form).subscribe({
      next: () => {
        this.message.set("Branch created successfully");
        this.resetForm();
        this.loadBranches();
      },

      error: () => {
        this.message.set(
          "Could not create branch"
        );
      }
    });
  }

  deactivateBranch(id: string): void {

    const confirmed =
      window.confirm(
        "Deactivate this branch?"
      );

    if (!confirmed) {
      return;
    }

    this.branchService.deactivateBranch(id).subscribe({
      next: () => {
        this.message.set(
          "Branch deactivated"
        );

        this.loadBranches();
      },
      error: () => {

        this.message.set(
          "Could not deactivate branch"
        );
      }
    });
  }

  startEdit(branch: Branch): void {

    this.editingBranchId.set(branch._id);
    this.form = {
      name: branch.name,
      address: branch.address,
      phone: branch.phone ?? ""
    };
  }

  cancelEdit(): void {

    this.editingBranchId.set(null);

    this.resetForm();
  }

}
