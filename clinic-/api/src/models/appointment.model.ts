import { model, Schema, Types } from "mongoose";

export const appointmentStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled"
] as const;

export type AppointmentStatus = (typeof appointmentStatuses)[number];

export interface AppointmentDocument {
  patient: Types.ObjectId;
  doctor: Types.ObjectId;
  branch: Types.ObjectId;
  time: Date;
  status: AppointmentStatus;
  diagnosis?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<AppointmentDocument>(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    doctor: {
      type: Schema.Types.ObjectId,
      ref: "Doctor",
      required: true
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    time: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: appointmentStatuses,
      default: "pending"
    },
    diagnosis: {
      type: String,
      trim: true
    },
    prescription: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// No double-booking: two active (non-cancelled) appointments cannot share
// the same doctor + time. Enforced at the database level as a safety net.
appointmentSchema.index(
  { doctor: 1, time: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $ne: "cancelled" } }
  }
);

export const Appointment = model<AppointmentDocument>(
  "Appointment",
  appointmentSchema
);
