const express = require("express");
const server = express();

server.use(express.json());

const projects = [];
let requestCount = 0;

/******* Middlewares *******/

//Retorna o número de requisições e o tempo médio das mesmas.
server.use((res, req, next) => {
  console.log(`Requisições Anteriores: ${requestCount}`);
  console.time("Tempo de Execução");
  requestCount++;
  console.log(`Iniciando a ${requestCount}° Requisição!`);
  next();
  console.log(`${requestCount}° Requisição Finalizada!`);
  console.timeEnd("Tempo de Execução");
});

//verifica se existe um projeto correspondente ao id
function vrfExists(req, res, next) {
  const proj = projects.find(projects => projects.id == req.params.id);

  if (!proj) {
    return res.status(404).json({ errorMsg: "Project Not Found!!! =(" });
  }

  return next();
}

//Pesquisa todos projetos.
server.get("/projects", (req, res) => {
  return res.json(projects);
});

//Grava um novo projeto
server.post("/projects", (req, res) => {
  const { id } = req.body;
  const { title } = req.body;
  const { tasks } = req.body;

  projects.push({ id, title, tasks });

  return res.json(projects);
});

//Grava uma tarefa em projeto existente
server.post("/projects/:id", vrfExists, (req, res) => {
  const { id } = req.params;
  const { tasks } = req.body;

  const proj = projects.find(projects => projects.id == id);

  proj.tasks.push(tasks);

  return res.json(projects);
});

//Altera um projeto
server.put("/projects/:id", vrfExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const proj = projects.find(projects => projects.id == id);

  proj.title = title;

  return res.json(projects);
});

//Exclui um projeto
server.delete("/projects/:id", vrfExists, (req, res) => {
  const { id } = req.params;

  const index = projects.findIndex(projects => projects.id == id);

  projects.splice(index, 1);

  return res.status(200).json({ msg: `Projeto ${id} excluido com sucesso!` });
});

server.listen(3000);
