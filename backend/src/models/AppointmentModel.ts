import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

class AppointmentModel extends Model {
  id!: number;
  patientId!: number;
  doctorId!: number;
  date!: Date;
  status!: "agendado" | "concluído" | "cancelado";
}

AppointmentModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    patientId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "patients",
        key: "id",
      },
      onDelete: "CASCADE", // ← ADICIONAR AQUI
      onUpdate: "CASCADE",
    },
    doctorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "doctors",
        key: "id",
      },
      onDelete: "CASCADE", // ← ADICIONAR AQUI
      onUpdate: "CASCADE",
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("agendado", "concluído", "cancelado"),
      allowNull: false,
      defaultValue: "agendado",
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
  }
);

export default AppointmentModel;
