// Retrieve tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Initialize task tracker and load tasks
function initializeTaskTracker() {
    const todoList = document.getElementById('todo-list');
    const inProgressList = document.getElementById('in-progress-list');
    const doneList = document.getElementById('done-list');

    // Load tasks and distribute them into columns based on status
    loadTasksIntoColumns(todoList, inProgressList, doneList);

    // Enable drag events for columns
    addDragAndDropEvents(todoList);
    addDragAndDropEvents(inProgressList);
    addDragAndDropEvents(doneList);
}

// Add event listeners for drag-and-drop on task cards
function addDragAndDropEvents(column) {
    column.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingCard = document.querySelector('.dragging');
        column.appendChild(draggingCard);
    });

    column.addEventListener('drop', () => {
        saveTaskStatuses();
    });
}

// Load tasks and distribute them into the correct columns
function loadTasksIntoColumns(todoList, inProgressList, doneList) {
    const tasks = getTasks();

    // Clear existing tasks
    [todoList, inProgressList, doneList].forEach(list => list.innerHTML = '');

    // Create and append task cards to their respective columns
    tasks.forEach(task => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case 'in-progress':
                inProgressList.appendChild(taskCard);
                break;
            case 'done':
                doneList.appendChild(taskCard);
                break;
            default:
                todoList.appendChild(taskCard);
                break;
        }
    });
}

// Create a task card
function createTaskCard(task) {
    const card = document.createElement('div');
    card.className = 'task-card';
    card.setAttribute('draggable', 'true');
    card.dataset.id = task.id;

    card.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <span>${formatDate(task.date)}</span>
    `;

    // Add drag event listeners
    card.addEventListener('dragstart', () => {
        card.classList.add('dragging');
    });
    card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
    });

    return card;
}

// Save task statuses after dragging and dropping
function saveTaskStatuses() {
    const tasks = getTasks();

    const todoTasks = document.querySelectorAll('#todo-list .task-card');
    const inProgressTasks = document.querySelectorAll('#in-progress-list .task-card');
    const doneTasks = document.querySelectorAll('#done-list .task-card');

    updateTaskStatuses(tasks, todoTasks, 'todo');
    updateTaskStatuses(tasks, inProgressTasks, 'in-progress');
    updateTaskStatuses(tasks, doneTasks, 'done');

    // Save the updated tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Update task statuses based on their column
function updateTaskStatuses(tasks, taskCards, status) {
    taskCards.forEach(card => {
        const task = tasks.find(t => t.id == card.dataset.id);
        if (task) task.status = status;
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}

// Initialize task tracker when the page loads
document.addEventListener('DOMContentLoaded', initializeTaskTracker);


function saveOrUpdateTask(task) {
    const tasks = getTasks();
    const existingIndex = tasks.findIndex(t => t.id == task.id);

    if (existingIndex >= 0) {
        // Update existing task
        tasks[existingIndex] = task;
    } else {
        // Save new task
        tasks.push(task);
    }

    // Save the updated tasks array to localStorage
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
