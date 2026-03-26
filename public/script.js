// DOM Elements
const todoForm = document.getElementById('todoForm');
const todoInput = document.getElementById('todoInput');
const todoList = document.getElementById('todoList');
const clearBtn = document.getElementById('clearBtn');
const totalCount = document.getElementById('totalCount');
const completedCount = document.getElementById('completedCount');
const pendingCount = document.getElementById('pendingCount');

// Event Listeners
todoForm.addEventListener('submit', handleAddTodo);
clearBtn.addEventListener('click', handleClearAll);

// Initialize
loadTodos();

// Functions
async function loadTodos() {
  try {
    const response = await fetch('/api/todos');
    const todos = await response.json();
    renderTodos(todos);
    updateStats(todos);
  } catch (error) {
    console.error('Error loading todos:', error);
  }
}

async function handleAddTodo(e) {
  e.preventDefault();
  
  const title = todoInput.value.trim();
  if (!title) return;

  try {
    const response = await fetch('/api/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title })
    });

    if (response.ok) {
      todoInput.value = '';
      loadTodos();
    }
  } catch (error) {
    console.error('Error adding todo:', error);
  }
}

async function handleToggleTodo(id, completed) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ completed: !completed })
    });

    if (response.ok) {
      loadTodos();
    }
  } catch (error) {
    console.error('Error updating todo:', error);
  }
}

async function handleDeleteTodo(id) {
  try {
    const response = await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      loadTodos();
    }
  } catch (error) {
    console.error('Error deleting todo:', error);
  }
}

async function handleClearAll() {
  if (confirm('Are you sure you want to delete all todos?')) {
    try {
      const response = await fetch('/api/todos', {
        method: 'DELETE'
      });

      if (response.ok) {
        loadTodos();
      }
    } catch (error) {
      console.error('Error clearing todos:', error);
    }
  }
}

function renderTodos(todos) {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    todoList.innerHTML = '<div class="empty-state"><p>No todos yet. Add one to get started!</p></div>';
    return;
  }

  todos.forEach(todo => {
    const todoItem = document.createElement('div');
    todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    todoItem.innerHTML = `
      <input 
        type="checkbox" 
        ${todo.completed ? 'checked' : ''}
        onchange="handleToggleTodo(${todo.id}, ${todo.completed})"
      >
      <span class="todo-text">${escapeHtml(todo.title)}</span>
      <button class="delete-btn" onclick="handleDeleteTodo(${todo.id})">×</button>
    `;
    
    todoList.appendChild(todoItem);
  });
}

function updateStats(todos) {
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;

  totalCount.textContent = todos.length;
  completedCount.textContent = completed;
  pendingCount.textContent = pending;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
