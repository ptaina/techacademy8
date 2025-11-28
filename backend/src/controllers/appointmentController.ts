import { Request, Response } from "express";
import AppointmentModel from "../models/AppointmentModel";
import PatientModel from "../models/PatientModel";
import UserModel from "../models/UserModel";
import DoctorModel from "../models/DoctorModel";
import { JwtPayload } from "../types/jwtPayload";
import { redisClient } from "../config/redis"; // <--- Import do Redis

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    let { patientId, doctorId, date, status } = req.body;

    // 1. Se for PACIENTE agendando
    if (user.role !== "admin") {
      // Busca os dados completos do usuário para pegar o CPF
      const userFull = await UserModel.findByPk(user.id);

      if (userFull) {
        // Usa o CPF para encontrar o ID correto na tabela de Pacientes
        const patientProfile = await PatientModel.findOne({
          where: { cpf: userFull.cpf },
        });

        if (patientProfile) {
          patientId = patientProfile.id; // <--- AQUI ESTÁ O ID CERTO!
        } else {
          return res.status(404).json({
            error: "Perfil de paciente não encontrado. Contate o suporte.",
          });
        }
      }
    }
    // 2. Se for ADMIN, ele obrigatoriamente mandou o patientId no body
    else if (!patientId) {
      return res
        .status(400)
        .json({ error: "Admin deve selecionar um paciente." });
    }

    if (!doctorId || !date) {
      return res.status(400).json({ error: "Doctor and date are required" });
    }

    const newAppointment = await AppointmentModel.create({
      patientId,
      doctorId,
      date,
      status: status || "agendado",
    });

    // --- MENSAGERIA (REQUISITO DA RUBRICA) ---
    // Publica o evento no canal 'notifications' para o microsserviço ouvir
    const messageData = {
      type: "APPOINTMENT_CREATED",
      appointmentId: newAppointment.id,
      date: newAppointment.date,
      patientId: patientId,
      timestamp: new Date().toISOString(),
    };

    // Publica no Redis
    await redisClient.publish("notifications", JSON.stringify(messageData));
    console.log("Evento publicado no Redis:", messageData);
    // -----------------------------------------

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    let whereClause = {};

    // Se NÃO for admin, precisamos descobrir qual é o ID de Paciente desse usuário
    if (user.role !== "admin") {
      // 1. Pega o usuário completo para ter o CPF
      const userFull = await UserModel.findByPk(user.id);

      if (!userFull) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // 2. Busca o Paciente que tem esse CPF na outra tabela
      const patientProfile = await PatientModel.findOne({
        where: { cpf: userFull.cpf },
      });

      if (!patientProfile) {
        // Se não achou ficha de paciente, retorna lista vazia (paciente novo sem consultas)
        return res.status(200).json([]);
      }

      // 3. Filtra os agendamentos pelo ID DO PACIENTE (não do usuário)
      whereClause = { patientId: patientProfile.id };
    }

    const appointments = await AppointmentModel.findAll({
      where: whereClause,
      include: [
        { model: PatientModel, as: "patient" },
        { model: DoctorModel, as: "doctor" },
      ],
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!["agendado", "concluído", "cancelado"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const appointment = await AppointmentModel.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Status updated successfully", appointment });
  } catch (error) {
    console.error("Error updating appointment:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

/*import { Request, Response } from "express";
import AppointmentModel from "../models/AppointmentModel";
import PatientModel from "../models/PatientModel";
import UserModel from "../models/UserModel";
import DoctorModel from "../models/DoctorModel";
import { JwtPayload } from "../types/jwtPayload";

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    let { patientId, doctorId, date, status } = req.body;

    // 1. Se for PACIENTE agendando
    if (user.role !== "admin") {
      // Busca os dados completos do usuário para pegar o CPF
      const userFull = await UserModel.findByPk(user.id);

      if (userFull) {
        // Usa o CPF para encontrar o ID correto na tabela de Pacientes
        const patientProfile = await PatientModel.findOne({
          where: { cpf: userFull.cpf },
        });

        if (patientProfile) {
          patientId = patientProfile.id; // <--- AQUI ESTÁ O ID CERTO!
        } else {
          return res.status(404).json({
            error: "Perfil de paciente não encontrado. Contate o suporte.",
          });
        }
      }
    }
    // 2. Se for ADMIN, ele obrigatoriamente mandou o patientId no body
    else if (!patientId) {
      return res
        .status(400)
        .json({ error: "Admin deve selecionar um paciente." });
    }

    if (!doctorId || !date) {
      return res.status(400).json({ error: "Doctor and date are required" });
    }

    const newAppointment = await AppointmentModel.create({
      patientId,
      doctorId,
      date,
      status: status || "agendado",
    });

    return res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const user = req.user as JwtPayload;
    let whereClause = {};

    // Se NÃO for admin, precisamos descobrir qual é o ID de Paciente desse usuário
    if (user.role !== "admin") {
      // 1. Pega o usuário completo para ter o CPF
      const userFull = await UserModel.findByPk(user.id);

      if (!userFull) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      // 2. Busca o Paciente que tem esse CPF na outra tabela
      const patientProfile = await PatientModel.findOne({
        where: { cpf: userFull.cpf },
      });

      if (!patientProfile) {
        // Se não achou ficha de paciente, retorna lista vazia (paciente novo sem consultas)
        return res.status(200).json([]);
      }

      // 3. Filtra os agendamentos pelo ID DO PACIENTE (não do usuário)
      whereClause = { patientId: patientProfile.id };
    }

    const appointments = await AppointmentModel.findAll({
      where: whereClause,
      include: [
        { model: PatientModel, as: "patient" },
        { model: DoctorModel, as: "doctor" },
      ],
    });

    return res.status(200).json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    if (!["agendado", "concluído", "cancelado"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const appointment = await AppointmentModel.findByPk(id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    appointment.status = status;
    await appointment.save();

    return res
      .status(200)
      .json({ message: "Status updated successfully", appointment });
  } catch (error) {
    console.error("Error updating appointment:", (error as Error).message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};*/
