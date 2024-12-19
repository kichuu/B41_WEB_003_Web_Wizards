// DOM Elements
const modal = document.getElementById('task-modal');
const addTaskButton = document.getElementById('add-task-button');
const addNewTaskCard = document.querySelector('.add-new-task');
const closeButton = document.querySelector('.close');
const taskForm = document.getElementById('task-form');
const taskGrid = document.getElementById('task-grid');

// Event Listeners
[addTaskButton, addNewTaskCard].forEach(element => {
    element.addEventListener('click', openModal);
});

closeButton.addEventListener('click', closeModal);
window.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

taskForm.addEventListener('submit', handleTaskSubmit);
document.addEventListener('DOMContentLoaded', loadTasks);

// Functions
function openModal() {
    modal.style.display = 'block';
}

function closeModal() {
    modal.style.display = 'none';
    taskForm.reset();
}

function handleTaskSubmit(e) {
    e.preventDefault();

    const task = {
        id: Date.now(),
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        priority: document.getElementById('priority').value,
    };

    saveTask(task);
    addTaskToGrid(task);
    closeModal();
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => addTaskToGrid(task));
}

function addTaskToGrid(task) {
    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.priority}`;
    taskCard.innerHTML = `
    <span class="priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
    <h3>${task.title}</h3>
    <p class="description">${task.description}</p>
    <div class="task-footer">
      <span>${formatDate(task.date)}</span>
    </div>
    <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
    <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
  `;

    // Insert before the "Add New Task" card
    taskGrid.insertBefore(taskCard, taskGrid.lastElementChild);
}

function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTaskGrid();
}

function editTask(id) {
    const tasks = getTasks();
    const task = tasks.find(task => task.id === id);

    // Populate the form with task data
    document.getElementById('title').value = task.title;
    document.getElementById('description').value = task.description;
    document.getElementById('date').value = task.date;
    document.getElementById('priority').value = task.priority;

    // Update the task when form is submitted
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        task.title = document.getElementById('title').value;
        task.description = document.getElementById('description').value;
        task.date = document.getElementById('date').value;
        task.priority = document.getElementById('priority').value;

        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTaskGrid();
        closeModal();
    });

    openModal();
}

function refreshTaskGrid() {
    // Clear all tasks except the "Add New Task" card
    const addNewTaskCard = taskGrid.lastElementChild;
    taskGrid.innerHTML = '';
    taskGrid.appendChild(addNewTaskCard);
    loadTasks();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}
