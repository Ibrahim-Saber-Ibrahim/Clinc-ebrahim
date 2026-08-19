import type { Request, Response } from "express";
import { Appointment } from "../models/appointment.model";
import { Doctor } from "../models/doctor.model";
import { Branch } from "../models/branch.model";

// Book a new appointment — stays "pending" until the branch confirms it
export async function createAppointment(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { patientId, doctorId, branchId, time } = request.body;

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      response.status(400).json({ success: false, message: "Doctor not found" });
      return;
    }

    const branch = await Branch.findById(branchId);
    if (!branch) {
      response.status(400).json({ success: false, message: "Branch not found" });
      return;
    }

    if (doctor.branch.toString() !== branchId) {
      response
        .status(400)
        .json({ success: false, message: "This doctor does not work at that branch" });
      return;
    }

    const conflict = await Appointment.findOne({
      doctor: doctorId,
      time,
      status: { $ne: "cancelled" }
    });
    if (conflict) {
      response
        .status(409)
        .json({ success: false, message: "This doctor is already booked at that time" });
      return;
    }

    const appointment = await Appointment.create({
      patient: patientId,
      doctor: doctorId,
      branch: branchId,
      time
    });

    response.status(201).json({ success: true, data: appointment });
  } catch (error) {
    // Catches the unique index race condition too (duplicate key error)
    response.status(400).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Could not book appointment"
    });
  }
}

// Get all appointments — optionally filtered by branch, doctor, or patient
export async function getAppointments(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (request.query.branchId) filter.branch = request.query.branchId;
    if (request.query.doctorId) filter.doctor = request.query.doctorId;
    if (request.query.patientId) filter.patient = request.query.patientId;

    const appointments = await Appointment.find(filter)
      .populate("patient", "name email phone")
      .populate("doctor")
      .populate("branch")
      .sort({ time: -1 });

    response.json({ success: true, count: appointments.length, data: appointments });
  } catch (error) {
    response.status(500).json({ success: false, message: "Could not load appointments" });
  }
}

// Get a single appointment by id
export async function getAppointmentById(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const appointment = await Appointment.findById(request.params.id)
      .populate("patient", "name email phone")
      .populate("doctor")
      .populate("branch");

    if (!appointment) {
      response.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }

    response.json({ success: true, data: appointment });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid appointment id" });
  }
}

// Branch confirms a pending appointment
export async function confirmAppointment(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      request.params.id,
      { status: "confirmed" },
      { new: true }
    );

    if (!appointment) {
      response.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }

    response.json({ success: true, data: appointment });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid appointment id" });
  }
}

// Cancel an appointment (patient, receptionist, or branch)
export async function cancelAppointment(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      request.params.id,
      { status: "cancelled" },
      { new: true }
    );

    if (!appointment) {
      response.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }

    response.json({ success: true, data: appointment });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid appointment id" });
  }
}

// Doctor completes the visit with a diagnosis (and optional prescription)
export async function completeAppointment(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { diagnosis, prescription } = request.body;

    if (!diagnosis) {
      response.status(400).json({ success: false, message: "Diagnosis is required" });
      return;
    }

    const appointment = await Appointment.findByIdAndUpdate(
      request.params.id,
      { status: "completed", diagnosis, prescription },
      { new: true, runValidators: true }
    );

    if (!appointment) {
      response.status(404).json({ success: false, message: "Appointment not found" });
      return;
    }

    response.json({ success: true, data: appointment });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not complete appointment"
    });
  }
}
