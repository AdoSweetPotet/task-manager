function deleteTask(id) {
    // Validate Task ID
    if (id == "" || isNaN(id) || Number(id) <= 0 || !Number.isInteger(Number(id))) {
        alert("Please enter a valid Task ID!");
        return;
    }

    // Ask for confirmation
    if (!confirm("Are you sure you want to delete this task?")) {
        return;
    }

    var request = new XMLHttpRequest();

    request.open("DELETE", "/delete-task/" + id, true);

    request.onload = function () {
        var response = JSON.parse(request.responseText);

        if (request.status === 200) {
            alert(response.message);

            // Clear form after successful deletion
            document.getElementById("deleteTaskForm").reset();

        } else {
            alert(response.message || "Unable to delete task!");
        }
    };

    request.onerror = function () {
        alert("Unable to connect to the server!");
    };

    request.send();
}