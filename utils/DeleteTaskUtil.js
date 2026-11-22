
const fs = require('fs').promises;
const path = require('path');

const TASKS_FILE = path.join('utils', 'tasks.json');

async function deleteTask(req, res) {
    try {
        const { id } = req.params;

        let tasks = [];

        try {
            const data = await fs.readFile(TASKS_FILE, 'utf8');
            tasks = JSON.parse(data);
        } catch (err) {
            if (err.code === 'ENOENT') {
                return res.status(404).json({ message: 'No tasks found to delete.' });
            } else {
                throw err;
            }
        }

        const taskIndex = tasks.findIndex(t => t.id == id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found.' });
        }

        tasks.splice(taskIndex, 1);

        await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2), 'utf8');

        return res.status(200).json({
            message: 'Task deleted successfully!'
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { deleteTask };
