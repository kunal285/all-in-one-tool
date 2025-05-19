// Manage Tool Switching and button active states
const tools = document.querySelectorAll('.tool');
const buttons = document.querySelectorAll('.nav-button');

function switchTool(toolId) {
  tools.forEach(t => {
    t.classList.toggle('active', t.id === toolId);
    if (t.id === toolId) t.focus();
  });
  buttons.forEach(btn => {
    const pressed = btn.getAttribute('aria-controls') === toolId;
    btn.classList.toggle('active', pressed);
    btn.setAttribute('aria-pressed', pressed);
  });
}

// ------------------ To-Do List --------------------
const todoInput = document.getElementById('todo-task-input');
const todoList = document.getElementById('todo-task-list');

function loadTodos() {
  const saved = localStorage.getItem('todos') || '[]';
  return JSON.parse(saved);
}
function saveTodos(todos) {
  localStorage.setItem('todos', JSON.stringify(todos));
}
function renderTodos() {
  const todos = loadTodos();
  todoList.innerHTML = '';
  todos.forEach((task, index) => {
    const li = document.createElement('li');
    li.textContent = task.text;
    li.className = task.done ? 'done' : '';
    li.addEventListener('click', () => {
      toggleDone(index);
    });
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.className = 'delete-task';
    delBtn.setAttribute('aria-label', `Delete task: ${task.text}`);
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(index);
    });
    li.appendChild(delBtn);
    todoList.appendChild(li);
  });
}
function addTask() {
  const val = todoInput.value.trim();
  if (!val) return;
  let todos = loadTodos();
  todos.push({ text: val, done: false });
  saveTodos(todos);
  todoInput.value = '';
  renderTodos();
}
function toggleDone(i) {
  let todos = loadTodos();
  todos[i].done = !todos[i].done;
  saveTodos(todos);
  renderTodos();
}
function deleteTask(i) {
  let todos = loadTodos();
  todos.splice(i, 1);
  saveTodos(todos);
  renderTodos();
}

// Render tasks initially
renderTodos();

// Add task on Enter
todoInput.addEventListener('keyup', e => {
  if (e.key === 'Enter') addTask();
});

// ------------------ Calculator -------------------
const calcDisplay = document.getElementById('calc-display');
const calcKeys = document.getElementById('calc-keys');
let calcBuffer = '0';
let calcResetNext = false;

function updateCalcDisplay() {
  calcDisplay.value = calcBuffer;
}

function calculateExpression(expr) {
  try {
    // Prevent code injection: allow only numbers and operators
    if (/^[0-9+\-*/.() ]+$/.test(expr)) {
      // eslint-disable-next-line no-eval
      let result = eval(expr);
      if (result === undefined) return '0';
      return String(result);
    }
    return 'Error';
  } catch {
    return 'Error';
  }
}

calcKeys.addEventListener('click', e => {
  if (!e.target.matches('button')) return;
  const key = e.target.dataset.key;
  if (!key) return;
  if (key === 'C') {
    calcBuffer = '0';
    calcResetNext = false;
  } else if (key === '=') {
    calcBuffer = calculateExpression(calcBuffer);
    calcResetNext = true;
  } else {
    if (calcResetNext) {
      if ('+-*/'.includes(key)) {
        calcBuffer += key;
      } else {
        calcBuffer = key;
      }
      calcResetNext = false;
    } else {
      if (calcBuffer === '0' && !['+', '-', '*', '/', '.'].includes(key)) {
        calcBuffer = key;
      } else {
        calcBuffer += key;
      }
    }
  }
  updateCalcDisplay();
});
updateCalcDisplay();

// ------------ Digital Clock & Timer --------------
const clockEl = document.getElementById('digital-clock');
function updateClock() {
  const now = new Date();
  clockEl.textContent = now.toLocaleTimeString();
}
setInterval(updateClock, 1000);
updateClock();

