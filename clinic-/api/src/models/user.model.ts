import { model, Schema } from "mongoose";

export const userRoles = ["patient", "doctor", "receptionist", "admin"] as const;
export type UserRole = (typeof userRoles)[number];

export interface UserDocument {
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    // TODO(auth lesson): swap for a real bcrypt hash once hashing is covered.
    passwordHash: {
      type: String,
      required: true,
      select: false
    },
    role: {
      type: String,
      enum: userRoles,
      default: "patient"
    }
  },
  {
    timestamps: true
  }
);

export const User = model<UserDocument>("User", userSchema);
