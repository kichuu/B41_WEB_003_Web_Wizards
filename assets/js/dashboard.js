// Select the container where content will be loaded\
const username = document.getElementById("username");
const contentContainer = document.getElementById("content");
const token = localStorage.getItem("token");
console.log(token)
if (!token) {
    window.location.href = "./login.html"
}
// Function to load a page dynamically
function loadPage(page) {
    // Fetch the content of the page
    fetch(`../pages/${page}`)
        .then((response) => response.text())
        .then((html) => {
            // Insert the fetched content into the container
            contentContainer.innerHTML = html;

            // Initialize task functionality if task page is loaded
            if (page === "task.html") {
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
        loadPage(page);
    });
});

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
    const lastPage = localStorage.getItem("currentPage") || "task.html";
    loadPage(lastPage);
});

// Task Management Functions
function initializeTaskPage() {
    const modal = document.getElementById("task-modal");
    const addTaskButton = document.getElementById("add-task-button");
    const addNewTaskCard = document.querySelector(".add-new-task");
    const closeButton = document.querySelector(".close");
    const taskForm = document.getElementById("task-form");
    const taskGrid = document.getElementById("task-grid");

    // Add event listeners
    [addTaskButton, addNewTaskCard].forEach((element) => {
        if (element) element.addEventListener("click", () => openModal(modal));
    });

    if (closeButton) {
        closeButton.addEventListener("click", () => closeModal(modal, taskForm));
    }

    if (modal) {
        window.addEventListener("click", (e) => {
            if (e.target === modal) closeModal(modal, taskForm);
        });
    }

    if (taskForm) {
        taskForm.addEventListener("submit", (e) =>
            handleTaskSubmit(e, modal, taskForm, taskGrid)
        );
    }

    // Load existing tasks
    loadTasks(taskGrid);
}

function openModal(modal) {
    if (modal) modal.style.display = "block";
}

function closeModal(modal, form) {
    if (modal) modal.style.display = "none";
    if (form) form.reset();
}

function handleTaskSubmit(e, modal, form, taskGrid) {
    e.preventDefault();

    const task = {
        id: form.getAttribute("data-edit-id") || Date.now(), // Check if editing
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        date: document.getElementById("date").value,
        priority: document.getElementById("priority").value,
    };

    saveOrUpdateTask(task);
    refreshTaskGrid(taskGrid);
    closeModal(modal, form);
}

function saveOrUpdateTask(task) {
    const tasks = getTasks();
    const existingIndex = tasks.findIndex((t) => t.id == task.id);

    if (existingIndex >= 0) {
        // Update existing task
        tasks[existingIndex] = task;
    } else {
        // Save new task
        tasks.push(task);
    }

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function getTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function loadTasks(taskGrid) {
    if (!taskGrid) return;

    // Clear existing tasks except the "Add New Task" card
    const addNewTaskCard = taskGrid.querySelector(".add-new-task");
    taskGrid.innerHTML = "";
    if (addNewTaskCard) {
        taskGrid.appendChild(addNewTaskCard);
    }

    // Load and display tasks
    const tasks = getTasks();
    tasks.forEach((task) => addTaskToGrid(task, taskGrid));
}

function addTaskToGrid(task, taskGrid) {
    if (!taskGrid) return;

    const taskCard = document.createElement("div");
    taskCard.className = `task-card ${task.priority}`;
    taskCard.innerHTML = `
    <div class="icons">
        <i class="fa-solid fa-pen edit-btn" data-id="${task.id}"></i>
        <i class="fa-solid fa-trash delete-btn" data-id="${task.id}"></i>
    </div>
    <h3>${task.title}</h3>
    <p>${task.description}</p>
    <div class="task-footer">
      <span>${formatDate(task.date)}</span>
      <span class="priority">${task.priority}</span>
    </div>
  `;

    // Insert before the "Add New Task" card
    const addNewTaskCard = taskGrid.querySelector(".add-new-task");
    if (addNewTaskCard) {
        taskGrid.insertBefore(taskCard, addNewTaskCard);
    } else {
        taskGrid.appendChild(taskCard);
    }

    // Add delete functionality
    const deleteBtn = taskCard.querySelector(".delete-btn");
    if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
            deleteTask(task.id, taskGrid);
        });
    }

    // Add edit functionality
    const editBtn = taskCard.querySelector(".edit-btn");
    if (editBtn) {
        editBtn.addEventListener("click", () => {
            openEditModal(task, taskGrid);
        });
    }
}

