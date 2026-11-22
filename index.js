const express = require('express');
const app = express();

const { addTask } = require('./utils/AddTaskUtil');

const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/add-task', addTask);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});