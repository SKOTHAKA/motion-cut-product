document.addEventListener('DOMContentLoaded', loadTasks);

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

addTaskBtn.addEventListener('click', addTask);

function addTask() {
    const taskText = taskInput.value;
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    addTaskToDOM(task);
    saveTaskToLocalStorage(task);

    taskInput.value = '';
}

function addTaskToDOM(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.dataset.id = task.id;

    const taskText = document.createElement('span');
    taskText.textContent = task.text;
    if (task.completed) {
        li.classList.add('completed');
    }
    taskText.addEventListener('click', toggleTaskCompletion);

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', editTask);

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', deleteTask);

    li.appendChild(taskText);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

function toggleTaskCompletion(e) {
    const taskId = e.target.parentElement.dataset.id;
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => {
        if (task.id == taskId) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasksToLocalStorage(tasks);
    e.target.parentElement.classList.toggle('completed');
}

function editTask(e) {
    const taskId = e.target.parentElement.dataset.id;
    const taskText = e.target.parentElement.querySelector('span').textContent;
    const newTaskText = prompt('Edit task:', taskText);
    if (newTaskText === null || newTaskText === '') return;

    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => {
        if (task.id == taskId) {
            task.text = newTaskText;
        }
        return task;
    });

    saveTasksToLocalStorage(tasks);
    e.target.parentElement.querySelector('span').textContent = newTaskText;
}

function deleteTask(e) {
    const taskId = e.target.parentElement.dataset.id;
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id != taskId);

    saveTasksToLocalStorage(tasks);
    e.target.parentElement.remove();
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    saveTasksToLocalStorage(tasks);
}

function getTasksFromLocalStorage() {
    return localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];
}

function saveTasksToLocalStorage(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => addTaskToDOM(task));
}