function deleteTask(id, taskGrid) {
    const tasks = getTasks().filter((task) => task.id != id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
    refreshTaskGrid(taskGrid);
}

function openEditModal(task, taskGrid) {
    const modal = document.getElementById("task-modal");
    const form = document.getElementById("task-form");

    // Populate the form with task data
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("date").value = task.date;
    document.getElementById("priority").value = task.priority;

    // Set the edit ID on the form
    form.setAttribute("data-edit-id", task.id);

    openModal(modal);
}

function refreshTaskGrid(taskGrid) {
    loadTasks(taskGrid);
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
}




/// Initialize task tracker functionality
function initializeTaskTracker() {
    const columns = document.querySelectorAll(".task-list");

    // Drag events for task cards
    columns.forEach((column) => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector(".dragging");
            column.appendChild(draggingCard);
        });

        column.addEventListener("drop", () => {
            saveTaskStatuses();
        });
    });

    loadTasksIntoColumns();
}

// Load tasks and distribute them into columns based on status
function loadTasksIntoColumns() {
    const tasks = getTasks();
    const todoList = document.getElementById("todo-list");
    const inProgressList = document.getElementById("in-progress-list");
    const doneList = document.getElementById("done-list");

    // Clear columns
    [todoList, inProgressList, doneList].forEach((list) => (list.innerHTML = ""));

    tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case "in-progress":
                inProgressList.appendChild(taskCard);
                break;
            case "done":
                doneList.appendChild(taskCard);
                break;
            default:
                todoList.appendChild(taskCard);
                break;
        }
    });
}

// Create a draggable task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("draggable", "true");
    card.dataset.id = task.id;

    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <span>${formatDate(task.date)}</span>
    `;

    // Add drag event listeners
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });

    return card;
}

// Save task statuses after dragging and dropping
function saveTaskStatuses() {
    const tasks = getTasks();

    const todoTasks = document.querySelectorAll("#todo-list .task-card");
    const inProgressTasks = document.querySelectorAll(
        "#in-progress-list .task-card"
    );
    const doneTasks = document.querySelectorAll("#done-list .task-card");

    updateTaskStatuses(tasks, todoTasks, "todo");
    updateTaskStatuses(tasks, inProgressTasks, "in-progress");
    updateTaskStatuses(tasks, doneTasks, "done");

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task statuses based on their column
function updateTaskStatuses(tasks, taskCards, status) {
    taskCards.forEach((card) => {
        const task = tasks.find((t) => t.id == card.dataset.id);
        if (task) task.status = status;
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
}




/// Initialize task tracker functionality
function initializeTaskTracker() {
    const columns = document.querySelectorAll(".task-list");

    // Drag events for task cards
    columns.forEach((column) => {
        column.addEventListener("dragover", (e) => {
            e.preventDefault();
            const draggingCard = document.querySelector(".dragging");
            column.appendChild(draggingCard);
        });

        column.addEventListener("drop", () => {
            saveTaskStatuses();
        });
    });

    loadTasksIntoColumns();
}

// Load tasks and distribute them into columns based on status
function loadTasksIntoColumns() {
    const tasks = getTasks();
    const todoList = document.getElementById("todo-list");
    const inProgressList = document.getElementById("in-progress-list");
    const doneList = document.getElementById("done-list");

    // Clear columns
    [todoList, inProgressList, doneList].forEach((list) => (list.innerHTML = ""));

    tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        switch (task.status) {
            case "in-progress":
                inProgressList.appendChild(taskCard);
                break;
            case "done":
                doneList.appendChild(taskCard);
                break;
            default:
                todoList.appendChild(taskCard);
                break;
        }
    });
}

// Create a draggable task card
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("draggable", "true");
    card.dataset.id = task.id;

    card.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <span>${formatDate(task.date)}</span>
    `;

    // Add drag event listeners
    card.addEventListener("dragstart", () => {
        card.classList.add("dragging");
    });
    card.addEventListener("dragend", () => {
        card.classList.remove("dragging");
    });

    return card;
}

