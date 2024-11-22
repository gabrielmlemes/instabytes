import express from "express"; // Importa o framework Express para criar o servidor
import multer from "multer"; // Importa o multer para manipulação de arquivos enviados (upload)
import cors from "cors";

const corsOption = {
  origin: "http://localhost:8000",
  optionsSuccessStatus: 200,
};

import {
  listarPosts,
  postarNovoPost,
  uploadImagem,
  atualizarNovoPost,
} from "../controllers/postsController.js"; // Importa os controladores para manipular as requisições

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Define o diretório onde os arquivos enviados serão salvos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Define o nome do arquivo como o original enviado
  },
});

const upload = multer({ dest: "./uploads", storage }); // Configura o multer para salvar arquivos na pasta "uploads" com o esquema de armazenamento definido

const routes = (app) => {
  app.use(express.json()); // Configura o servidor para processar requisições com JSON no corpo
  app.use(cors(corsOption));

  // Rotas
  app.get("/posts", listarPosts); // Define a rota para listar posts
  app.post("/posts", postarNovoPost); // Define a rota para criar um novo post
  app.post("/upload", upload.single("imagem"), uploadImagem); // Define a rota para upload de imagem, usando o middleware do multer
  app.put("/upload/:id", atualizarNovoPost);
};

export default routes; // Exporta as rotas para serem usadas na configuração do servidor
