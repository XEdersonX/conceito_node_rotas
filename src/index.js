const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(cors());
app.use(express.json());

/**
 * Métodos HTTP:
 * 
 * GET: Buscar informações do back-end.
 * POST: Criar uma informação no back-end.
 * PUT/PATCH: Alterar uma informação no back-end.
 * DELETE: Deletar uma informação no back-end.
 */

 /**
  * Tipos de parâmetros:
  * 
  * Query Params: Filtros e paginação
  * Route Params: Identificar recursos (Atualizar/Deletar)
  * Request Body: Conteúdo na hora criar ou editar um recurso (JSON)
  */

  /**
   * Middleware:
   * 
   * Interceptador de requisições que pode interromper totalmente a requisição ou alterar dados da requisição
   * Eles sao muito utilizados tambem para validacao
   */

const projects = [];

//Middleware
function logRequests(request, response, next){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next(); //Proximo Middlew

  console.timeEnd(logLabel);
}

function validateProjectId(request, response, next){
  const { id } = request.params;

  //Se nao for valido id
  if (!isUuid(id)){
    return response.status(400).json({error: 'Invalid project ID.'}); //return interromper totalmente requisicao
  }

  return next();
}

app.use(logRequests);
app.use('/projects/:id', validateProjectId)

//Buscar informações do back-end
app.get('/projects', (request, response) => {
  //const query = request.query;
  const {title} = request.query;

  const results = title 
  ? projects.filter(project => project.title.includes(title))
  : projects; //se forem vario o title tu retorna projects

  return response.json(results); //json retorna array ou objeto
});

//Criar uma informação no back-end
app.post('/projects', (request, response) => {
  //const body = request.body;
  const {title, owner} = request.body;

  const project = {id: uuid(), title, owner};

  projects.push(project);

  return response.json(project); //json retorna array ou objeto
});

//Alterar uma informação no back-end
app.put('/projects/:id', (request, response) => {
  //const params = request.params;
  const {id} = request.params;
  const {title, owner} = request.body;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found.'});
  }

  const project = {
    id,
    title,
    owner,
  };

  projects[projectIndex] = project;

  return response.json(project); //json retorna array ou objeto
});

//Deletar uma informação no back-end
app.delete('/projects/:id', (request, response) => {
  const {id} = request.params;

  const projectIndex = projects.findIndex(project => project.id === id);

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project not found.'});
  }

  projects.splice(projectIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log('🚀 Back-end started!');
}); //Porta para acessar pelo navegador   http://localhost:3333/projects   
    //para acessar emoj: contro + comand + space