// Save task statuses after dragging and dropping
function saveTaskStatuses() {
    const tasks = getTasks();

    const todoTasks = document.querySelectorAll("#todo-list .task-card");
    const inProgressTasks = document.querySelectorAll(
        "#in-progress-list .task-card"
    );
    const doneTasks = document.querySelectorAll("#done-list .task-card");

    updateTaskStatuses(tasks, todoTasks, "todo");
    updateTaskStatuses(tasks, inProgressTasks, "in-progress");
    updateTaskStatuses(tasks, doneTasks, "done");

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Update task statuses based on their column
function updateTaskStatuses(tasks, taskCards, status) {
    taskCards.forEach((card) => {
        const task = tasks.find((t) => t.id == card.dataset.id);
        if (task) task.status = status;
    });
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB");
}

// Initialize task tracker when the page loads
document.addEventListener("DOMContentLoaded", initializeTaskTracker);

// Select the container where content will be loaded
const username = document.getElementById("username")
const contentContainer = document.getElementById("content")
const token = localStorage.getItem("token")
if (!token) {
  window.location.href = "./login.html"
}

// Function to load a page dynamically
function loadPage(page) {
  fetch(`../pages/${page}`)
    .then((response) => response.text())
    .then((html) => {
      contentContainer.innerHTML = html

      if (page === "task.html") {
        initializeTaskPage()
      }

      localStorage.setItem("currentPage", page)
    })
    .catch((error) => {
      console.error("Error loading page:", error)
      contentContainer.innerHTML = `<p>Error loading page. Please try again later.</p>`
    })
}

// Add event listeners to navigation links
document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault()
    const page = link.getAttribute("data-page")
    loadPage(page)
  })
})

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
  const lastPage = localStorage.getItem("currentPage") || "task.html"
  loadPage(lastPage)
})

// Task Management Functions
// Task Management Functions
function initializeTaskPage() {
  const modal = document.getElementById("task-modal")
  const addTaskButton = document.getElementById("add-task-button")
  const addNewTaskCard = document.querySelector(".add-new-task")
  const closeButton = document.querySelector(".close")
  const taskForm = document.getElementById("task-form")
  const taskGrid = document.getElementById("task-grid")

  const user = JSON.parse(localStorage.getItem("user"))
  username.innerHTML = user.name

  if (addTaskButton) {
    addTaskButton.addEventListener("click", () => openModal(modal))
  }
  if (addNewTaskCard) {
    addNewTaskCard.addEventListener("click", () => openModal(modal))
  }
  if (closeButton) {
    closeButton.addEventListener("click", () => closeModal(modal, taskForm))
  }
  if (modal) {
    window.addEventListener("click", (e) => {
      if (e.target === modal) closeModal(modal, taskForm)
    })
  }
  if (taskForm) {
    taskForm.addEventListener("submit", (e) =>
      handleTaskSubmit(e, modal, taskForm, taskGrid)
    )
  }

  loadTasks(taskGrid)
}

function openModal(modal) {
  if (modal) {
    modal.style.display = "block"
  }
}

function closeModal(modal, form) {
  if (modal) {
    modal.style.display = "none"
  }
  if (form) {
    form.reset()
  }
}

