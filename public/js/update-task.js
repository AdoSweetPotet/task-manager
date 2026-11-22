
function updateTask(id) {
    var response = "";

    // Create a JSON object from the form fields
    var jsonData = new Object();

    jsonData.title = document.getElementById("title").value.trim();
    jsonData.description = document.getElementById("description").value.trim();
    jsonData.priority = document.getElementById("priority").value;
    jsonData.status = document.getElementById("status").value;
    jsonData.deadline = document.getElementById("deadline").value;

    // Basic validation
    if (id == "" || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
        alert("Please enter a valid Task ID!");
        return;
    }

    if (jsonData.title == "" || jsonData.description == "" ||
        jsonData.priority == "" || jsonData.status == "" ||
        jsonData.deadline == "") {
        alert("All fields are required!");
        return;
    }

    // Configure the request as PUT to update the task
    var request = new XMLHttpRequest();

    request.open("PUT", "/update-task/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {
        response = JSON.parse(request.responseText);

        if (request.status === 200) {
            alert(response.message);

            // Clear form fields after successful update
            document.getElementById("updateTaskForm").reset();

        } else {
            alert(response.message || "Unable to update task!");
        }
    };

    request.onerror = function () {
        alert("Unable to connect to the server!");
    };

    // Send the JSON data to the backend
    request.send(JSON.stringify(jsonData));
}
