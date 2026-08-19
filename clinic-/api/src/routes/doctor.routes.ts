import { Router } from "express";
import {
  createDoctor,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deactivateDoctor
} from "../controllers/doctor.controller";

const router = Router();

router.post("/", createDoctor);
router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.put("/:id", updateDoctor);
router.patch("/:id/deactivate", deactivateDoctor);

export default router;
