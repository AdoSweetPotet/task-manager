
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');

async function deleteTask(req, res) {
    try {
        const { id } = req.params;

        // Read tasks from JSON file
        let taskData;

        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            taskData = JSON.parse(data);

        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({
                    message: 'No tasks found to delete.'
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

        // Check whether task exists
        if (taskIndex === -1) {
            return res.status(404).json({
                message: 'Task not found.'
            });
        }

        // Remove the selected task
        taskData.tasks.splice(taskIndex, 1);

        // Save the complete JSON object
        await fs.writeFile(
            TASKS_FILE,
            JSON.stringify(taskData, null, 2),
            'utf8'
        );

        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully!',
            deletedId: id
        });

    } catch (error) {
        console.error('Delete Task Error:', error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { deleteTask };
