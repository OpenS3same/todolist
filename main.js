
let tasks = [];

function addTask() {
    const taskInput = document.getElementById("task");
    const contentInput = document.getElementById("content");
    const dueDateInput = document.getElementById("dueDate");
    const priorityInput = document.querySelector('input[name="priority"]:checked');

    if (taskInput.value.trim() !== "") {
        const task = {
            id: Date.now(),
            title: taskInput.value.trim(),
            memo: contentInput.value.trim(),
            dueDate: dueDateInput.value,
            priority: priorityInput.value,
            status: "unfinished"
        };

        tasks.push(task);
        taskInput.value = "";
        contentInput.value = "";
        dueDateInput.value = "";
        displayTasks();
    }
}

function displayTasks(filter = "all") {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (filter === "all") return true;
        return task.status === filter;
    });

    updatePriorityCounts();

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const taskTitle = document.createElement("div");
        taskTitle.className = "task-title";
        taskTitle.innerText = task.title;

        const taskMemo = document.createElement("div");
        taskMemo.className = "task-memo";
        taskMemo.innerText = task.memo;

        const taskDate = document.createElement("div");
        taskDate.className = "task-date";
        taskDate.innerText = task.dueDate;

        const taskPriority = document.createElement("div");
        taskPriority.className = `task-priority ${task.priority}`;

        const taskStatus = document.createElement("div");
        taskStatus.className = "task-status";
        taskStatus.innerHTML = `<span class="${task.status}">${task.status.replace("-", " ")}</span>`;

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";
        taskActions.innerHTML = `
            <button onclick="deleteTask(${task.id})"><span class="material-symbols-outlined">delete</span></button>
            <button onclick="toggleStatus(${task.id})"><span class="material-symbols-outlined">${task.status === "completed" ? "undo" : task.status === "in-progress" ? "done" : "hourglass_empty"}</span></button>
             <button onclick="openEditModal(${task.id})"><span class="material-symbols-outlined">edit</span></button>
        `;

        taskItem.appendChild(taskPriority);
        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskMemo);
        taskItem.appendChild(taskDate);
        taskItem.appendChild(taskStatus);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
    });
}

function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    displayTasks();
}

function toggleStatus(id) {
    tasks = tasks.map(task => {
        if (task.id === id) {
            if (task.status === "completed") {
                task.status = "unfinished";
            } else if (task.status === "unfinished") {
                task.status = "in-progress";
            } else {
                task.status = "completed";
            }
        }
        return task;
    });
    displayTasks();
}

function filterTasks(status) {
    displayTasks(status);
}

function updatePriorityCounts() {
    const lowCount = tasks.filter(task => task.priority === "low").length;
    const mediumCount = tasks.filter(task => task.priority === "medium").length;
    const highCount = tasks.filter(task => task.priority === "high").length;

    document.getElementById("low-count").innerText = lowCount;
    document.getElementById("medium-count").innerText = mediumCount;
    document.getElementById("high-count").innerText = highCount;
}

displayTasks();


function filterByPriority(priority) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    const filteredTasks = tasks
        .filter(task => task.priority === priority)  // 선택된 우선순위로 필터링
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)); // 날짜 순으로 정렬 (옵션)

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        const taskTitle = document.createElement("div");
        taskTitle.className = "task-title";
        taskTitle.innerText = task.title;

        const taskMemo = document.createElement("div");
        taskMemo.className = "task-memo";
        taskMemo.innerText = task.memo;

        const taskDate = document.createElement("div");
        taskDate.className = "task-date";
        taskDate.innerText = task.dueDate;

        const taskPriority = document.createElement("div");
        taskPriority.className = `task-priority ${task.priority}`;

        const taskStatus = document.createElement("div");
        taskStatus.className = "task-status";
        taskStatus.innerHTML = `<span class="${task.status}">${task.status.replace("-", " ")}</span>`;

        const taskActions = document.createElement("div");
        taskActions.className = "task-actions";
        taskActions.innerHTML = `
            <button onclick="deleteTask(${task.id})"><span class="material-symbols-outlined">delete</span></button>
            <button onclick="toggleStatus(${task.id})"><span class="material-symbols-outlined">${task.status === "completed" ? "undo" : task.status === "in-progress" ? "done" : "hourglass_empty"}</span></button>
            <button onclick="openEditModal(${task.id})"><span class="material-symbols-outlined">edit</span></button>
        `;

        taskItem.appendChild(taskPriority);
        taskItem.appendChild(taskTitle);
        taskItem.appendChild(taskMemo);
        taskItem.appendChild(taskDate);
        taskItem.appendChild(taskStatus);
        taskItem.appendChild(taskActions);

        taskList.appendChild(taskItem);
    });
}

// 초기 상태를 표시하는 기존의 displayTasks 함수 호출
displayTasks();




function updateTime() {
    // 페이지가 로드될 때 즉시 현재 시간을 설정
    document.querySelector(".current-date").innerText = new Date().toLocaleString([], {
        year: "numeric",
        month: "long",
        day: "numeric", 
        hour: '2-digit', 
        minute: '2-digit'
    });

    // 이후 10초마다 시간을 업데이트
    setInterval(() => {
        document.querySelector(".current-date").innerText = new Date().toLocaleString([], {
            year: "numeric",
            month: "long",
            day: "numeric", 
            hour: '2-digit', 
            minute: '2-digit'
        });
    }, 10000);
}

updateTime();


let editTaskId = null; // 수정할 할 일의 ID를 저장

// 모달 창을 열고 선택된 할 일의 데이터를 입력 필드에 넣음
function openEditModal(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        document.getElementById("edit-task").value = task.title;
        document.getElementById("edit-content").value = task.memo;
        document.getElementById("edit-dueDate").value = task.dueDate;
        document.querySelector(`input[name="edit-priority"][value="${task.priority}"]`).checked = true;
        document.getElementById("editModal").style.display = "block";
        editTaskId = id;
    }
}

// 모달 창을 닫음
function closeModal() {
    document.getElementById("editModal").style.display = "none";
}

// 할 일 수정 내용을 저장
function saveEdit() {
    const task = tasks.find(task => task.id === editTaskId);
    if (task) {
        task.title = document.getElementById("edit-task").value;
        task.memo = document.getElementById("edit-content").value;
        task.dueDate = document.getElementById("edit-dueDate").value;
        task.priority = document.querySelector('input[name="edit-priority"]:checked').value;
        displayTasks();
        closeModal();
    }
}

// 모달 창 외부를 클릭하면 모달 창이 닫히도록 설정
window.onclick = function(event) {
    const modal = document.getElementById("editModal");
    if (event.target === modal) {
        closeModal();
    }
}

// 초기화 시, 닫기 버튼 이벤트 추가
document.querySelector(".close-button").onclick = closeModal;

