import multer from "multer";
import path from "path";
import fs from "fs";

// Garante que a pasta uploads existe na raiz do projeto
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    //  Evitar colisão de nomes
    // Estratégia: Data atual + número aleatório + extensão original
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

export const uploadConfig = multer({
  storage: storage,
  limits: {
    //  Validar tamanho (5MB)
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    // REQUISITO TRILHA 2: Validar extensão/tipo (Mimetype)
    const allowedMimes = [
      "image/jpeg",
      "image/pjpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Tipo de arquivo inválido. Apenas imagens (JPG/PNG) são permitidas."
        )
      );
    }
  },
});
