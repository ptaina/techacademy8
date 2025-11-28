import { Request, Response } from "express";
import UserModel from "../models/UserModel";
import PatientModel from "../models/PatientModel";
import { Op } from "sequelize";
import { JwtPayload } from "../types/jwtPayload";
import { cpf as cpfValidator } from "cpf-cnpj-validator";

export const getAll = async (req: Request, res: Response) => {
  try {
    const users = await UserModel.findAll({
      attributes: { exclude: ["password"] },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    const { id } = req.params;

    if (user.role !== "admin" && user.id !== parseInt(id)) {
      return res.status(403).json({ error: "Acesso negado." });
    }

    const foundUser = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!foundUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(foundUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, cpf, password, role } = req.body;

    if (!name || !email || !cpf || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!cpfValidator.isValid(cpf)) {
      return res.status(400).json({ error: "Invalid CPF format" });
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must contain at least 8 characters, including one uppercase letter, one lowercase letter and one number",
      });
    }

    const roleToSave =
      role === "admin" || role === "patient" ? role : "patient";

    const existingUser = await UserModel.findOne({
      where: { [Op.or]: [{ email }, { cpf }] },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email or CPF already registered" });
    }

    // 1. CRIA O USUÁRIO DE LOGIN (Tabela Users)
    const user = await UserModel.create({
      name,
      email,
      cpf,
      password,
      role: roleToSave,
    });

    // 2. A MÁGICA: SE FOR PACIENTE, CRIA TAMBÉM NA TABELA DE PACIENTES
    // Assim ele aparece na lista do Admin!
    if (roleToSave === "patient") {
      // Verifica se já não existe lá (por segurança)
      const existingPatient = await PatientModel.findOne({ where: { cpf } });

      if (!existingPatient) {
        await PatientModel.create({
          name: name,
          cpf: cpf,
          phone: "Atualizar Telefone", // Dado fictício para não quebrar
          address: "Atualizar Endereço", // Dado fictício para não quebrar
        });
      }
    }

    const { password: _, ...userWithoutPassword } = user.get();

    return res.status(201).json({
      message: "User created successfully",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, password, email } = req.body;
    const loggedUser = req.user as JwtPayload;

    if (parseInt(id) !== loggedUser.id) {
      return res
        .status(403)
        .json({ error: "You can only update your own profile" });
    }

    if (email) {
      return res.status(400).json({ error: "Email cannot be changed" });
    }

    if (password) {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          error:
            "Password must contain at least 8 characters, including one uppercase, one lowercase and one number",
        });
      }
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updates: { name?: string; password?: string; updatedBy?: number } =
      {};
    if (name) updates.name = name;
    if (password) updates.password = password;
    updates.updatedBy = loggedUser.id;

    await user.update(updates);

    const updatedUser = await UserModel.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroyUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await user.destroy();
    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    const userLogado = req.user as JwtPayload;

    // Verifica se o Multer processou o arquivo
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "Nenhum arquivo enviado ou erro de validação." });
    }

    const user = await UserModel.findByPk(userLogado.id);

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Salva apenas o NOME do arquivo no banco de dados
    user.profileImage = req.file.filename;
    await user.save();

    return res.status(200).json({
      message: "Foto de perfil atualizada!",
      profileImage: req.file.filename,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return res.status(500).json({ error: "Erro interno no upload." });
  }
};
