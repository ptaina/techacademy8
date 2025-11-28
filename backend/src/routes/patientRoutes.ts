import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatientById,
  destroyPatientById,
} from "../controllers/patientController";
const router = express.Router();
router.get("/patients", authMiddleware, requireAdmin, getAllPatients); // só admin vê todos
router.get("/patients/:id", authMiddleware, getPatientById); // paciente pode ver seu registro
router.post("/patients", authMiddleware, requireAdmin, createPatient); // só admin pode criar paciente
router.put("/patients/:id", authMiddleware, requireAdmin, updatePatientById); // só admin pode editar paciente
router.delete(
  "/patients/:id",
  authMiddleware,
  requireAdmin,
  destroyPatientById
); // só admin pode apagar paciente
export default router;
