// Elementos del DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const pendingCount = document.getElementById('pendingCount');

// Cargar tareas desde localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Renderizar lista
function renderTasks() {
  taskList.innerHTML = '';
  const pending = tasks.filter(t => !t.completed).length;
  pendingCount.textContent = pending;

  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    li.className = 'task-item';

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'task-check';
    check.checked = task.completed;
    check.addEventListener('change', () => {
      tasks[index].completed = check.checked;
      saveAndRender();
    });

    const text = document.createElement('span');
    text.className = `task-text${task.completed ? ' completed' : ''}`;
    text.textContent = task.text;

    const delBtn = document.createElement('button');
    delBtn.className = 'task-delete';
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveAndRender();
    });

    li.appendChild(check);
    li.appendChild(text);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

// Guardar y renderizar
function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTasks();
}

// Agregar tarea
function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;
  tasks.push({ text, completed: false });
  taskInput.value = '';
  saveAndRender();
}

// Eventos
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTask();
});

// Inicializar
renderTasks();