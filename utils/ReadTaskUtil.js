
const fs = require('fs');
const path = require('path');

// Locate the tasks.json file
const tasksFilePath = path.join(__dirname, 'tasks.json');

// Read tasks from the JSON file
function readTasks() {
    try {
        const data = fs.readFileSync(tasksFilePath, 'utf8');

        const taskData = JSON.parse(data);

        // Check whether the JSON contains a tasks array
        if (!taskData || !Array.isArray(taskData.tasks)) {
            const error = new Error('Invalid task data format');
            error.statusCode = 500;
            throw error;
        }

        return taskData.tasks;

    } catch (error) {
        if (error.code === 'ENOENT') {
            const fileError = new Error('Task data file not found');
            fileError.statusCode = 500;
            throw fileError;
        }

        if (error instanceof SyntaxError) {
            const jsonError = new Error('Invalid JSON format in tasks file');
            jsonError.statusCode = 500;
            throw jsonError;
        }

        throw error;
    }
}

// Check whether the search and filter values are valid
function validateFilters(query) {
    const validCategories = ['School', 'Personal', 'Work', 'Project'];
    const validPriorities = ['Low', 'Medium', 'High'];
    const validStatuses = ['Pending', 'In Progress', 'Completed'];

    if (query.category && !validCategories.includes(query.category)) {
        const error = new Error('Invalid category');
        error.statusCode = 400;
        throw error;
    }

    if (query.priority && !validPriorities.includes(query.priority)) {
        const error = new Error('Invalid priority');
        error.statusCode = 400;
        throw error;
    }

    if (query.status && !validStatuses.includes(query.status)) {
        const error = new Error('Invalid status');
        error.statusCode = 400;
        throw error;
    }

    if (query.sortBy && query.sortBy !== 'deadline') {
        const error = new Error('Invalid sorting field');
        error.statusCode = 400;
        throw error;
    }

    if (query.order && !['asc', 'desc'].includes(query.order)) {
        const error = new Error('Invalid sorting order');
        error.statusCode = 400;
        throw error;
    }
}

// Search and filter tasks
function filterTasks(tasks, query) {
    let filteredTasks = tasks;

    // Search tasks by title
    if (query.search) {
        filteredTasks = filteredTasks.filter(task =>
            task.title.toLowerCase().includes(query.search.toLowerCase())
        );
    }

    // Filter by category
    if (query.category) {
        filteredTasks = filteredTasks.filter(task =>
            task.category === query.category
        );
    }

    // Filter by priority
    if (query.priority) {
        filteredTasks = filteredTasks.filter(task =>
            task.priority === query.priority
        );
    }

    // Filter by status
    if (query.status) {
        filteredTasks = filteredTasks.filter(task =>
            task.status === query.status
        );
    }

    return filteredTasks;
}

// Sort tasks by deadline
function sortTasks(tasks, query) {
    if (!query.sortBy) {
        return tasks;
    }

    tasks.sort((a, b) => {
        const result = a.deadline.localeCompare(b.deadline);

        if (query.order === 'desc') {
            return -result;
        }

        return result;
    });

    return tasks;
}

// Retrieve tasks with search, filters and sorting
function getTasks(query = {}) {
    validateFilters(query);

    const tasks = readTasks();

    const filteredTasks = filterTasks(tasks, query);

    const sortedTasks = sortTasks(filteredTasks, query);

    return sortedTasks;
}

// Export functions for use in index.js
module.exports = {
    readTasks,
    getTasks
};
