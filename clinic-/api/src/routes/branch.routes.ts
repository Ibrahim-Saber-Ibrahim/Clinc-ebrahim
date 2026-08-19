import { Router } from "express";
import {
  createBranch,
  getBranches,
  getBranchById,
  updateBranch,
  deactivateBranch
} from "../controllers/branch.controller";

const router = Router();

router.post("/", createBranch);
router.get("/", getBranches);
router.get("/:id", getBranchById);
router.put("/:id", updateBranch);
router.patch("/:id/deactivate", deactivateBranch);

export default router;
