const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./src/swagger_output.json";
const endpointsFiles = ["./src/index.ts"]; // O ponto de entrada onde você chama app.use(rotas)

const doc = {
  info: {
    title: "MedConnect API",
    description: "API para gestão de agendamentos médicos",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

swaggerAutogen(outputFile, endpointsFiles, doc);
