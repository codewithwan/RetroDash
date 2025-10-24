// RetroDash - 1980s Terminal Productivity Dashboard
// All data stored locally using localStorage

// ========== STATE MANAGEMENT ==========
const state = {
    todos: [],
    timer: {
        workMinutes: 25,
        breakMinutes: 5,
        currentMinutes: 25,
        currentSeconds: 0,
        isRunning: false,
        isPaused: false,
        isBreak: false,
        sessionCount: 0
    },
    weather: {
        city: '',
        data: null,
        lastFetch: null
    }
};

// ========== LOCAL STORAGE ==========
const STORAGE_KEYS = {
    TODOS: 'retrodash_todos',
    TIMER: 'retrodash_timer',
    WEATHER: 'retrodash_weather'
};

function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
    }
}

function loadFromStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        console.error('Failed to load from localStorage:', e);
        return null;
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', () => {
    loadAllData();
    initializeDateTimeClock();
    initializeTodoList();
    initializePomodoroTimer();
    initializeWeather();
    initializeKeyboardShortcuts();
    initializeHelpModal();
});

function loadAllData() {
    // Load todos
    const savedTodos = loadFromStorage(STORAGE_KEYS.TODOS);
    if (savedTodos) {
        state.todos = savedTodos;
    }
    
    // Load timer stats
    const savedTimer = loadFromStorage(STORAGE_KEYS.TIMER);
    if (savedTimer) {
        state.timer.sessionCount = savedTimer.sessionCount || 0;
    }
    
    // Load weather data
    const savedWeather = loadFromStorage(STORAGE_KEYS.WEATHER);
    if (savedWeather && savedWeather.data) {
        state.weather = savedWeather;
        // Check if data is still fresh (less than 1 hour old)
        const oneHour = 60 * 60 * 1000;
        if (Date.now() - state.weather.lastFetch < oneHour) {
            displayWeatherData(state.weather.data);
        }
    }
}

// ========== DATE AND TIME ==========
function initializeDateTimeClock() {
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

function updateDateTime() {
    const now = new Date();
    const dateString = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
    });
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
    });
    
    document.getElementById('current-date').textContent = dateString;
    document.getElementById('current-time').textContent = timeString;
}

// ========== TODO LIST MODULE ==========
function initializeTodoList() {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    
    todoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTodo();
    });
    
    renderTodoList();
    updateTodoStatus();
}

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const text = todoInput.value.trim();
    
    if (text === '') return;
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    state.todos.push(todo);
    saveTodos();
    renderTodoList();
    updateTodoStatus();
    
    todoInput.value = '';
    playBeep();
}

function toggleTodo(id) {
    const todo = state.todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        renderTodoList();
        updateTodoStatus();
        playBeep();
    }
}

function deleteTodo(id) {
    state.todos = state.todos.filter(t => t.id !== id);
    saveTodos();
    renderTodoList();
    updateTodoStatus();
    playBeep();
}

function clearCompletedTodos() {
    const hadCompleted = state.todos.some(t => t.completed);
    state.todos = state.todos.filter(t => !t.completed);
    if (hadCompleted) {
        saveTodos();
        renderTodoList();
        updateTodoStatus();
        playBeep();
    }
}

