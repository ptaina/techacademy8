const Redis = require("ioredis");
const fs = require("fs");
const path = require("path");

// Conecta ao Redis (nome do serviço no docker-compose)
const redis = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: 6379,
});

const LOG_FILE = path.join(__dirname, "logs.json");

// Garante que o arquivo de logs existe
if (!fs.existsSync(LOG_FILE)) {
  fs.writeFileSync(LOG_FILE, JSON.stringify([]));
}

console.log(" Microsserviço de Notificações Iniciado...");

// Se inscreve no canal 'notifications'
redis.subscribe("notifications", (err, count) => {
  if (err) {
    console.error(" Erro ao se inscrever:", err);
  } else {
    console.log(`Inscrito no canal 'notifications'. Aguardando eventos...`);
  }
});

// Quando recebe uma mensagem
redis.on("message", (channel, message) => {
  console.log(` [EVENTO RECEBIDO]: ${message}`);

  const eventData = JSON.parse(message);

  // Simula envio de email e loga
  const logEntry = {
    id: Date.now(),
    channel: channel,
    event: eventData.type,
    details: eventData,
    processedAt: new Date().toISOString(),
    status: "EMAIL_SENT_SIMULATION",
  };

  // Persistência: Salva no arquivo logs.json
  const currentLogs = JSON.parse(fs.readFileSync(LOG_FILE));
  currentLogs.push(logEntry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(currentLogs, null, 2));

  console.log("Log salvo com sucesso em logs.json");
});
