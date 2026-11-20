const express = require('express');
const app = express();

const { getTasks } = require('./utils/ReadTaskUtil');

const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Display the main page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Read tasks
app.get('/api/tasks', (req, res) => {
    try {
        const tasks = getTasks(req.query);

        res.status(200).json({
            success: true,
            count: tasks.length,
            tasks: tasks
        });

    } catch (error) {
        console.error(error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
