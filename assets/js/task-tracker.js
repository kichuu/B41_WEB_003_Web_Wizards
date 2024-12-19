async function fetchTasks() {
    try {
        const response = await fetch("https://task-master-c3df1-default-rtdb.firebaseio.com/tasks.json");
        const data = await response.json();

        if (data) {
            populateTasks(data);
        }
    } catch (error) {
        console.error("Error fetching tasks:", error);
    }
}

function populateTasks(tasks) {
    const toDo = document.getElementById("to-do-tasks");
    const inProgress = document.getElementById("in-progress-tasks");
    const completed = document.getElementById("completed-tasks");

    toDo.innerHTML = "";
    inProgress.innerHTML = "";
    completed.innerHTML = "";

    for (const [id, task] of Object.entries(tasks)) {
        const taskElement = createTaskElement(id, task);

        if (task.status === "to-do") {
            toDo.appendChild(taskElement);
        } else if (task.status === "in-progress") {
            inProgress.appendChild(taskElement);
        } else if (task.status === "completed") {
            completed.appendChild(taskElement);
        }
    }
}

function createTaskElement(id, task) {
    const taskDiv = document.createElement("div");
    taskDiv.className = "task";
    taskDiv.draggable = true;
    taskDiv.dataset.id = id;
    taskDiv.dataset.status = task.status;

    taskDiv.innerHTML = `
      <h3>${task.title}</h3>
      <p>${task.description}</p>
      <span>Priority: ${task.priority}</span>
      <button class="edit-task">Edit</button>
      <button class="delete-task">Delete</button>
    `;

    taskDiv.addEventListener("dragstart", handleDragStart);
    taskDiv.querySelector(".delete-task").addEventListener("click", () => deleteTask(id));
    taskDiv.querySelector(".edit-task").addEventListener("click", () => editTask(id, task));

    return taskDiv;
}

async function deleteTask(id) {
    try {
        await fetch(`https://task-master-c3df1-default-rtdb.firebaseio.com/tasks/${id}.json`, {
            method: "DELETE",
        });
        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

async function editTask(id, task) {
    const newTitle = prompt("Edit title:", task.title);
    const newDescription = prompt("Edit description:", task.description);
    const newPriority = prompt("Edit priority (low, medium, high):", task.priority);

    if (newTitle && newDescription && newPriority) {
        try {
            await fetch(`https://task-master-c3df1-default-rtdb.firebaseio.com/tasks/${id}.json`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, description: newDescription, priority: newPriority }),
            });
            fetchTasks();
        } catch (error) {
            console.error("Error editing task:", error);
        }
    }
}

function handleDragStart(e) {
    e.dataTransfer.setData("id", e.target.dataset.id);
}

document.querySelectorAll(".tasks").forEach((column) => {
    column.addEventListener("dragover", (e) => e.preventDefault());

    column.addEventListener("drop", async (e) => {
        const id = e.dataTransfer.getData("id");
        const newStatus = column.parentElement.id;

        try {
            await fetch(`https://task-master-c3df1-default-rtdb.firebaseio.com/tasks/${id}.json`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            fetchTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    });
});

fetchTasks();
