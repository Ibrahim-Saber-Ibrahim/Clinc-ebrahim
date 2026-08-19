import { model, Schema, Types } from "mongoose";

export interface DoctorDocument {
  name: string;
  specialty: string;
  branch: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const doctorSchema = new Schema<DoctorDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    specialty: {
      type: String,
      required: true,
      trim: true
    },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const Doctor = model<DoctorDocument>("Doctor", doctorSchema);
