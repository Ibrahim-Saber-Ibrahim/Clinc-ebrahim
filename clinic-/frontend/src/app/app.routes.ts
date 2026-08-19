import {
  Routes
} from "@angular/router";

import {
  Branches
} from "./pages/branches/branches";

import {
  Doctors
} from "./pages/doctors/doctors";

import {
  Users
} from "./pages/users/users";

import {
  Appointments
} from "./pages/appointments/appointments";

export const routes: Routes = [

  {
    path: "",
    redirectTo: "branches",
    pathMatch: "full"
  },

  {
    path: "branches",
    component: Branches
  },

  {
    path: "doctors",
    component: Doctors
  },

  {
    path: "users",
    component: Users
  },

  {
    path: "appointments",
    component: Appointments
  },

  {
    path: "**",
    redirectTo: "branches"
  }
];
