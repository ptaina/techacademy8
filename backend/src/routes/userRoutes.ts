import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { uploadConfig } from "../config/multer"; // Importar config
import {
  getAll,
  createUser,
  getUserById,
  updateUser,
  destroyUserById,
  uploadAvatar, // Importar o novo controller
} from "../controllers/userController";

const router = express.Router();

router.get("/users", authMiddleware, getAll);
router.get("/users/:id", authMiddleware, getUserById);
router.post("/users", createUser);
router.put("/users/:id", authMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, destroyUserById);

// NOVA ROTA DE UPLOAD:
// Usa o middleware 'single' do Multer como pede na Trilha 1
router.post(
  "/users/avatar",
  authMiddleware,
  uploadConfig.single("avatar"),
  uploadAvatar
);

export default router;
