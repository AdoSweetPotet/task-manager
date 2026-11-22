
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priorityFilter = document.getElementById('priorityFilter');
const statusFilter = document.getElementById('statusFilter');
const sortOrder = document.getElementById('sortOrder');
const resetFilters = document.getElementById('resetFilters');
const taskList = document.getElementById('taskList');
const resultMessage = document.getElementById('resultMessage');

// Escape text before inserting it into HTML
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

// Retrieve tasks from backend
async function loadTasks() {
    try {
        const params = new URLSearchParams();

        if (searchInput.value.trim()) {
            params.set('search', searchInput.value.trim());
        }

        if (categoryFilter.value) {
            params.set('category', categoryFilter.value);
        }

        if (priorityFilter.value) {
            params.set('priority', priorityFilter.value);
        }

        if (statusFilter.value) {
            params.set('status', statusFilter.value);
        }

        if (sortOrder.value) {
            params.set('sortBy', 'deadline');
            params.set('order', sortOrder.value);
        }

        const response = await fetch(`/api/tasks?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Unable to retrieve tasks');
        }

        displayTasks(data.tasks);

    } catch (error) {
        taskList.innerHTML = '';
        resultMessage.textContent = error.message;
    }
}

// Display retrieved tasks
function displayTasks(tasks) {
    taskList.innerHTML = '';

    resultMessage.textContent = `${tasks.length} task(s) found`;

    if (tasks.length === 0) {
        taskList.innerHTML = `
            <p class="no-tasks">No matching tasks found.</p>
        `;
        return;
    }

    tasks.forEach(task => {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';

        taskCard.innerHTML = `
            <div class="task-card-header">
                <h3>${escapeHTML(task.title)}</h3>

                <span class="task-id">
                    ${escapeHTML(task.id)}
                </span>
            </div>

            <p class="task-description">
                ${escapeHTML(task.description)}
            </p>

            <div class="task-details">
                <p>
                    <strong>Category:</strong>
                    ${escapeHTML(task.category)}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${escapeHTML(task.priority)}
                </p>

                <p>
                    <strong>Status:</strong>
                    ${escapeHTML(task.status)}
                </p>

                <p>
                    <strong>Deadline:</strong>
                    ${escapeHTML(task.deadline)}
                </p>
            </div>
        `;

        taskList.appendChild(taskCard);
    });
}

// Reload tasks whenever filters change
searchInput.addEventListener('input', loadTasks);
categoryFilter.addEventListener('change', loadTasks);
priorityFilter.addEventListener('change', loadTasks);
statusFilter.addEventListener('change', loadTasks);
sortOrder.addEventListener('change', loadTasks);

// Reset all filters
resetFilters.addEventListener('click', () => {
    searchInput.value = '';
    categoryFilter.value = '';
    priorityFilter.value = '';
    statusFilter.value = '';
    sortOrder.value = '';

    loadTasks();
});

// Load all tasks when page opens
loadTasks();
