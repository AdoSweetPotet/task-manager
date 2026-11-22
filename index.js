
const express = require('express');
const app = express();

const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Import task functions
const { updateTask } = require('./utils/UpdateTaskUtil');
const { deleteTask } = require('./utils/DeleteTaskUtil');

// Update Task route
app.put('/update-task/:id', updateTask);

// Delete Task route
app.delete('/delete-task/:id', deleteTask);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
