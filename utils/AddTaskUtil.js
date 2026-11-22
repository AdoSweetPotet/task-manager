
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');
const TEMPLATE_FILE = path.join('utils', 'tasks.template.json');

async function addTask(req, res) {
    try {
        // Get task information from request
        const { title, description, category, priority, deadline } = req.body;

        // Validate required fields
        if (
            !title || !title.trim() ||
            !description || !description.trim() ||
            !priority ||
            !deadline
        ) {
            return res.status(400).json({
                message: 'All fields are required!'
            });
        }

        // Validate priority
        if (!['Low', 'Medium', 'High'].includes(priority)) {
            return res.status(400).json({
                message: 'Invalid priority!'
            });
        }

        // Validate deadline format
        const datePattern = /^\d{4}-\d{2}-\d{2}$/;

        if (!datePattern.test(deadline)) {
            return res.status(400).json({
                message: 'Invalid deadline format!'
            });
        }

        // Read existing JSON data
        let taskData;

        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            taskData = JSON.parse(data);

        } catch (err) {
            if (err.code === 'ENOENT') {
                const templateData = await fs.readFile(
                    TEMPLATE_FILE,
                    'utf8'
                );

                taskData = JSON.parse(templateData);
            } else {
                throw err;
            }
        }

        // Check JSON structure
        if (!taskData || !Array.isArray(taskData.tasks)) {
            return res.status(500).json({
                message: 'Invalid tasks JSON structure!'
            });
        }

        // Generate the next Task ID
        const highestId = taskData.tasks.reduce((max, task) => {
            const match = String(task.id).match(/^Task(\d+)$/);

            if (match) {
                return Math.max(max, Number(match[1]));
            }

            return max;
        }, 0);

        const taskId = 'Task' + String(highestId + 1).padStart(3, '0');

        // Create new task
        const newTask = {
            id: taskId,
            title: title.trim(),
            description: description.trim(),
            category: category || '',
            priority: priority,
            status: 'Pending',
            deadline: deadline
        };

        // Add task to the existing tasks array
        taskData.tasks.push(newTask);

        // Save the complete JSON object
        await fs.writeFile(
            TASKS_FILE,
            JSON.stringify(taskData, null, 2),
            'utf8'
        );

        // Return successful response
        return res.status(201).json(taskData);

    } catch (error) {
        console.error('Add Task Error:', error);

        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { addTask };
