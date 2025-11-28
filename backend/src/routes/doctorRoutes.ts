import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctorById,
  destroyDoctorById,
} from "../controllers/doctorController";
const router = express.Router();
router.get("/doctors", authMiddleware, getAllDoctors);
router.get("/doctors/:id", authMiddleware, requireAdmin, getDoctorById); //só o admin pode ver detalhes do médico
router.post("/doctors", authMiddleware, requireAdmin, createDoctor); // só admin pode criar
router.put("/doctors/:id", authMiddleware, requireAdmin, updateDoctorById); // só admin pode editar
router.delete("/doctors/:id", authMiddleware, requireAdmin, destroyDoctorById); // só admin pode apagar
export default router;
