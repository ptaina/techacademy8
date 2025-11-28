import "dotenv/config";
import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import userRoutes from "./routes/userRoutes";
import loginRoutes from "./routes/loginRoutes";
import patientRoutes from "./routes/patientRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import appointmentRoutes from "./routes/appointmentRoutes";
import { associateModels } from "./models/associateModels";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json";

const app = express();
const port = 3000;

app.use(express.json());

app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.get("/", (req, res) => {
  res.send("Hello World! :)");
});

app.use(userRoutes);
app.use(loginRoutes);
app.use(patientRoutes);
app.use(doctorRoutes);
app.use(appointmentRoutes);

const syncDatabase = async () => {
  try {
    // Sincroniza sempre
    associateModels();
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Erro ao sincronizar database:", error);
  }
};

// Inicia o servidor sempre
app.listen(port, async () => {
  await syncDatabase();
  console.log(`Servidor rodando na porta ${port}`);
});

export default app;
