
function deleteTask(id) {

    // Validate Task ID
    id = id.trim();

    if (!/^Task\d+$/.test(id)) {
        alert("Please enter a valid Task ID (e.g. Task001)!");
        return;
    }

    // Ask for confirmation
    if (!confirm("Are you sure you want to delete " + id + "?")) {
        return;
    }

    var request = new XMLHttpRequest();

    // Send DELETE request
    request.open(
        "DELETE",
        "/delete-task/" + encodeURIComponent(id),
        true
    );

    request.onload = function () {

        var response;

        try {
            response = JSON.parse(request.responseText);
        } catch (error) {
            alert("Invalid server response!");
            return;
        }

        if (request.status === 200) {

            alert(response.message || "Task deleted successfully!");

            // Clear form after successful deletion
            document.getElementById("deleteTaskForm").reset();

            // Refresh task list
            if (typeof loadTasks === "function") {
                loadTasks();
            }

        } else {
            alert(response.message || "Unable to delete task!");
        }
    };

    request.onerror = function () {
        alert("Unable to connect to the server!");
    };

    request.send();
}
