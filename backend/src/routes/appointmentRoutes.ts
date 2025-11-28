import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { requireAdmin } from "../middleware/roleMiddleware";
import {
  createAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
const router = express.Router();
router.get("/appointments", authMiddleware, getAllAppointments);
router.post("/appointments", authMiddleware, createAppointment);
router.put(
  "/appointments/:id/status",
  authMiddleware,
  requireAdmin,
  updateAppointmentStatus
); // só admin pode alterar status
export default router;
