// const modal = document.getElementById("task-modal");
// const addTaskButton = document.getElementById("add-task-button");
// const addNewTaskCard = document.querySelector(".add-new-task");
// const closeButton = document.querySelector(".close");
// const taskForm = document.getElementById("task-form");
// const taskGrid = document.getElementById("task-grid");

// [addTaskButton, addNewTaskCard].forEach((element) =>
//     element.addEventListener("click", openModal)
// );
// closeButton.addEventListener("click", closeModal);
// window.addEventListener("click", (e) => {
//     if (e.target === modal) closeModal();
// });
// taskForm.addEventListener("submit", handleTaskSubmit);
// document.addEventListener("DOMContentLoaded", loadTasks);

// function openModal() {
//     modal.style.display = "block";
// }
// function closeModal() {
//     modal.style.display = "none";
//     taskForm.reset();
// }

// function handleTaskSubmit(e) {
//     e.preventDefault();
//     const taskId = document.getElementById("task-id").value;
//     const task = {
//         id: taskId || Date.now(),
//         title: document.getElementById("title").value,
//         description: document.getElementById("description").value,
//         date: document.getElementById("date").value,
//         priority: document.getElementById("priority").value,
//     };
//     if (taskId) {
//         updateTask(task);
//     } else {
//         saveTask(task);
//     }
//     closeModal();
//     refreshTaskGrid();
// }

// function saveTask(task) {
//     const tasks = getTasks();
//     tasks.push(task);
//     localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function updateTask(updatedTask) {
//     const tasks = getTasks().map((task) =>
//         task.id == updatedTask.id ? updatedTask : task
//     );
//     localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function getTasks() {
//     return JSON.parse(localStorage.getItem("tasks") || "[]");
// }

// function loadTasks() {
//     const tasks = getTasks();
//     tasks.forEach(addTaskToGrid);
// }

// function addTaskToGrid(task) {
//     const taskCard = document.createElement("div");
//     taskCard.className = `task-card ${task.priority}`;
//     taskCard.innerHTML = `
//   `;

//     taskCard.querySelector(".edit-btn").addEventListener("click", () => {
//         populateForm(task);
//         openModal();
//     });

//     taskCard.querySelector(".delete-btn").addEventListener("click", () => {
//         deleteTask(task.id);
//         refreshTaskGrid();
//     });

//     taskGrid.insertBefore(taskCard, taskGrid.lastElementChild);
// }

// function deleteTask(id) {
//     const tasks = getTasks().filter((task) => task.id !== id);
//     localStorage.setItem("tasks", JSON.stringify(tasks));
// }

// function populateForm(task) {
//     document.getElementById("task-id").value = task.id;
//     document.getElementById("title").value = task.title;
//     document.getElementById("description").value = task.description;
//     document.getElementById("date").value = task.date;
//     document.getElementById("priority").value = task.priority;
// }

// function refreshTaskGrid() {
//     const addNewTaskCard = taskGrid.lastElementChild;
//     taskGrid.innerHTML = "";
//     taskGrid.appendChild(addNewTaskCard);
//     loadTasks();
// }

// function formatDate(dateString) {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-GB");
// }
