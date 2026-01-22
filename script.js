// 待办事项应用 JavaScript

// DOM元素
const taskInput = document.getElementById('taskInput');
const prioritySelect = document.getElementById('prioritySelect');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const clearAllBtn = document.getElementById('clearAllBtn');
const emptyState = document.getElementById('emptyState');

// 任务数据
let tasks = [];

// 初始化应用
function init() {
    // 从本地存储加载任务
    loadTasks();
    // 渲染任务列表
    renderTasks();
    // 更新统计信息
    updateStats();
    // 添加事件监听器
    addEventListeners();
}

// 添加事件监听器
function addEventListeners() {
    // 添加任务按钮点击事件
    addTaskBtn.addEventListener('click', addTask);
    
    // 输入框回车事件
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    
    // 清空已完成按钮点击事件
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // 全部清空按钮点击事件
    clearAllBtn.addEventListener('click', clearAllTasks);
}

// 添加任务
function addTask() {
    const taskText = taskInput.value.trim();
    const priority = prioritySelect.value;
    
    if (taskText === '') {
        alert('请输入任务内容！');
        return;
    }
    
    // 创建新任务对象
    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: priority,
        createdAt: new Date().toLocaleString()
    };
    
    // 添加到任务数组
    tasks.push(newTask);
    
    // 保存到本地存储
    saveTasks();
    
    // 渲染任务列表
    renderTasks();
    
    // 更新统计信息
    updateStats();
    
    // 清空输入框和重置优先级
    taskInput.value = '';
    prioritySelect.value = 'medium';
}

// 渲染任务列表
function renderTasks() {
    // 显示/隐藏空状态
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyState.style.display = 'none';
        taskList.style.display = 'flex';
    }
    
    // 清空任务列表
    taskList.innerHTML = '';
    
    // 遍历任务数组，创建DOM元素
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = `task-item ${task.priority}`;
        
        // 创建复选框
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(task.id));
        
        // 创建任务内容容器
        const taskContent = document.createElement('div');
        taskContent.className = 'task-content';
        
        // 创建任务文本
        const taskText = document.createElement('span');
        taskText.className = `task-text ${task.completed ? 'completed' : ''}`;
        taskText.textContent = task.text;
        taskText.setAttribute('contenteditable', 'false');
        
        // 创建任务元信息
        const taskMeta = document.createElement('div');
        taskMeta.className = 'task-meta';
        
        // 创建优先级标签
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `priority-badge ${task.priority}`;
        priorityBadge.textContent = task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低';
        
        // 创建创建时间
        const createdAt = document.createElement('span');
        createdAt.textContent = task.createdAt;
        
        // 组装元信息
        taskMeta.appendChild(priorityBadge);
        taskMeta.appendChild(createdAt);
        
        // 组装任务内容
        taskContent.appendChild(taskText);
        taskContent.appendChild(taskMeta);
        
        // 创建操作按钮容器
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
        
        // 创建编辑按钮
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = '编辑';
        editBtn.addEventListener('click', () => toggleEditMode(task.id, taskText));
        
        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        // 组装操作按钮
        taskActions.appendChild(editBtn);
        taskActions.appendChild(deleteBtn);
        
        // 组装任务项
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskContent);
        taskItem.appendChild(taskActions);
        
        // 添加到任务列表
        taskList.appendChild(taskItem);
    });
}

// 切换任务完成状态
function toggleTask(id) {
    // 查找并更新任务状态
    tasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    // 保存到本地存储
    saveTasks();
    
    // 渲染任务列表
    renderTasks();
    
    // 更新统计信息
    updateStats();
}

// 删除任务
function deleteTask(id) {
    // 从数组中删除任务
    tasks = tasks.filter(task => task.id !== id);
    
    // 保存到本地存储
    saveTasks();
    
    // 渲染任务列表
    renderTasks();
    
    // 更新统计信息
    updateStats();
}

// 切换编辑模式
function toggleEditMode(id, taskTextElement) {
    const task = tasks.find(task => task.id === id);
    
    if (taskTextElement.isContentEditable) {
        // 保存编辑
        const newText = taskTextElement.textContent.trim();
        if (newText === '') {
            alert('任务内容不能为空！');
            taskTextElement.textContent = task.text;
        } else {
            task.text = newText;
            saveTasks();
        }
        
        // 退出编辑模式
        taskTextElement.setAttribute('contenteditable', 'false');
        taskTextElement.classList.remove('edit-mode');
    } else {
        // 进入编辑模式
        taskTextElement.setAttribute('contenteditable', 'true');
        taskTextElement.classList.add('edit-mode');
        taskTextElement.focus();
        
        // 选中所有文本
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(taskTextElement);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

// 清空已完成任务
function clearCompletedTasks() {
    // 过滤掉已完成的任务
    tasks = tasks.filter(task => !task.completed);
    
    // 保存到本地存储
    saveTasks();
    
    // 渲染任务列表
    renderTasks();
    
    // 更新统计信息
    updateStats();
}

// 全部清空任务
function clearAllTasks() {
    if (tasks.length === 0) {
        alert('任务列表已经是空的！');
        return;
    }
    
    if (confirm('确定要清空所有任务吗？此操作不可恢复！')) {
        // 清空任务数组
        tasks = [];
        
        // 保存到本地存储
        saveTasks();
        
        // 渲染任务列表
        renderTasks();
        
        // 更新统计信息
        updateStats();
    }
}

// 更新统计信息
function updateStats() {
    // 计算未完成任务数量
    const pending = tasks.filter(task => !task.completed).length;
    // 计算已完成任务数量
    const completed = tasks.filter(task => task.completed).length;
    
    // 更新DOM显示
    pendingCount.textContent = `未完成: ${pending}`;
    completedCount.textContent = `已完成: ${completed}`;
}

// 保存任务到本地存储
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// 从本地存储加载任务
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', init);