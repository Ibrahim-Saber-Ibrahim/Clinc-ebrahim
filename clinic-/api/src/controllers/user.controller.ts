import type { Request, Response } from "express";
import { User } from "../models/user.model";

// Register a new user (patient/doctor/receptionist/admin)
// NOTE: passwords are stored as-is in passwordHash until the auth lesson
// covers real hashing — this mirrors the original clinic-api's TODO.
export async function registerUser(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const { name, email, phone, password, role } = request.body;

    const user = await User.create({
      name,
      email,
      phone,
      passwordHash: password,
      role
    });

    const { passwordHash, ...safeUser } = user.toObject();
    response.status(201).json({ success: true, data: safeUser });
  } catch (error) {
    response.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not register user"
    });
  }
}

// Get all users
export async function getUsers(
  _request: Request,
  response: Response
): Promise<void> {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    response.json({ success: true, count: users.length, data: users });
  } catch (error) {
    response.status(500).json({ success: false, message: "Could not load users" });
  }
}

// Get a single user by id
export async function getUserById(
  request: Request,
  response: Response
): Promise<void> {
  try {
    const user = await User.findById(request.params.id);

    if (!user) {
      response.status(404).json({ success: false, message: "User not found" });
      return;
    }

    response.json({ success: true, data: user });
  } catch (error) {
    response.status(400).json({ success: false, message: "Invalid user id" });
  }
}
