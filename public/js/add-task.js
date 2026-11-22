// Open Add Task popup
function openTaskForm() {
    document.getElementById("taskModal").style.display = "block";
}

// Close Add Task popup
function closeTaskForm() {
    document.getElementById("taskModal").style.display = "none";
}


function addTask() {
    var response = "";

    // Create an object to hold task information
    var jsonData = new Object();

    jsonData.title = document.getElementById("title").value;
    jsonData.description = document.getElementById("description").value;
    jsonData.priority = document.getElementById("priority").value;
    jsonData.deadline = document.getElementById("deadline").value;

    // Validate required fields
    if (jsonData.title == "" ||
        jsonData.description == "" ||
        jsonData.priority == "" ||
        jsonData.deadline == "") {

        alert('All fields are required!');
        return;
    }

    // Validate priority
    if (jsonData.priority != "Low" &&
        jsonData.priority != "Medium" &&
        jsonData.priority != "High") {

        alert('Please select a valid priority!');
        return;
    }

    // Validate deadline format
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(jsonData.deadline)) {
        alert('Please enter a valid deadline!');
        return;
    }

    // Configure the request to POST data to /add-task
    var request = new XMLHttpRequest();

    request.open("POST", "/add-task", true);
    request.setRequestHeader('Content-Type', 'application/json');

    // Define what happens when the server responds
    request.onload = function () {
        response = JSON.parse(request.responseText);

        console.log(response);

        // Check whether the task was successfully added
        if (response.message == undefined) {
            alert('Added Task: ' + jsonData.title + '!');

            // Clear form fields
            document.getElementById("title").value = "";
            document.getElementById("description").value = "";
            document.getElementById("priority").value = "";
            document.getElementById("deadline").value = "";

            // Close popup
            closeTaskForm();

        } else {
            alert(response.message);
        }
    };

    // Send the request with JSON-formatted data
    request.send(JSON.stringify(jsonData));
}