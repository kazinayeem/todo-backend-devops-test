const express = require('express');
const path = require('path');
const app = express();

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory storage for todos
let todos = [];
let todoId = 1;

// Health check route (for container orchestration)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { todos });
});

// API Routes
app.post('/api/todos', (req, res) => {
  const { title } = req.body;
  
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  const todo = {
    id: todoId++,
    title: title.trim(),
    completed: false,
    createdAt: new Date()
  };

  todos.push(todo);
  res.status(201).json(todo);
});

app.get('/api/todos', (req, res) => {
  res.json(todos);
});

app.put('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, completed } = req.body;
  
  const todo = todos.find(t => t.id === parseInt(id));
  
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  if (title !== undefined) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;
  
  res.json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const { id } = req.params;
  const index = todos.findIndex(t => t.id === parseInt(id));
  
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  const removed = todos.splice(index, 1);
  res.json(removed[0]);
});

app.delete('/api/todos', (req, res) => {
  todos = [];
  todoId = 1;
  res.json({ message: 'All todos cleared' });
});

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.listen(PORT, HOST, () => {
  console.log(`Todo app running on http://${HOST}:${PORT}`);
});
