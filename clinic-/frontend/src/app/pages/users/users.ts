import {
  Component,
  inject,
  OnInit,
  signal
} from "@angular/core";

import { FormsModule } from "@angular/forms";

import { UserService } from "../../core/services/user";

import type { RegisterUserInput, User, UserRole } from "../../models/user";

@Component({
  selector: "app-users",
  imports: [
    FormsModule
  ],
  templateUrl: "./users.html",
  styleUrl: "./users.css"
})
export class Users implements OnInit {

  private readonly userService = inject(UserService);

  users = signal<User[]>([]);

  loading = signal(false);

  message = signal("");

  roles: UserRole[] = [
    "patient",
    "doctor",
    "receptionist",
    "admin"
  ];

  form: RegisterUserInput = {
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "patient"
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {

    this.loading.set(true);
    this.message.set("");

    this.userService
      .getUsers()
      .subscribe({

        next: (response) => {

          this.users.set(response.data);

          this.loading.set(false);
        },

        error: () => {

          this.message.set("Could not load users");

          this.loading.set(false);
        }
      });
  }

  resetForm(): void {
    this.form = {
      name: "",
      email: "",
      phone: "",
      password: "",
      role: "patient"
    };
  }

  registerUser(): void {

    this.message.set("");

    this.userService.registerUser(this.form).subscribe({
      next: () => {
        this.message.set("User registered successfully");
        this.resetForm();
        this.loadUsers();
      },

      error: () => {
        this.message.set(
          "Could not register user"
        );
      }
    });
  }

}
