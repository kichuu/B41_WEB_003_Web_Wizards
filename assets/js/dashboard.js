// Select the container where content will be loaded
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
      if (page === "task-tracker.html") {
        fetchTasks()
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
            <span class="priority">${task.priority
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
  const todoContainer = document.getElementById("todo-tasks")
  const inProgressContainer = document.getElementById("in-progress-tasks")
  const doneContainer = document.getElementById("done-tasks")

  tasks.forEach((task) => {
    const taskElement = document.createElement("div")
    taskElement.style.cssText = `
      background-color: #2d2d2d;
      color: white;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: 1rem;
      margin-bottom: 1rem;
      transition: background-color 0.3s;
    `
    taskElement.onmouseover = () => taskElement.style.backgroundColor = "#3a3a3a"
    taskElement.onmouseout = () => taskElement.style.backgroundColor = "#2d2d2d"

    // Task Title
    const taskTitle = document.createElement("h3")
    taskTitle.style.cssText = `
      font-size: 1.25rem;
      font-weight: bold;
      color: #f0f0f0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    `
    taskTitle.textContent = task.title
    taskElement.appendChild(taskTitle)

    // Add task details inside the task card
    const taskDetails = document.createElement("div")
    taskDetails.style.cssText = `
      color: #a0a0a0;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    `
    taskDetails.textContent = task.description || "No description provided"
    taskElement.appendChild(taskDetails)

    // Add priority label with button
    const taskPriorityContainer = document.createElement("div")
    taskPriorityContainer.style.cssText = `
      margin-top: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    `

    const priorityButton = document.createElement("button")
    priorityButton.style.cssText = `
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: default;
    `

    // Dynamically change button color based on priority
    if (task.priority === "high") {
      priorityButton.style.backgroundColor = "#f44336" // Red
    } else if (task.priority === "medium") {
      priorityButton.style.backgroundColor = "#ff9800" // Yellow
    } else {
      priorityButton.style.backgroundColor = "#4caf50" // Green
    }

    priorityButton.textContent = task.priority
    taskPriorityContainer.appendChild(priorityButton)
    taskElement.appendChild(taskPriorityContainer)

    // Append the task element to the appropriate container
    if (task.status === "todo") {
      todoContainer.appendChild(taskElement)
    } else if (task.status === "in-progress") {
      inProgressContainer.appendChild(taskElement)
    } else if (task.status === "done") {
      doneContainer.appendChild(taskElement)
    }


    taskElement.draggable = true
    taskElement.setAttribute("data-id", task._id)

    // Add drag event listeners
    taskElement.addEventListener("dragstart", dragStart)
    taskElement.addEventListener("dragend", dragEnd)

    // Append task to appropriate container based on priority
    switch (task.status.toLowerCase()) {
      case "todo":
        todoContainer.appendChild(taskElement)
        break
      case "pending":
        inProgressContainer.appendChild(taskElement)
        break
      case "done":
        doneContainer.appendChild(taskElement)
        break
    }
  })
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
    todo: "todo",
    "in-progress": "pending",
    done: "done",
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

// Load the last visited page or default to task.html
window.addEventListener("DOMContentLoaded", () => {
  const lastPage = localStorage.getItem("currentPage") || "task.html"
  loadPage(lastPage)
  const logoutButton = document.querySelector('.logout-button');

  // Add click event listener to the logout button
  logoutButton.addEventListener('click', () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Optionally, redirect to the login page
    window.location.href = 'login.html'; // Change to your login page URL
  });
  // fetchTasks()
})



// Get all navigation links
const navLinks = document.querySelectorAll('.functionality a');

// Add event listener for each link to toggle active state
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    // Remove the 'active' class from all links
    navLinks.forEach(link => link.classList.remove('active'));

    // Add the 'active' class to the clicked link
    this.classList.add('active');
  });
});