// Timer variables
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const startTimerBtn = document.getElementById('start-timer-btn');
const pauseTimerBtn = document.getElementById('pause-timer-btn');
const resetTimerBtn = document.getElementById('reset-timer-btn');
const timerStatus = document.getElementById('timer-status');

let timerInterval = null;
let timerRemaining = 0;

function formatTimerDisplay(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `Timer: ${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
}

function startTimer() {
  let mins = parseInt(timerMinutesInput.value) || 0;
  let secs = parseInt(timerSecondsInput.value) || 0;
  timerRemaining = mins * 60 + secs;
  if (timerRemaining <= 0) {
    alert('Please enter a positive time.');
    return;
  }
  startTimerBtn.disabled = true;
  pauseTimerBtn.disabled = false;
  resetTimerBtn.disabled = false;
  timerMinutesInput.disabled = true;
  timerSecondsInput.disabled = true;
  timerStatus.textContent = formatTimerDisplay(timerRemaining);
  timerInterval = setInterval(() => {
    timerRemaining--;
    timerStatus.textContent = formatTimerDisplay(timerRemaining);
    if (timerRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      timerStatus.textContent = 'Time is up!';
      startTimerBtn.disabled = false;
      pauseTimerBtn.disabled = true;
      resetTimerBtn.disabled = false;
      timerMinutesInput.disabled = false;
      timerSecondsInput.disabled = false;
    }
  }, 1000);
}
function pauseTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
    pauseTimerBtn.textContent = 'Resume';
  } else {
    if (timerRemaining > 0) {
      pauseTimerBtn.textContent = 'Pause';
      timerInterval = setInterval(() => {
        timerRemaining--;
        timerStatus.textContent = formatTimerDisplay(timerRemaining);
        if (timerRemaining <= 0) {
          clearInterval(timerInterval);
          timerInterval = null;
          timerStatus.textContent = 'Time is up!';
          startTimerBtn.disabled = false;
          pauseTimerBtn.disabled = true;
          resetTimerBtn.disabled = false;
          timerMinutesInput.disabled = false;
          timerSecondsInput.disabled = false;
        }
      }, 1000);
    }
  }
}
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRemaining = 0;
  timerStatus.textContent = '';
  startTimerBtn.disabled = false;
  pauseTimerBtn.disabled = true;
  pauseTimerBtn.textContent = 'Pause';
  resetTimerBtn.disabled = true;
  timerMinutesInput.disabled = false;
  timerSecondsInput.disabled = false;
}
startTimerBtn.addEventListener('click', startTimer);
pauseTimerBtn.addEventListener('click', pauseTimer);
resetTimerBtn.addEventListener('click', resetTimer);

// ----------- Weather App --------------
const weatherBtn = document.getElementById('get-weather-btn');
const weatherCityInput = document.getElementById('weather-city-input');
const weatherResult = document.getElementById('weather-result');

// Use OpenWeatherMap API (free, no server, so limited for CORS - optional fallback to static)
const OPEN_WEATHER_API_KEY = 'ab5327fb7737a4d9e38199ce1e11079c'; // Add your key here if you want

async function fetchWeather(city) {
  if (!city) {
    weatherResult.textContent = 'Please enter a city name.';
    return;
  }
  weatherResult.textContent = 'Loading...';
  try {
    let response;
    if(OPEN_WEATHER_API_KEY) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${OPEN_WEATHER_API_KEY}&units=metric`;
      response = await fetch(url);
      if (!response.ok) throw new Error('City not found');
      const data = await response.json();
      renderWeather(data);
    } else {
      // Static fallback demo data
      const demoData = {
        name: city,
        weather: [{main: 'Clouds', description: 'broken clouds'}],
        main: {temp: 18.5, humidity: 63},
        wind: {speed: 3.4}
      };
      renderWeather(demoData);
    }
  } catch (error) {
    weatherResult.textContent = 'Error getting weather: ' + error.message;
  }
}
let weatherMap = null;