function renderTodoList() {
    const todoList = document.getElementById('todo-list');
    
    if (state.todos.length === 0) {
        todoList.innerHTML = '<li style="color: var(--terminal-dim); padding: 10px;">No tasks yet. Add one above!</li>';
        return;
    }
    
    todoList.innerHTML = state.todos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}" 
            data-id="${todo.id}"
            tabindex="0">
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <div class="todo-controls">
                <button class="todo-btn" onclick="toggleTodo(${todo.id})" title="Toggle complete">
                    ${todo.completed ? '[ ]' : '[X]'}
                </button>
                <button class="todo-btn" onclick="deleteTodo(${todo.id})" title="Delete task">
                    [D]
                </button>
            </div>
        </li>
    `).join('');
}

function updateTodoStatus() {
    const total = state.todos.length;
    const completed = state.todos.filter(t => t.completed).length;
    const statusEl = document.getElementById('todo-status');
    statusEl.textContent = `${completed}/${total}`;
}

function saveTodos() {
    saveToStorage(STORAGE_KEYS.TODOS, state.todos);
}

// ========== POMODORO TIMER MODULE ==========
let timerInterval = null;

function initializePomodoroTimer() {
    document.getElementById('timer-start').addEventListener('click', startTimer);
    document.getElementById('timer-pause').addEventListener('click', pauseTimer);
    document.getElementById('timer-reset').addEventListener('click', resetTimer);
    
    updateTimerDisplay();
    updateSessionCount();
}

function startTimer() {
    if (state.timer.isRunning) return;
    
    state.timer.isRunning = true;
    state.timer.isPaused = false;
    
    document.getElementById('timer-start').disabled = true;
    document.getElementById('timer-pause').disabled = false;
    document.getElementById('pomodoro-status').textContent = 'RUNNING';
    document.getElementById('pomodoro-status').className = 'module-status status-active';
    
    timerInterval = setInterval(tick, 1000);
    playBeep();
}

function pauseTimer() {
    if (!state.timer.isRunning) return;
    
    state.timer.isRunning = false;
    state.timer.isPaused = true;
    
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;
    document.getElementById('pomodoro-status').textContent = 'PAUSED';
    document.getElementById('pomodoro-status').className = 'module-status status-paused';
    
    clearInterval(timerInterval);
    playBeep();
}

function resetTimer() {
    state.timer.isRunning = false;
    state.timer.isPaused = false;
    state.timer.currentMinutes = state.timer.isBreak ? state.timer.breakMinutes : state.timer.workMinutes;
    state.timer.currentSeconds = 0;
    
    document.getElementById('timer-start').disabled = false;
    document.getElementById('timer-pause').disabled = true;
    document.getElementById('pomodoro-status').textContent = 'READY';
    document.getElementById('pomodoro-status').className = 'module-status';
    
    clearInterval(timerInterval);
    updateTimerDisplay();
    playBeep();
}

function tick() {
    if (state.timer.currentSeconds === 0) {
        if (state.timer.currentMinutes === 0) {
            timerComplete();
            return;
        }
        state.timer.currentMinutes--;
        state.timer.currentSeconds = 59;
    } else {
        state.timer.currentSeconds--;
    }
    
    updateTimerDisplay();
}

function timerComplete() {
    clearInterval(timerInterval);
    state.timer.isRunning = false;
    
    if (!state.timer.isBreak) {
        // Work session completed
        state.timer.sessionCount++;
        updateSessionCount();
        saveTimerData();
        
        // Switch to break
        state.timer.isBreak = true;
        state.timer.currentMinutes = state.timer.breakMinutes;
        state.timer.currentSeconds = 0;
        document.getElementById('timer-label').textContent = 'BREAK TIME';
        document.getElementById('pomodoro-status').textContent = 'COMPLETE';
    } else {
        // Break completed
        state.timer.isBreak = false;
        state.timer.currentMinutes = state.timer.workMinutes;
        state.timer.currentSeconds = 0;
        document.getElementById('timer-label').textContent = 'WORK SESSION';
        document.getElementById('pomodoro-status').textContent = 'READY';
    }
    
    updateTimerDisplay();
    playCompletionBeep();
}

function updateTimerDisplay() {
    const minutes = String(state.timer.currentMinutes).padStart(2, '0');
    const seconds = String(state.timer.currentSeconds).padStart(2, '0');
    document.getElementById('timer-time').textContent = `${minutes}:${seconds}`;
}

function updateSessionCount() {
    document.getElementById('session-count').textContent = state.timer.sessionCount;
}

function saveTimerData() {
    saveToStorage(STORAGE_KEYS.TIMER, {
        sessionCount: state.timer.sessionCount
    });
}

// ========== WEATHER MODULE ==========
function initializeWeather() {
    const weatherForm = document.getElementById('weather-form');
    
    weatherForm.addEventListener('submit', (e) => {
        e.preventDefault();
        fetchWeather();
    });
}

async function fetchWeather() {
    const weatherInput = document.getElementById('weather-input');
    const city = weatherInput.value.trim();
    
    if (city === '') return;
    
    const statusEl = document.getElementById('weather-status');
    statusEl.textContent = 'LOADING...';
    statusEl.className = 'module-status loading';
    
    // Mock weather data for offline mode (OpenWeather API requires key)
    // In production, replace with actual API call
    const mockWeatherData = generateMockWeatherData(city);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    state.weather.city = city;
    state.weather.data = mockWeatherData;
    state.weather.lastFetch = Date.now();
    
    saveToStorage(STORAGE_KEYS.WEATHER, state.weather);
    displayWeatherData(mockWeatherData);
    
    statusEl.textContent = 'CACHED';
    statusEl.className = 'module-status';
    
    weatherInput.value = '';
    playBeep();
}

function generateMockWeatherData(city) {
    // Generate mock data for offline mode
    const temp = Math.floor(Math.random() * 30) + 10; // 10-40°C
    const conditions = ['Clear', 'Cloudy', 'Rainy', 'Sunny', 'Partly Cloudy'];
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    
    return {
        city: city,
        temp: temp,
        feels_like: temp + Math.floor(Math.random() * 5) - 2,
        condition: condition,
        humidity: Math.floor(Math.random() * 40) + 40,
        wind_speed: Math.floor(Math.random() * 20) + 5,
        timestamp: new Date().toLocaleString()
    };
}

function displayWeatherData(data) {
    const weatherDisplay = document.getElementById('weather-display');
    
    weatherDisplay.innerHTML = `
        <div>
            <p style="font-size: 28px; letter-spacing: 2px;">${escapeHtml(data.city.toUpperCase())}</p>
            <div class="weather-temp">${data.temp}°C</div>
            <p>Condition: ${data.condition}</p>
        </div>
        <div class="weather-details">
            <div class="weather-detail">
                <span>Feels Like:</span>
                <span>${data.feels_like}°C</span>
            </div>
            <div class="weather-detail">
                <span>Humidity:</span>
                <span>${data.humidity}%</span>
            </div>
            <div class="weather-detail">
                <span>Wind Speed:</span>
                <span>${data.wind_speed} km/h</span>
            </div>
            <div class="weather-detail">
                <span>Updated:</span>
                <span>${data.timestamp}</span>
            </div>
        </div>
        <p class="weather-note" style="margin-top: 15px;">Note: Mock data for offline mode</p>
    `;
}

// ========== KEYBOARD SHORTCUTS ==========
function initializeKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ignore shortcuts when typing in input fields
        if (e.target.tagName === 'INPUT' && e.key !== 'Escape') {
            return;
        }
        
        // Help modal
        if (e.key === '?') {
            e.preventDefault();
            toggleHelpModal();
            return;
        }
        
        // Close modal with Escape
        if (e.key === 'Escape') {
            e.preventDefault();
            const modal = document.getElementById('help-modal');
            if (!modal.classList.contains('hidden')) {
                toggleHelpModal();
            } else {
                // Clear focus from any element
                document.activeElement.blur();
            }
            return;
        }
        
        // Module focus shortcuts (1, 2, 3)
        if (['1', '2', '3'].includes(e.key) && !e.ctrlKey) {
            e.preventDefault();
            focusModule(e.key);
            return;
        }
        
        // Timer controls
        if (e.key.toLowerCase() === 's' && !e.ctrlKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            startTimer();
            return;
        }
        
        if (e.key.toLowerCase() === 'p' && !e.ctrlKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            pauseTimer();
            return;
        }
        
        if (e.key.toLowerCase() === 'r' && !e.ctrlKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            resetTimer();
            return;
        }
        
        // Clear completed todos
        if (e.key.toLowerCase() === 'c' && !e.ctrlKey && e.target.tagName !== 'INPUT') {
            e.preventDefault();
            clearCompletedTodos();
            return;
        }
        
        // Clear all data (Ctrl+K)
        if (e.key.toLowerCase() === 'k' && e.ctrlKey) {
            e.preventDefault();
            if (confirm('Clear all data? This cannot be undone.')) {
                clearAllData();
            }
            return;
        }
    });
}

function focusModule(number) {
    const modules = {
        '1': 'todo-input',
        '2': 'timer-start',
        '3': 'weather-input'
    };
    
    const elementId = modules[number];
    const element = document.getElementById(elementId);
    
    if (element) {
        element.focus();
        playBeep();
    }
}

function clearAllData() {
    localStorage.clear();
    state.todos = [];
    state.timer.sessionCount = 0;
    state.weather = { city: '', data: null, lastFetch: null };
    
    renderTodoList();
    updateTodoStatus();
    updateSessionCount();
    resetTimer();
    
    document.getElementById('weather-display').innerHTML = `
        <p>Enter city name to get weather data</p>
        <p class="weather-note">Note: Uses OpenWeather API</p>
    `;
    document.getElementById('weather-status').textContent = 'OFFLINE';
    
    playBeep();
}

// ========== HELP MODAL ==========
function initializeHelpModal() {
    const modal = document.getElementById('help-modal');
    
    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            toggleHelpModal();
        }
    });
}

function toggleHelpModal() {
    const modal = document.getElementById('help-modal');
    modal.classList.toggle('hidden');
    playBeep();
}

// ========== SOUND EFFECTS ==========
function playBeep() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Audio not supported or blocked
    }
}

function playCompletionBeep() {
    // Play a completion sound sequence
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        const frequencies = [600, 800, 1000];
        frequencies.forEach((freq, index) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'square';
            
            const startTime = audioContext.currentTime + (index * 0.15);
            gainNode.gain.setValueAtTime(0.1, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.1);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.1);
        });
    } catch (e) {
        // Audio not supported or blocked
    }
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Make functions globally accessible for inline event handlers
window.toggleTodo = toggleTodo;
window.deleteTodo = deleteTodo;
window.clearCompletedTodos = clearCompletedTodos;
