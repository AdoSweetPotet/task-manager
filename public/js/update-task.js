
function updateTask(id) {

    // Get task information from the form
    var jsonData = {};

    jsonData.title = document.getElementById("updateTitle").value.trim();
    jsonData.description = document.getElementById("updateDescription").value.trim();
    jsonData.priority = document.getElementById("updatePriority").value;
    jsonData.status = document.getElementById("updateStatus").value;
    jsonData.deadline = document.getElementById("updateDeadline").value;

    // Validate Task ID
    if (id.trim() === "") {
        alert("Please enter a valid Task ID!");
        return;
    }

    // Validate required fields
    if (
        jsonData.title === "" ||
        jsonData.description === "" ||
        jsonData.priority === "" ||
        jsonData.status === "" ||
        jsonData.deadline === ""
    ) {
        alert("All fields are required!");
        return;
    }

    // Validate priority
    if (
        jsonData.priority !== "Low" &&
        jsonData.priority !== "Medium" &&
        jsonData.priority !== "High"
    ) {
        alert("Please select a valid priority!");
        return;
    }

    // Validate status
    if (
        jsonData.status !== "Pending" &&
        jsonData.status !== "In Progress" &&
        jsonData.status !== "Completed"
    ) {
        alert("Please select a valid status!");
        return;
    }

    // Validate deadline
    var datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!datePattern.test(jsonData.deadline)) {
        alert("Please enter a valid deadline!");
        return;
    }

    // Send PUT request
    var request = new XMLHttpRequest();

    request.open("PUT", "/update-task/" + encodeURIComponent(id.trim()), true);

    request.setRequestHeader("Content-Type", "application/json");

    request.onload = function () {

        var response;

        try {
            response = JSON.parse(request.responseText);
        } catch (error) {
            alert("Invalid server response!");
            return;
        }

        if (request.status === 200) {

            alert(response.message || "Task updated successfully!");

            // Clear form fields
            document.getElementById("updateTaskForm").reset();

            // Refresh task list
            if (typeof loadTasks === "function") {
                loadTasks();
            }

        } else {
            alert(response.message || "Unable to update task!");
        }
    };

    request.onerror = function () {
        alert("Unable to connect to the server!");
    };

    request.send(JSON.stringify(jsonData));
}
