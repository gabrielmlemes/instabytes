import { getPosts, criarPost, atualizarPost } from "../models/postsModel.js"; // Importa funções para acessar e criar posts do modelo de dados
import fs from "fs"; // Importa o módulo de sistema de arquivos para manipular imagens
import gerarDescricaoComGemini from "../services/geminiService.js";

// Controla as requisições (GET/POST/PUT...)

export async function listarPosts(req, res) {
  const posts = await getPosts(); // Obtém todos os posts do banco de dados
  res.status(200).json(posts); // Retorna os posts em formato JSON com status 200
}

export async function postarNovoPost(req, res) {
  const novoPost = req.body; // Obtém os dados do novo post do corpo da requisição

  try {
    const postCriado = await criarPost(novoPost); // Insere o novo post no banco de dados
    res.status(200).json(postCriado); // Retorna o post criado com status 200
  } catch (error) {
    console.log("Erro ao postar!" + error.message); // Loga o erro no console para debug
    res.status(500).json({ Erro: "Erro ao postar!" }); // Retorna mensagem de erro com status 500
  }
}

export async function uploadImagem(req, res) {
  const novoPost = {
    descricao: "", // Inicializa o campo de descrição vazio
    imgUrl: req.file.originalname, // Usa o nome original do arquivo como URL temporária
    alt: "", // Inicializa o texto alternativo vazio
  };

  try {
    const postCriado = await criarPost(novoPost); // Salva o post no banco de dados
    const imagemAtualizada = `uploads/${postCriado.insertedId}.png`; // Define o novo nome da imagem com base no ID do post
    fs.renameSync(req.file.path, imagemAtualizada); // Renomeia o arquivo de imagem para o novo nome

    res.status(200).json(postCriado); // Retorna o post criado com status 200
  } catch (error) {
    console.log("Erro ao postar!" + error.message); // Loga o erro no console para debug
    res.status(500).json({ Erro: "Erro ao postar!" }); // Retorna mensagem de erro com status 500
  }
}

export async function atualizarNovoPost(req, res) {
  const id = req.params.id;
  const urlImagem = `http://localhost:3000/${id}.png`;

  try {
    const imgBuffer = fs.readFileSync(`uploads/${id}.png`);
    const descricao = await gerarDescricaoComGemini(imgBuffer);
    
    const post = {
      imgUrl: urlImagem,
      descricao: descricao,
      alt: req.body.alt,
    };
    
    const postCriado = await atualizarPost(id, post);

    res.status(200).json(postCriado); // Retorna o post criado com status 200
  } catch (error) {
    console.log("Erro ao postar!" + error.message); // Loga o erro no console para debug
    res.status(500).json({ Erro: "Erro ao postar!!!" }); // Retorna mensagem de erro com status 500
  }
}
