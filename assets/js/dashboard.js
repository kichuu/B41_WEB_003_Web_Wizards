// Select the container where content will be loaded\
const username = document.getElementById("username")
const contentContainer = document.getElementById("content")
const token = localStorage.getItem("token")
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
      contentContainer.innerHTML = html

      // Initialize task functionality if task page is loaded
      if (page === "task.html") {
        initializeTaskPage()
      }

      // Save the current page to localStorage
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
    loadPage(page) // This will work now because loadPage is defined above
  })
})

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
  const lastPage = localStorage.getItem("currentPage") || "task.html"
  loadPage(lastPage)
})

// Task Management Functions (your existing task-related functions)
function initializeTaskPage() {
  const modal = document.getElementById("task-modal")
  const addTaskButton = document.getElementById("add-task-button")
  const addNewTaskCard = document.querySelector(".add-new-task")
  const closeButton = document.querySelector(".close")
  const taskForm = document.getElementById("task-form")
  const taskGrid = document.getElementById("task-grid")

  const user = JSON.parse(localStorage.getItem("user"))
  username.innerHTML = user.name

  // Add event listeners
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

  // Load existing tasks
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
  }

  // Send the task to the backend
  fetch("https://b41-web-003-web-wizards.onrender.com/api/tasks/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use JWT
    },
    body: JSON.stringify(task),
  })
    .then((response) => {
      console.log(task)

      if (!response.ok) {
        throw new Error("Failed to add task")
      }
      console.log(response)
      return response.json()
    })
    .then((savedTask) => {
      // Optionally save to localStorage if needed
      saveTask(savedTask)
      addTaskToGrid(savedTask, taskGrid)
      closeModal(modal, form)
    })
    .catch((error) => {
      console.error("Error adding task:", error)
      alert("Failed to add task. Please try again.")
    })
}

function saveTask(task) {
  const tasks = getTasks()
  tasks.push(task)
  localStorage.setItem("tasks", JSON.stringify(tasks))
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]")
}

function loadTasks(taskGrid) {
  if (!taskGrid) return

  // Clear existing tasks except the "Add New Task" card
  const addNewTaskCard = taskGrid.querySelector(".add-new-task")
  taskGrid.innerHTML = ""
  if (addNewTaskCard) {
    taskGrid.appendChild(addNewTaskCard)
  }

  // Fetch tasks from the API
  fetch("https://b41-web-003-web-wizards.onrender.com/api/tasks/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use JWT
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }
      return response.json()
    })
    .then((tasks) => {
      // Add each task to the grid
      tasks.forEach((task) => {
        addTaskToGrid(task, taskGrid)
        console.log(task)
      })
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error)
      alert("Failed to load tasks. Please try again.")
    })
}

function addTaskToGrid(task, taskGrid) {
  if (!taskGrid) return

  const taskCard = document.createElement("div")
  taskCard.className = `task-card ${task.priority}` // Use priority for class
  taskCard.innerHTML = `
        <i class="fa-solid fa-trash delete-btn" data-id="${task.id}"></i>
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <div class="task-footer">
            <span>${formatDate(task.dueDate)}</span>
            <span class="priority">${
              task.priority
            }</span> <!-- Display priority instead of status -->
        </div>
    `

  // Insert before the "Add New Task" card
  const addNewTaskCard = taskGrid.querySelector(".add-new-task")
  if (addNewTaskCard) {
    taskGrid.insertBefore(taskCard, addNewTaskCard)
  } else {
    taskGrid.appendChild(taskCard)
  }

  // Add delete functionality
  const deleteBtn = taskCard.querySelector(".delete-btn")
  if (deleteBtn) {
    deleteBtn.addEventListener("click", () => {
      deleteTask(task._id, taskGrid)
    })
  }
}

function deleteTask(id, taskGrid) {
  // Send a DELETE request to the backend
  fetch(`https://b41-web-003-web-wizards.onrender.com/api/tasks/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // Assuming you use JWT
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to delete task")
      }
      return response.json() // Optional, depending on your API's response
    })
    .then(() => {
      // Remove the task from the UI
      const tasks = getTasks().filter((task) => task.id !== id)
      localStorage.setItem("tasks", JSON.stringify(tasks))
      loadTasks(taskGrid) // Reload tasks to reflect changes
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

// Fetch tasks from the backend
document.addEventListener("DOMContentLoaded", function () {
  fetchTasks()
})

function fetchTasks() {
  fetch("https://b41-web-003-web-wizards.onrender.com/api/tasks/", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      renderTasks(data)
    })
    .catch((error) => console.error("Error fetching tasks:", error))
}

function renderTasks(tasks) {
    const todoContainer = document.getElementById("todo-tasks");
    const inProgressContainer = document.getElementById("in-progress-tasks");
    const doneContainer = document.getElementById("done-tasks");
  
    tasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.classList.add("task");
      taskElement.textContent = task.title; // Task title
  
      // Add task details inside the task card
      const taskDetails = document.createElement("div");
      taskDetails.classList.add("task-details");
      taskDetails.textContent = task.description || "No description provided";
      taskElement.appendChild(taskDetails);
  
      // Add priority label
      const taskPriority = document.createElement("div");
      taskPriority.classList.add("task-priority");
      taskPriority.textContent = `Priority: ${task.priority}`;
      taskElement.appendChild(taskPriority);
  
      taskElement.draggable = true;
      taskElement.setAttribute("data-id", task.id);
  
      // Add drag event listeners
      taskElement.addEventListener("dragstart", dragStart);
      taskElement.addEventListener("dragend", dragEnd);
  
      // Append task to appropriate container based on priority
      switch (task.priority) {
        case "low":
          todoContainer.appendChild(taskElement);
          break;
        case "medium":
          inProgressContainer.appendChild(taskElement);
          break;
        case "high":
          doneContainer.appendChild(taskElement);
          break;
      }
    });
  }
  

function allowDrop(event) {
  event.preventDefault()
}

function drop(event) {
  event.preventDefault()
  const taskId = event.dataTransfer.getData("taskId")
  const taskElement = document.querySelector(`[data-id="${taskId}"]`)
  const targetColumn = event.target.closest(".column")

  if (targetColumn && taskElement) {
    targetColumn.appendChild(taskElement)
    updateTaskStatus(taskId, targetColumn.id)
  }
}

function dragStart(event) {
  event.dataTransfer.setData("taskId", event.target.getAttribute("data-id"))
  event.target.classList.add("dragging")
}

function dragEnd(event) {
  event.target.classList.remove("dragging")
}

function updateTaskStatus(taskId, newStatus) {
  const statusMapping = {
    todo: "To Do",
    inProgress: "In Progress",
    done: "Done",
  }

  const newStatusName = statusMapping[newStatus]
  const updatedTask = {
    id: taskId,
    status: newStatusName,
  }

  fetch(`https://b41-web-003-web-wizards.onrender.com/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedTask),
  })
    .then((response) => response.json())
    .then((data) => console.log("Task status updated:", data))
    .catch((error) => console.error("Error updating task:", error))
}
