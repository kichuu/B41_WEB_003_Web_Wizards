// Select the container where content will be loaded
const contentContainer = document.getElementById("content");

// Function to load a page dynamically
function loadPage(page) {
    // Fetch the content of the page
    fetch(`../pages/${page}`)
        .then((response) => response.text())
        .then((html) => {
            // Insert the fetched content into the container
            contentContainer.innerHTML = html;

            // Initialize task functionality if task page is loaded
            if (page === 'task.html') {
                initializeTaskPage();
            }

            // Save the current page to localStorage
            localStorage.setItem("currentPage", page);
        })
        .catch((error) => {
            console.error("Error loading page:", error);
            contentContainer.innerHTML = `<p>Error loading page. Please try again later.</p>`;
        });
}

// Add event listeners to navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        const page = link.getAttribute("data-page");
        loadPage(page); // This will work now because loadPage is defined above
    });
});

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
    const lastPage = localStorage.getItem("currentPage") || "task.html";
    loadPage(lastPage);
});

// Task Management Functions (your existing task-related functions)
function initializeTaskPage() {
    const modal = document.getElementById('task-modal');
    const addTaskButton = document.getElementById('add-task-button');
    const addNewTaskCard = document.querySelector('.add-new-task');
    const closeButton = document.querySelector('.close');
    const taskForm = document.getElementById('task-form');
    const taskGrid = document.getElementById('task-grid');

    // Add event listeners
    if (addTaskButton) {
        addTaskButton.addEventListener('click', () => openModal(modal));
    }
    if (addNewTaskCard) {
        addNewTaskCard.addEventListener('click', () => openModal(modal));
    }
    if (closeButton) {
        closeButton.addEventListener('click', () => closeModal(modal, taskForm));
    }
    if (modal) {
        window.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal, taskForm);
        });
    }
    if (taskForm) {
        taskForm.addEventListener('submit', (e) => handleTaskSubmit(e, modal, taskForm, taskGrid));
    }

    // Load existing tasks
    loadTasks(taskGrid);
}

function openModal(modal) {
    if (modal) {
        modal.style.display = 'block';
    }
}

function closeModal(modal, form) {
    if (modal) {
        modal.style.display = 'none';
    }
    if (form) {
        form.reset();
    }
}

function handleTaskSubmit(e, modal, form, taskGrid) {
    e.preventDefault();

    const task = {
        id: Date.now(),
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        date: document.getElementById('date').value,
        priority: document.getElementById('priority').value // Removed status field
    };

    saveTask(task);
    addTaskToGrid(task, taskGrid);
    closeModal(modal, form);
}

function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

function loadTasks(taskGrid) {
    if (!taskGrid) return;

    // Clear existing tasks except the "Add New Task" card
    const addNewTaskCard = taskGrid.querySelector('.add-new-task');
    taskGrid.innerHTML = '';
    if (addNewTaskCard) {
        taskGrid.appendChild(addNewTaskCard);
    }

    // Load and display tasks
    const tasks = getTasks();
    tasks.forEach(task => addTaskToGrid(task, taskGrid));
}

function addTaskToGrid(task, taskGrid) {
    if (!taskGrid) return;

    const taskCard = document.createElement('div');
    taskCard.className = `task-card ${task.priority}`; // Use priority for class
    taskCard.innerHTML = `
        <i class="fa-solid fa-trash delete-btn" data-id="${task.id}"></i>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="task-footer">
            <span>${formatDate(task.date)}</span>
            <span class="priority">${task.priority}</span> <!-- Display priority instead of status -->
        </div>
    `;

    // Insert before the "Add New Task" card
    const addNewTaskCard = taskGrid.querySelector('.add-new-task');
    if (addNewTaskCard) {
        taskGrid.insertBefore(taskCard, addNewTaskCard);
    } else {
        taskGrid.appendChild(taskCard);
    }

    // Add delete functionality
    const deleteBtn = taskCard.querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteTask(task.id, taskGrid);
        });
    }
}

function deleteTask(id, taskGrid) {
    const tasks = getTasks().filter(task => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks(taskGrid);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB');
}