function renderWeather(data) {
  weatherResult.innerHTML = `
    <h3>${data.name}</h3>
    <p>${data.weather[0].main} - ${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp} &deg;C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;

  // Show map if coordinates are available
  if (data.coord && typeof L !== 'undefined') {
    const lat = data.coord.lat;
    const lon = data.coord.lon;
    // Initialize map only once
    if (!weatherMap) {
      weatherMap = L.map('weather-map').setView([lat, lon], 10);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(weatherMap);
    } else {
      weatherMap.setView([lat, lon], 10);
      weatherMap.eachLayer(function (layer) {
        if (layer instanceof L.Marker) weatherMap.removeLayer(layer);
      });
    }
    L.marker([lat, lon]).addTo(weatherMap)
      .bindPopup(`${data.name}`).openPopup();
  }
}

weatherBtn.addEventListener('click', () => {
  const city = weatherCityInput.value.trim();
  fetchWeather(city);
});
weatherCityInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') fetchWeather(weatherCityInput.value.trim());
});

// ---------- Typing Speed Test ----------
const typingParagraphEl = document.getElementById('typing-paragraph');
const typingInput = document.getElementById('typing-input');
const startTypingBtn = document.getElementById('start-typing-btn');
const resetTypingBtn = document.getElementById('reset-typing-btn');
const typingResult = document.getElementById('typing-result');

const typingTexts = [
  "The quick brown fox jumps over the lazy dog.",
  "JavaScript is a versatile programming language used everywhere.",
  "Practice typing fast and accurately to improve your speed.",
  "An apple a day keeps the doctor away.",
  "Learning to code is a valuable skill in today's world."
];

let typingStartTime = null;
let typingTestActive = false;

function startTypingTest() {
  const para = typingTexts[Math.floor(Math.random() * typingTexts.length)];
  typingParagraphEl.textContent = para;
  typingInput.value = '';
  typingInput.disabled = false;
  typingInput.focus();
  typingStartTime = null;
  typingTestActive = true;
  typingResult.textContent = '';
  startTypingBtn.disabled = true;
  resetTypingBtn.disabled = false;
}
function resetTypingTest() {
  typingParagraphEl.textContent = '';
  typingInput.value = '';
  typingInput.disabled = true;
  typingResult.textContent = '';
  startTypingBtn.disabled = false;
  resetTypingBtn.disabled = true;
  typingTestActive = false;
}
typingInput.addEventListener('input', () => {
  if (!typingTestActive) return;
  if (!typingStartTime) typingStartTime = Date.now();
  const entered = typingInput.value;
  const target = typingParagraphEl.textContent;
  if (!target.startsWith(entered)) {
    typingInput.style.borderColor = 'red';
  } else {
    typingInput.style.borderColor = '#ccc';
  }
  if (entered === target) {
    const elapsedMinutes = (Date.now() - typingStartTime) / 60000;
    const words = target.trim().split(/\s+/).length;
    const wpm = Math.round(words / elapsedMinutes);
    typingResult.textContent = `Typing speed: ${wpm} WPM`;
    typingInput.disabled = true;
    typingTestActive = false;
    startTypingBtn.disabled = false;
    resetTypingBtn.disabled = true;
  }
});
startTypingBtn.addEventListener('click', startTypingTest);
resetTypingBtn.addEventListener('click', resetTypingTest);

// ----------- Quiz App ------------
const quizQuestions = [
  { question: "What is the capital of France?", options: ["Paris", "London", "Berlin", "Madrid"], answer: 0 },
  { question: "Which planet is known as the Red Planet?", options: ["Earth", "Mars", "Jupiter", "Venus"], answer: 1 },
  { question: "What does HTML stand for?", options: ["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "None"], answer: 0 },
  { question: "What is the smallest prime number?", options: ["1", "2", "3", "0"], answer: 1 },
  { question: "Which element has the chemical symbol 'O'?", options: ["Oxygen", "Gold", "Osmium", "Zinc"], answer: 0 }
];

let currentQuizIndex = 0;
let quizScore = 0;

const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizNextBtn = document.getElementById('quiz-next-btn');
const quizRestartBtn = document.getElementById('quiz-restart-btn');
const quizScoreEl = document.getElementById('quiz-score');

function loadQuizQuestion() {
  quizNextBtn.disabled = true;
  quizOptionsEl.innerHTML = '';
  const curr = quizQuestions[currentQuizIndex];
  quizQuestionEl.textContent = curr.question;
  curr.options.forEach((opt, i) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'quiz-option';
    radio.value = i;
    radio.required = true;
    radio.addEventListener('change', () => {
      quizNextBtn.disabled = false;
    });
    label.appendChild(radio);
    label.append(' ' + opt);
    li.appendChild(label);
    quizOptionsEl.appendChild(li);
  });
}

function handleNextQuestion() {
  const selected = document.querySelector('input[name="quiz-option"]:checked');
  if (!selected) return;
  const answer = parseInt(selected.value, 10);
  if (answer === quizQuestions[currentQuizIndex].answer) {
    quizScore++;
  }
  currentQuizIndex++;
  if (currentQuizIndex >= quizQuestions.length) {
    quizQuestionEl.textContent = 'Quiz Complete!';
    quizOptionsEl.innerHTML = '';
    quizNextBtn.style.display = 'none';
    quizRestartBtn.style.display = 'inline-block';
    quizScoreEl.textContent = `Your score: ${quizScore} / ${quizQuestions.length}`;
  } else {
    loadQuizQuestion();
    quizScoreEl.textContent = '';
  }
  quizNextBtn.disabled = true;
}
function restartQuiz() {
  currentQuizIndex = 0;
  quizScore = 0;
  loadQuizQuestion();
  quizScoreEl.textContent = '';
  quizNextBtn.style.display = 'inline-block';
  quizRestartBtn.style.display = 'none';
}

quizNextBtn.addEventListener('click', handleNextQuestion);
quizRestartBtn.addEventListener('click', restartQuiz);
restartQuiz();

// ---------- BMI Calculator -----------
const bmiWeight = document.getElementById('bmi-weight');
const bmiHeight = document.getElementById('bmi-height');
const bmiCalcBtn = document.getElementById('bmi-calc-btn');
const bmiResult = document.getElementById('bmi-result');

bmiCalcBtn.addEventListener('click', () => {
  const weight = parseFloat(bmiWeight.value);
  const heightCm = parseFloat(bmiHeight.value);
  if (!(weight > 0) || !(heightCm > 0)) {
    bmiResult.textContent = 'Please enter valid weight and height.';
    return;
  }
  const heightM = heightCm / 100;
  const bmi = weight / (heightM * heightM);
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obesity';
  bmiResult.textContent = `Your BMI is ${bmi.toFixed(1)} (${category})`;
});

// -------- Password Generator --------
const pwLower = document.getElementById('pw-lowercase');
const pwUpper = document.getElementById('pw-uppercase');
const pwNumbers = document.getElementById('pw-numbers');
const pwSymbols = document.getElementById('pw-symbols');
const pwLength = document.getElementById('pw-length');
const pwGenerateBtn = document.getElementById('pw-generate-btn');
const pwOutput = document.getElementById('pw-output');

function generatePassword() {
  const length = parseInt(pwLength.value);
  const useLower = pwLower.checked;
  const useUpper = pwUpper.checked;
  const useNumbers = pwNumbers.checked;
  const useSymbols = pwSymbols.checked;

  if (!useLower && !useUpper && !useNumbers && !useSymbols) {
    alert('Select at least one character type!');
    return;
  }
  if (!(length > 0)) {
    alert('Password length must be positive');
    return;
  }

  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numberChars = '0123456789';
  const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let charset = '';
  if (useLower) charset += lowerChars;
  if (useUpper) charset += upperChars;
  if (useNumbers) charset += numberChars;
  if (useSymbols) charset += symbolChars;

  let password = '';
  for (let i = 0; i < length; i++) {
    const randIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(randIndex);
  }
  pwOutput.value = password;
}
pwGenerateBtn.addEventListener('click', generatePassword);

// ---------- Notes App --------------
const noteInput = document.getElementById('note-input');
const saveNoteBtn = document.getElementById('save-note-btn');
const clearNoteBtn = document.getElementById('clear-note-btn');
const notesList = document.getElementById('notes-list');

function loadNotes() {
  const notes = localStorage.getItem('notes');
  return notes ? JSON.parse(notes) : [];
}
function saveNotes(notes) {
  localStorage.setItem('notes', JSON.stringify(notes));
}
function renderNotes() {
  const notes = loadNotes();
  notesList.innerHTML = '';
  notes.forEach((note, i) => {
    const li = document.createElement('li');
    li.textContent = note;
    const delBtn = document.createElement('button');
    delBtn.textContent = '×';
    delBtn.className = 'delete-note';
    delBtn.setAttribute('aria-label', 'Delete note');
    delBtn.addEventListener('click', () => {
      deleteNote(i);
    });
    li.appendChild(delBtn);
    notesList.appendChild(li);
  });
}
function saveNote() {
  const text = noteInput.value.trim();
  if (!text) return;
  const notes = loadNotes();
  notes.push(text);
  saveNotes(notes);
  noteInput.value = '';
  renderNotes();
}
function clearNote() {
  noteInput.value = '';
}
function deleteNote(index) {
  const notes = loadNotes();
  notes.splice(index, 1);
  saveNotes(notes);
  renderNotes();
}
saveNoteBtn.addEventListener('click', saveNote);
clearNoteBtn.addEventListener('click', clearNote);
renderNotes();

// -------- Stopwatch ------------
const swDisplay = document.getElementById('stopwatch-display');
const swStartBtn = document.getElementById('sw-start-btn');
const swStopBtn = document.getElementById('sw-stop-btn');
const swResetBtn = document.getElementById('sw-reset-btn');
const swLapBtn = document.getElementById('sw-lap-btn');
const lapsList = document.getElementById('laps-list');

let swStartTime = 0;
let swElapsedTime = 0;
let swTimerInterval = null;

function formatStopwatchTime(ms) {
  let centiseconds = Math.floor((ms % 1000) / 10);
  let totalSeconds = Math.floor(ms / 1000);
  let seconds = totalSeconds % 60;
  let minutes = Math.floor(totalSeconds / 60);
  return (
    String(minutes).padStart(2, '0') + ':' +
    String(seconds).padStart(2, '0') + ':' +
    String(centiseconds).padStart(2, '0')
  );
}

function startStopwatch() {
  swStartTime = Date.now() - swElapsedTime;
  swTimerInterval = setInterval(() => {
    swElapsedTime = Date.now() - swStartTime;
    swDisplay.textContent = formatStopwatchTime(swElapsedTime);
  }, 10);
  swStartBtn.disabled = true;
  swStopBtn.disabled = false;
  swResetBtn.disabled = false;
  swLapBtn.disabled = false;
}
function stopStopwatch() {
  clearInterval(swTimerInterval);
  swTimerInterval = null;
  swStartBtn.disabled = false;
  swStopBtn.disabled = true;
  swResetBtn.disabled = false;
  swLapBtn.disabled = true;
}
function resetStopwatch() {
  clearInterval(swTimerInterval);
  swTimerInterval = null;
  swElapsedTime = 0;
  swDisplay.textContent = '00:00:00';
  swStartBtn.disabled = false;
  swStopBtn.disabled = true;
  swResetBtn.disabled = true;
  swLapBtn.disabled = true;
  lapsList.innerHTML = '';
}
function lapStopwatch() {
  if (swElapsedTime === 0) return;
  const li = document.createElement('li');
  li.textContent = formatStopwatchTime(swElapsedTime);
  lapsList.appendChild(li);
}
swStartBtn.addEventListener('click', startStopwatch);
swStopBtn.addEventListener('click', stopStopwatch);
swResetBtn.addEventListener('click', resetStopwatch);
swLapBtn.addEventListener('click', lapStopwatch);
// Initialize stopwatch display
resetStopwatch();

