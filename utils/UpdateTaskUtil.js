
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');

async function updateTask(req, res) {
    try {
        const { id } = req.params;
        const { title, description, category, priority, status, deadline } = req.body;

        // Validate Task ID
        if (!id || !/^Task\d+$/.test(id)) {
            return res.status(400).json({
                message: 'Please enter a valid Task ID.'
            });
        }

        // Validate task information
        if (
            (title !== undefined && (typeof title !== 'string' || !title.trim())) ||
            (description !== undefined && (typeof description !== 'string' || !description.trim())) ||
            (priority !== undefined && !['High', 'Medium', 'Low'].includes(priority)) ||
            (status !== undefined && !['Pending', 'In Progress', 'Completed'].includes(status)) ||
            (deadline !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(deadline)) ||
            (category !== undefined && typeof category !== 'string')
        ) {
            return res.status(400).json({
                message: 'Invalid task information.'
            });
        }

        // Read existing JSON file
        let taskData;

        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            taskData = JSON.parse(data);

        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({
                    message: 'No tasks found to edit.'
                });
            }

            throw err;
        }

        // Check JSON structure
        if (!taskData || !Array.isArray(taskData.tasks)) {
            return res.status(500).json({
                message: 'Invalid tasks JSON structure.'
            });
        }

        // Find task using its string ID
        const taskIndex = taskData.tasks.findIndex(
            task => task.id === id
        );

        if (taskIndex === -1) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }

        // Update existing task
        const existingTask = taskData.tasks[taskIndex];

        taskData.tasks[taskIndex] = {
            ...existingTask,
            title: title !== undefined ? title.trim() : existingTask.title,
            description: description !== undefined ? description.trim() : existingTask.description,
            category: category !== undefined ? category : existingTask.category,
            priority: priority !== undefined ? priority : existingTask.priority,
            status: status !== undefined ? status : existingTask.status,
            deadline: deadline !== undefined ? deadline : existingTask.deadline
        };

        // Save complete JSON object
        await fs.writeFile(
            TASKS_FILE,
            JSON.stringify(taskData, null, 2),
            'utf8'
        );

        return res.status(200).json({
            success: true,
            message: 'Task updated successfully!',
            task: taskData.tasks[taskIndex]
        });

    } catch (error) {
        console.error('Update Task Error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { updateTask };
