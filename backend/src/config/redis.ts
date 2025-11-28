import Redis from "ioredis";

const redisConfig = {
  host: process.env.REDIS_HOST || "localhost",
  port: Number(process.env.REDIS_PORT) || 6379,
};

// Cliente para Cache (Salvar e Ler dados)
export const redisClient = new Redis(redisConfig);

// Cliente exclusivo para Publicar Mensagens (Pub/Sub)
export const redisPublisher = new Redis(redisConfig);

redisClient.on("connect", () => {
  console.log("Conectado ao Redis com sucesso!");
});

redisClient.on("error", (err) => {
  console.error(" Erro na conexão com Redis:", err);
});
