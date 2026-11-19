
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, priority, status, deadline } = req.body;

        // Basic validation
        if (
            (title !== undefined && title.trim() === '') ||
            (description !== undefined && description.trim() === '') ||
            (priority !== undefined && !['High', 'Medium', 'Low'].includes(priority)) ||
            (status !== undefined && !['Pending', 'In Progress', 'Completed'].includes(status)) ||
            (deadline !== undefined && isNaN(Date.parse(deadline)))
        ) {
            return res.status(400).json({ message: 'Invalid task information.' });
        }

        let tasks = [];

        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'No tasks found to edit.' });
            } else {
                throw err;
            }
        }

        const taskIndex = tasks.findIndex(t => t.id == id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        // Update task fields
        tasks[taskIndex] = {
            ...tasks[taskIndex],
            title: title !== undefined ? title : tasks[taskIndex].title,
            description: description !== undefined ? description : tasks[taskIndex].description,
            priority: priority !== undefined ? priority : tasks[taskIndex].priority,
            status: status !== undefined ? status : tasks[taskIndex].status,
            deadline: deadline !== undefined ? deadline : tasks[taskIndex].deadline
        };

        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');

        return res.status(200).json({
            message: 'Task updated successfully!',
            task: tasks[taskIndex]
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { updateTask };