function handleTaskSubmit(e, modal, form, taskGrid) {
  e.preventDefault()

  const task = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    dueDate: document.getElementById("date").value,
    priority: document.getElementById("priority").value,
    project: document.getElementById("project").value, // Ensure project input is present
    status: "Pending", // Default status
  }

  fetch("https://b41-web-003-web-wizards.onrender.com/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(task),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add task")
      }
      return response.json()
    })
    .then((savedTask) => {
      addTaskToGrid(savedTask, taskGrid)
      closeModal(modal, form)
    })
    .catch((error) => {
      console.error("Error adding task:", error)
      alert("Failed to add task. Please try again.")
    })
}

function loadTasks(taskGrid) {
  if (!taskGrid) return

  const addNewTaskCard = taskGrid.querySelector(".add-new-task")
  taskGrid.innerHTML = ""
  if (addNewTaskCard) {
    taskGrid.appendChild(addNewTaskCard)
  }

  fetch("https://b41-web-003-web-wizards.onrender.com/api/tasks/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      return response.json()
    })
    .then((tasks) => {
      tasks.forEach((task) => addTaskToGrid(task, taskGrid))
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error)
      alert("Failed to load tasks. Please try again.")
    })
}

function addTaskToGrid(task, taskGrid) {
  if (!taskGrid) return

  const taskCard = document.createElement("div")
  taskCard.className = `task-card ${task.priority}`
  taskCard.innerHTML = `
    <div>
        <i class="fa-solid fa-trash delete-btn" data-id="${task._id}"></i> 
         <i class="fa-solid fa-edit edit-btn" data-id="${task._id}"></i>
        </div>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="task-footer">
            <span>${formatDate(task.dueDate)}</span>
            <span class="priority">${task.priority}</span>
        </div>
    `

  const addNewTaskCard = taskGrid.querySelector(".add-new-task")
  if (addNewTaskCard) {
    taskGrid.insertBefore(taskCard, addNewTaskCard)
  } else {
    taskGrid.appendChild(taskCard)
  }

  const deleteBtn = taskCard.querySelector(".delete-btn")
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      deleteTask(task._id, taskGrid)
    })
  }

  const editBtn = taskCard.querySelector(".edit-btn")
  if (editBtn) {
    editBtn.addEventListener("click", () => {
      openEditModal(task)
    })
  }
}

function openEditModal(task) {
  const modal = document.getElementById("task-modal")
  const taskForm = document.getElementById("task-form")

  if (modal && taskForm) {
    document.getElementById("title").value = task.title
    document.getElementById("description").value = task.description
    document.getElementById("date").value = task.dueDate
    document.getElementById("priority").value = task.priority

    modal.style.display = "block"

    taskForm.onsubmit = (e) => {
      e.preventDefault()
      handleTaskEditSubmit(e, modal, taskForm, task)
    }
  }
}

function handleTaskEditSubmit(e, modal, form, task) {
  e.preventDefault()

  const updatedTask = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    dueDate: document.getElementById("date").value,
    priority: document.getElementById("priority").value,
  }

  fetch(`https://b41-web-003-web-wizards.onrender.com/api/tasks/${task._id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedTask),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to update task")
      }
      return response.json()
    })
    .then(() => {
      loadTasks(document.getElementById("task-grid"))
      closeModal(modal, form)
    })
    .catch((error) => {
      console.error("Error updating task:", error)
      alert("Failed to update task. Please try again.")
    })
}

function deleteTask(id, taskGrid) {
  fetch(`https://b41-web-003-web-wizards.onrender.com/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      return response.json()
    })
    .then(() => {
      loadTasks(taskGrid)
    })
    .catch((error) => {
      console.error("Error deleting task:", error)
      alert("Failed to delete task. Please try again.")
    })
}

function formatDate(dateString) {
  const date = new Date(dateString)
  return date.toLocaleDateString("en-GB")
}

// Initialize task tracker when the page loads
document.addEventListener("DOMContentLoaded", initializeTaskTracker);
