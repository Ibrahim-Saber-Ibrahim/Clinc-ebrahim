import { Router } from "express";
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment
} from "../controllers/appointment.controller";

const router = Router();

router.post("/", createAppointment);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.patch("/:id/confirm", confirmAppointment);
router.patch("/:id/cancel", cancelAppointment);
router.patch("/:id/complete", completeAppointment);

export default router;
