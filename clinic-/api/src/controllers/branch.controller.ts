import type { Request, Response } from "express";
import { Branch } from "../models/branch.model";

// Create a new branch
export async function createBranch(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const branch = await Branch.create(request.body);
    response.status(201).json({ success: true, data: branch });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not create branch"
    });
  }
}

// Get all branches
export async function getBranches(
  _request: Request,
  response: Response
): Promise<void> {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    response.json({ success: true, count: branches.length, data: branches });
  } catch (error) {
    response.status(500).json({ success: false, message: "Could not load branches" });
  }
}

// Get a single branch by id
export async function getBranchById(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const branch = await Branch.findById(request.params.id);

    if (!branch) {
      response.status(404).json({ success: false, message: "Branch not found" });
      return;
    }

    response.json({ success: true, data: branch });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid branch id" });
  }
}

// Update a branch by id
export async function updateBranch(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const branch = await Branch.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true
    });

    if (!branch) {
      response.status(404).json({ success: false, message: "Branch not found" });
      return;
    }

    response.json({ success: true, data: branch });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not update branch"
    });
  }
}

// Deactivate a branch (soft delete — branches with appointment history are kept)
export async function deactivateBranch(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const branch = await Branch.findByIdAndUpdate(
      request.params.id,
      { isActive: false },
      { new: true }
    );

    if (!branch) {
      response.status(404).json({ success: false, message: "Branch not found" });
      return;
    }

    response.json({ success: true, data: branch });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid branch id" });
  }
}
