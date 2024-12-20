// Function to get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// Initialize charts
function initializeCharts() {
    const tasks = getTasks();

    // Task Completion Chart (completed vs. not completed)
    const taskCompletionData = getTaskCompletionData(tasks);
    const taskCompletionChart = new Chart(document.getElementById('taskCompletionChart'), {
        type: 'pie',
        data: {
            labels: ['Completed', 'Pending'],
            datasets: [{
                label: 'Task Completion',
                data: taskCompletionData,
                backgroundColor: ['#28a745', '#dc3545'],
                borderColor: ['#28a745', '#dc3545'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
            },
        },
    });

    // Task Priority Chart (distribution of task priority)
    const taskPriorityData = getTaskPriorityData(tasks);
    const taskPriorityChart = new Chart(document.getElementById('taskPriorityChart'), {
        type: 'bar',
        data: {
            labels: ['Low', 'Medium', 'High'],
            datasets: [{
                label: 'Task Priority Distribution',
                data: taskPriorityData,
                backgroundColor: '#007bff',
                borderColor: '#007bff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
        },
    });

    // Task Status Chart (distribution of tasks by status)
    const taskStatusData = getTaskStatusData(tasks);
    const taskStatusChart = new Chart(document.getElementById('taskStatusChart'), {
        type: 'bar',
        data: {
            labels: ['To-Do', 'In-Progress', 'Done'],
            datasets: [{
                label: 'Task Status Distribution',
                data: taskStatusData,
                backgroundColor: '#ffc107',
                borderColor: '#ffc107',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                }
            },
        },
    });
}

// Get task completion data (completed vs pending)
function getTaskCompletionData(tasks) {
    let completed = 0;
    let pending = 0;

    tasks.forEach(task => {
        if (task.status === 'done') {
            completed++;
        } else {
            pending++;
        }
    });

    return [completed, pending];
}

// Get task priority distribution
function getTaskPriorityData(tasks) {
    let low = 0;
    let medium = 0;
    let high = 0;

    tasks.forEach(task => {
        if (task.priority === 'Low') {
            low++;
        } else if (task.priority === 'Medium') {
            medium++;
        } else if (task.priority === 'High') {
            high++;
        }
    });

    return [low, medium, high];
}

// Get task status distribution
function getTaskStatusData(tasks) {
    let todo = 0;
    let inProgress = 0;
    let done = 0;

    tasks.forEach(task => {
        if (task.status === 'todo') {
            todo++;
        } else if (task.status === 'in-progress') {
            inProgress++;
        } else if (task.status === 'done') {
            done++;
        }
    });

    return [todo, inProgress, done];
}

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', initializeCharts);
