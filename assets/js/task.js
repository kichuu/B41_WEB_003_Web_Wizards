// // DOM Elements



// const modal = document.getElementById('task-modal');
// const addTaskButton = document.getElementById('add-task-button');
// const addNewTaskCard = document.querySelector('.add-new-task');
// const closeButton = document.querySelector('.close');
// const taskForm = document.getElementById('task-form');
// const taskGrid = document.getElementById('task-grid');
// const submitBtn = document.getElementById('submitBtn');
// console.log(submitBtn)
// // Retrieve token from localStorage
// console.log(token);  // Debugging statement
// // http://localhost:5000/api/tasks/

// // Redirect to login if no token is found
// if (!token) {
//     window.location.href = './login.html';  // Redirect to login if no token is found
// }

// // Event Listeners
// [addTaskButton, addNewTaskCard].forEach(element => {
//     element.addEventListener('click', openModal);
// });

// closeButton.addEventListener('click', closeModal);
// window.addEventListener('click', (e) => {
//     if (e.target === modal) closeModal();
// });

// submitBtn.addEventListener('click', handleTaskSubmit);  // Corrected to call handleTaskSubmit

// // Event Listeners for DOMContentLoaded
// document.addEventListener('DOMContentLoaded', loadTasks);  // Event Listeners

// // Function to open the modal
// function openModal() {
//     modal.style.display = 'block';
// }

// // Function to close the modal
// function closeModal() {
//     modal.style.display = 'none';
//     taskForm.reset();
// }

// // Function to handle form submission
// function handleTaskSubmit(e) {
//     e.preventDefault();
//     console.log("hi")


//     const task = {
//         title: document.getElementById('title').value,
//         description: document.getElementById('description').value,
//         dueDate: document.getElementById('date').value,  // Corrected 'due-date' to 'date'
//         priority: document.getElementById('priority').value,
//         status: 'pending',  // Assuming status is 'pending' by default
//     };
//     console.log(task);
//     saveTaskToServer(task);
// }

// // Function to load tasks from the server
// function loadTasks() {
//     fetch('http://localhost:5000/api/tasks/', {
//         headers: {
//             'Authorization': `Bearer ${token}`
//         }
//     })
//         .then(response => response.json())
//         .then(data => {
//             taskGrid.innerHTML = '';  // Clear the existing tasks
//             data.forEach(task => {
//                 const taskCard = createTaskCard(task);
//                 taskGrid.appendChild(taskCard);
//             });
//         })
//         .catch(error => {
//             console.error('Error loading tasks:', error);
//             alert('Failed to load tasks.');
//         });
// }

// // Function to create a task card element
// function createTaskCard(task) {
//     const taskCard = document.createElement('div');
//     taskCard.className = 'task-card';
//     taskCard.innerHTML = `
//         <h3>${task.title}</h3>
//         <p>${task.description}</p>
//         <p>Due Date: ${task.dueDate}</p>
//         <p>Priority: ${task.priority}</p>
//         <p>Status: ${task.status}</p>
//     `;
//     return taskCard;
// }

// // Function to save a task to the server
// function saveTaskToServer(task) {
//     fetch('http://localhost:5000/api/tasks/', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(task),
//     })
//         .then(response => response.json())
//         .then(data => {
//             const taskCard = createTaskCard(data);
//             taskGrid.appendChild(taskCard);  // Add new task to task grid
//             closeModal();  // Close modal after successful task submission
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             alert('Failed to save task. Please try again.');
//         });
// }
