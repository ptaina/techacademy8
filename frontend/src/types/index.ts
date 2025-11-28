export type Page =
  | "login"
  | "register"
  | "home"
  | "patients"
  | "doctors"
  | "appointments"
  | "edit-user";

export interface User {
  id: number;
  name?: string;
  email: string;
  cpf?: string;
  role?: "admin" | "patient";
  profileImage?: string; // <--- ADICIONAR ESTA LINHA
}

export interface Patient {
  id: number;
  name: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface Doctor {
  id: number;
  name: string;
  speciality: string;
  crm: string;
}

export interface Appointment {
  id: number;
  date: string;
  status: "agendado" | "concluído" | "cancelado";
  patientId: number;
  doctorId: number;
  patient?: Patient;
  doctor?: Doctor;
}
