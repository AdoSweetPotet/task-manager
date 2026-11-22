const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');
const TEMPLATE_FILE = path.join('utils', 'tasks.template.json');

async function addTask(req, res) {
    try {
        // Get task information from the request
        const { title, description, priority, deadline } = req.body;

        // Validate required fields
        if (title == "" || description == "" ||
            priority == "" || deadline == "") {
            return res.status(400).json({
                message: 'All fields are required!'
            });
        }

        // Validate priority
        if (priority != 'Low' &&
            priority != 'Medium' &&
            priority != 'High') {
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

        // Generate task ID
        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        const taskId = timestamp + "" + random.toString().padStart(3, '0');

        // Create new task
        const newTask = {
            id: taskId,
            title: title,
            description: description,
            priority: priority,
            status: 'Pending',
            deadline: deadline
        };

        let tasks = [];

        try {
            // Try reading the existing tasks.json
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);

        } catch (err) {
            if (err.code === 'ENOENT') {
                // Read template if tasks.json does not exist
                const templateData = await fs.readFile(TEMPLATE_FILE, 'utf8');
                tasks = JSON.parse(templateData);
            } else {
                throw err;
            }
        }

        // Add new task and save to file
        tasks.push(newTask);

        await fs.writeFile(
            TASKS_FILE,
            JSON.stringify(tasks, null, 2),
            'utf8'
        );

        // Return successful response
        return res.status(201).json(tasks);

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: error.message
        });
    }
}

module.exports = { addTask };