import { Request, Response } from "express";
import { ValidationError } from "sequelize";
import DoctorModel from "../models/DoctorModel";
import { redisClient } from "../config/redis"; // <--- Import do Redis

export const getAllDoctors = async (req: Request, res: Response) => {
  try {
    // 1. Tenta pegar do Cache primeiro (Cache-aside)
    const cachedDoctors = await redisClient.get("all_doctors");

    if (cachedDoctors) {
      console.log(" Recuperado do Cache Redis!");
      return res.status(200).json(JSON.parse(cachedDoctors));
    }

    // 2. Se não tem no cache, busca no banco
    console.log(" Buscando no Banco de Dados...");
    const doctors = await DoctorModel.findAll();

    // 3. Salva no Redis com validade de 1 hora (3600 segundos) (TTL)
    await redisClient.set("all_doctors", JSON.stringify(doctors), "EX", 3600);

    return res.status(200).json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const doctor = await DoctorModel.findByPk(id);

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    console.error("Error fetching doctor:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createDoctor = async (req: Request, res: Response) => {
  try {
    const { name, speciality, crm } = req.body;

    if (!name || !speciality || !crm) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newDoctor = await DoctorModel.create({ name, speciality, crm });

    // 4. Invalidação de Cache: Limpa a lista antiga para forçar atualização
    await redisClient.del("all_doctors");

    return res
      .status(201)
      .json({ message: "Doctor created successfully", doctor: newDoctor });
  } catch (error) {
    console.error("Error creating doctor:", error);

    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ error: messages });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, speciality, crm } = req.body;

    const doctor = await DoctorModel.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    if (!name || !speciality || !crm) {
      return res.status(400).json({ error: "All fields are required" });
    }

    doctor.name = name;
    doctor.speciality = speciality;
    doctor.crm = crm;

    await doctor.save();

    // 4. Invalidação de Cache
    await redisClient.del("all_doctors");

    return res
      .status(200)
      .json({ message: "Doctor updated successfully", doctor });
  } catch (error) {
    console.error("Error updating doctor:", error);

    if (error instanceof ValidationError) {
      const messages = error.errors.map((e) => e.message);
      return res.status(400).json({ error: messages });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const destroyDoctorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const doctor = await DoctorModel.findByPk(id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    await doctor.destroy();

    // 4. Invalidação de Cache
    await redisClient.del("all_doctors");

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting doctor:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
