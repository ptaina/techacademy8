import AppointmentModel from "./AppointmentModel";
import PatientModel from "./PatientModel";
import DoctorModel from "./DoctorModel";

export const associateModels = () => {
  // Associações do Appointment
  AppointmentModel.belongsTo(PatientModel, {
    foreignKey: "patientId",
    as: "patient",
  });

  AppointmentModel.belongsTo(DoctorModel, {
    foreignKey: "doctorId",
    as: "doctor",
  });

  // Associações inversas
  PatientModel.hasMany(AppointmentModel, {
    foreignKey: "patientId",
    as: "appointments",
  });

  DoctorModel.hasMany(AppointmentModel, {
    foreignKey: "doctorId",
    as: "appointments",
  });
};

export default associateModels;
