import type { Request, Response } from "express";
import { Doctor } from "../models/doctor.model";
import { Branch } from "../models/branch.model";

// Create a new doctor
export async function createDoctor(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { name, specialty, branchId } = request.body;

    const branch = await Branch.findById(branchId);
    if (!branch) {
      response.status(400).json({ success: false, message: "Branch not found" });
      return;
    }

    const doctor = await Doctor.create({ name, specialty, branch: branchId });
    response.status(201).json({ success: true, data: doctor });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not create doctor"
    });
  }
}

// Get all doctors — optionally filtered by branchId and/or specialty
export async function getDoctors(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const filter: Record<string, unknown> = {};
    if (request.query.branchId) filter.branch = request.query.branchId;
    if (request.query.specialty) filter.specialty = request.query.specialty;

    const doctors = await Doctor.find(filter).populate("branch").sort({ createdAt: -1 });
    response.json({ success: true, count: doctors.length, data: doctors });
  } catch (error) {
    response.status(500).json({ success: false, message: "Could not load doctors" });
  }
}

// Get a single doctor by id
export async function getDoctorById(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const doctor = await Doctor.findById(request.params.id).populate("branch");

    if (!doctor) {
      response.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    response.json({ success: true, data: doctor });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid doctor id" });
  }
}

// Update a doctor by id
export async function updateDoctor(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { branchId, ...rest } = request.body;
    const updates = branchId ? { ...rest, branch: branchId } : rest;

    const doctor = await Doctor.findByIdAndUpdate(request.params.id, updates, {
      new: true,
      runValidators: true
    }).populate("branch");

    if (!doctor) {
      response.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    response.json({ success: true, data: doctor });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not update doctor"
    });
  }
}

// Deactivate a doctor (soft delete — keeps appointment history intact)
export async function deactivateDoctor(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const doctor = await Doctor.findByIdAndUpdate(
      request.params.id,
      { isActive: false },
      { new: true }
    );

    if (!doctor) {
      response.status(404).json({ success: false, message: "Doctor not found" });
      return;
    }

    response.json({ success: true, data: doctor });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid doctor id" });
  }
}
