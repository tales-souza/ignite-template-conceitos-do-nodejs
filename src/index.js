const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

// middleware
function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userAccount = users.find((user) => (user.username === username));

  if (!userAccount) {
    return response.status(404).json({
      error: "User account not found"
    });
  }

  request.userAccount = userAccount;

  return next();
}

app.post('/users', (request, response) => {

  const { name, username } = request.body;

  const verifyIfUserAlreadyExists = users.some((user) => (user.username === username));

  if (verifyIfUserAlreadyExists) {
    return response.status(400).json({
      error: "User already exists"
    });
  }
  const newUser = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }

  users.push(newUser);

  return response.status(201).json(newUser);

});

app.get('/todos', checksExistsUserAccount, (request, response) => {

  const { userAccount } = request;
  return response.status(200).json(userAccount.todos);

});

app.post('/todos', checksExistsUserAccount, (request, response) => {

  const { title, deadline } = request.body;

  const { userAccount } = request;

  const newTodo = {
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date()
  }

  userAccount.todos.push(newTodo);

  return response.status(201).json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { userAccount } = request;

  const { id } = request.params;
  const { title, deadline } = request.body;

  const todo = userAccount.todos.find((todo) => (todo.id === id));

  if (!todo) {
    return response.status(404).json({
      error: 'Todo not found'
    });
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(200).send();
});



app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { userAccount } = request;

  const { id } = request.params;


  const todo = userAccount.todos.find((todo) => (todo.id === id));

  if (!todo) {
    return response.status(404).json({
      error: 'Todo not found'
    });
  }

  const todoIndex = userAccount.todos.findIndex((todo => todo.id === id));

  userAccount.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { userAccount } = request;

  const { id } = request.params;

  const todo = userAccount.todos.find((todo) => (todo.id === id));

  if (!todo) {
    return response.status(404).json({
      error: 'Todo not found'
    });
  }

  todo.done = true;

  return response.status(200).send();
});




app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
});

module.exports = app;