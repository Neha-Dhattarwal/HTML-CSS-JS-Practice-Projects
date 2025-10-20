// A constant variable for a success message. Using const for a value that won't change.
const TASK_ADDED_MESSAGE = "✅ Task added successfully!";
const TASK_REMOVED_MESSAGE = "🗑️ Task removed!";

// Get references to the HTML elements we will interact with
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const statusMessage = document.getElementById('statusMessage');

// The main data structure: an array to store our to-do items.
// Using 'let' because we will be modifying this array (adding and removing items).
let tasks = [];

// A function to display a temporary status message to the user.
// This function helps provide feedback, like when a task is added.
function showStatus(message, duration = 2000) {
    statusMessage.textContent = message;
    // Set a timeout to clear the message after a few seconds
    setTimeout(() => {
        statusMessage.textContent = '';
    }, duration);
}

// Function to view all tasks. It clears the current list and re-renders it.
function viewTasks() {
    // Clear the current list displayed on the page to prevent duplicates
    taskList.innerHTML = '';

    // Use an if/else statement and the strict equality operator (===)
    // to check if the tasks array is empty.
    if (tasks.length === 0) {
        const emptyMessage = document.createElement('li');
        emptyMessage.textContent = "Your to-do list is empty! Add a new task above.";
        emptyMessage.classList.add('empty-list-message'); // Add a class for specific styling
        taskList.appendChild(emptyMessage);
    } else {
        // Use forEach to iterate over each item in the tasks array.
        // This is a cleaner way to loop through arrays compared to a traditional 'for' loop.
        tasks.forEach((task, index) => {
            // Create a new list item (li) for each task
            const listItem = document.createElement('li');
            
            // Add the task text to the list item
            listItem.textContent = task;
            
            // Create a button to remove the task
            const removeButton = document.createElement('button');
            removeButton.textContent = '✖';
            removeButton.classList.add('removeBtn');

            // Add an event listener to the remove button
            // When clicked, it calls the removeTask function
            removeButton.onclick = () => removeTask(index);
            
            // Append the remove button to the list item
            listItem.appendChild(removeButton);

            // Append the complete list item to the main task list (ul)
            taskList.appendChild(listItem);
        });
    }
}

// Function to add a new task to the list.
function addTask() {
    // Get the value from the input field and remove leading/trailing whitespace
    const taskName = taskInput.value.trim();

    // Use a control flow (if/else) to check if the input is not empty
    if (taskName !== '') {
        // Use the push() method to add the new task string to the end of the tasks array
        tasks.push(taskName);

        // Clear the input field after adding the task
        taskInput.value = '';

        // Update the displayed list on the screen
        viewTasks();

        // Show a success message
        showStatus(TASK_ADDED_MESSAGE);
    } else {
        // If the input is empty, show an error message
        showStatus("⚠️ Please enter a task to add.", 3000);
    }
}

// Function to remove a task from the list based on its index.
function removeTask(index) {
    // Use the splice() method to remove one item at the specified index.
    // splice() modifies the original array directly.
    tasks.splice(index, 1);
    
    // Update the displayed list on the screen
    viewTasks();

    // Show a success message
    showStatus(TASK_REMOVED_MESSAGE);
}

// Event listener for the 'Add Task' button.
// When the button is clicked, the addTask function will be executed.
addTaskBtn.addEventListener('click', addTask);

// Event listener to allow adding a task by pressing the 'Enter' key
// while the input field is focused.
taskInput.addEventListener('keypress', (event) => {
    // Check if the key pressed is the 'Enter' key
    if (event.key === 'Enter') {
        addTask();
    }
});

// Initial call to viewTasks() to display the "list is empty" message
// when the page first loads.
viewTasks();