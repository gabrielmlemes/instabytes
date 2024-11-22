import "dotenv/config";
import { ObjectId } from 'mongodb';
import conectarAoBanco from '../config/dbConfig.js'; // Importa a função de conexão com o banco de dados

// Representa os dados que serão enviados para o banco

const conexaoBanco = await conectarAoBanco(process.env.STRING_CONEXAO_DB); // Estabelece conexão com o banco usando a string de conexão do ambiente

export async function getPosts() {
  const db = conexaoBanco.db("imersao-instabyte-lemes"); // Seleciona o banco de dados
  const colecao = db.collection("posts"); // Acessa a coleção "posts"
  return colecao.find().toArray(); // Busca todos os documentos da coleção e os retorna como um array
}

export async function criarPost(novoPost) {
  const db = conexaoBanco.db("imersao-instabyte-lemes"); // Seleciona o banco de dados
  const colecao = db.collection("posts"); // Acessa a coleção "posts"
  return colecao.insertOne(novoPost); // Insere o novo documento (post) na coleção e retorna o resultado da operação
}

export async function atualizarPost(id, novoPost) {
  const db = conexaoBanco.db("imersao-instabyte-lemes"); // Seleciona o banco de dados
  const colecao = db.collection("posts"); // Acessa a coleção "posts"

  const objId = ObjectId.createFromHexString(id)
  return colecao.updateOne({_id: new ObjectId(objId)}, {$set: novoPost} ); 
}
