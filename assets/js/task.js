document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("task-modal");
    const addTaskButton = document.getElementById("add-task-button");
    const addNewTaskCard = document.querySelector(".add-new-task");
    const closeButton = document.querySelector(".close");
    const taskForm = document.getElementById("task-form");
    const taskGrid = document.getElementById("task-grid");

    // Open Modal
    const openModal = () => {
        modal.style.display = "block";
    };

    // Close Modal
    const closeModal = () => {
        modal.style.display = "none";
        taskForm.reset();
    };

    addTaskButton.addEventListener("click", openModal);
    addNewTaskCard.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);

    // Handle Task Submission
    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const task = {
            id: Date.now(),
            title: document.getElementById("title").value,
            description: document.getElementById("description").value,
            date: document.getElementById("date").value,
            priority: document.getElementById("priority").value,
        };
        addTaskToGrid(task);
        closeModal();
    });

    // Add Task to Grid
    const addTaskToGrid = (task) => {
        const taskCard = document.createElement("div");
        taskCard.className = `task-card ${task.priority}`;
        taskCard.innerHTML = `
        <h3>${task.title}</h3>
        <p>${task.description}</p>
        <span>${task.date}</span>
      `;
        taskGrid.appendChild(taskCard);
    };
});
