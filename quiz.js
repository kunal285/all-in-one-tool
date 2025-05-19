// Full quiz question bank (use the previous quizQuestions array here)
const quizQuestions = [
  {
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperloop Machine Language",
      "HyperText Markdown Language"
    ],
    answer: 0
  },
  {
    question: "Which of the following is NOT a programming language?",
    options: [
      "Python",
      "JavaScript",
      "HTML",
      "C++"
    ],
    answer: 2
  },
  {
    question: "What symbol is used for single line comments in JavaScript?",
    options: [
      "//",
      "/* */",
      "#",
      "<!-- -->"
    ],
    answer: 0
  },
  {
    question: "Which keyword is used to declare a constant in modern JavaScript?",
    options: [
      "const",
      "var",
      "let",
      "constant"
    ],
    answer: 0
  },
  {
    question: "What is the output of 'typeof NaN' in JavaScript?",
    options: [
      "'undefined'",
      "'number'",
      "'NaN'",
      "'object'"
    ],
    answer: 1
  },
  {
    question: "In CSS, what does the 'float' property do?",
    options: [
      "Positions an element to the left or right, allowing text to wrap",
      "Changes the opacity of an element",
      "Makes an element take full width",
      "Creates a scrolling effect"
    ],
    answer: 0
  },
  {
    question: "What is the main purpose of Git?",
    options: [
      "Version control system",
      "Database management",
      "Compilation of code",
      "Debugging code"
    ],
    answer: 0
  },
  {
    question: "Which method converts a JSON string into a JavaScript object?",
    options: [
      "JSON.stringify()",
      "JSON.parse()",
      "JSON.objectify()",
      "JSON.convert()"
    ],
    answer: 1
  },
  {
    question: "What does REST stand for in web services?",
    options: [
      "Representative State Transfer",
      "Remote State Transfer",
      "Representational State Transfer",
      "Recursive State Transfer"
    ],
    answer: 2
  },
  {
    question: "In Python, which of the following is a mutable data type?",
    options: [
      "tuple",
      "list",
      "string",
      "int"
    ],
    answer: 1
  },
  {
    question: "Which HTML tag is used to include JavaScript code?",
    options: [
      "<script>",
      "<js>",
      "<javascript>",
      "<code>"
    ],
    answer: 0
  },
  {
    question: "Which company developed the Java programming language?",
    options: [
      "Microsoft",
      "Sun Microsystems",
      "Apple",
      "Google"
    ],
    answer: 1
  },
  {
    question: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style Systems",
      "Colorful Style Sheets"
    ],
    answer: 0
  },
  {
    question: "In JavaScript, what keyword is used to declare a variable?",
    options: [
      "dim",
      "let",
      "var",
      "Both let and var"
    ],
    answer: 3
  },
  {
    question: "Which symbol is used for an ID selector in CSS?",
    options: [
      ".",
      "#",
      "*",
      "$"
    ],
    answer: 1
  },
  {
    question: "In Python, which keyword is used to define a function?",
    options: [
      "func",
      "function",
      "def",
      "define"
    ],
    answer: 2
  },
  {
    question: "Which of the following is a backend programming language?",
    options: [
      "HTML",
      "CSS",
      "Python",
      "React"
    ],
    answer: 2
  },
  {
    question: "What does SQL stand for?",
    options: [
      "Structured Query Language",
      "Strong Question Language",
      "Stylish Question Language",
      "Structured Query List"
    ],
    answer: 0
  },
  {
    question: "Which method adds a new element to the end of an array in JavaScript?",
    options: [
      "append()",
      "push()",
      "add()",
      "insert()"
    ],
    answer: 1
  },
  {
    question: "In Git, which command is used to stage changes?",
    options: [
      "git add",
      "git commit",
      "git push",
      "git clone"
    ],
    answer: 0
  }
];


// Number of questions per quiz session
const quizCount = 5; 

// Helper function: shuffle array in-place
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Select a random unique subset of questions for the quiz session
function getRandomQuizQuestions(allQuestions, count) {
  const copy = allQuestions.slice();
  shuffleArray(copy);
  return copy.slice(0, count);
}

let currentQuizIndex = 0;
let quizScore = 0;
let currentQuizSet = [];

// DOM Elements for the quiz (update IDs as per your page)
const quizQuestionEl = document.getElementById('quiz-question');
const quizOptionsEl = document.getElementById('quiz-options');
const quizNextBtn = document.getElementById('quiz-next-btn');
const quizRestartBtn = document.getElementById('quiz-restart-btn');
const quizScoreEl = document.getElementById('quiz-score');

function loadQuizQuestion() {
  quizNextBtn.disabled = true;
  quizOptionsEl.innerHTML = '';
  const currentQuestion = currentQuizSet[currentQuizIndex];
  quizQuestionEl.textContent = currentQuestion.question;
  currentQuestion.options.forEach((option, i) => {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'quiz-option';
    input.value = i;
    input.required = true;
    input.addEventListener('change', () => {
      quizNextBtn.disabled = false;
    });
    label.appendChild(input);
    label.append(' ' + option);
    li.appendChild(label);
    quizOptionsEl.appendChild(li);
  });
}

function handleNextQuestion() {
  const selectedOption = document.querySelector('input[name="quiz-option"]:checked');
  if (!selectedOption) return;
  const answerIndex = parseInt(selectedOption.value, 10);

  if (answerIndex === currentQuizSet[currentQuizIndex].answer) {
    quizScore++;
  }
  currentQuizIndex++;

  if (currentQuizIndex >= currentQuizSet.length) {
    // Quiz finished
    quizQuestionEl.textContent = 'Quiz Complete!';
    quizOptionsEl.innerHTML = '';
    quizNextBtn.style.display = 'none';
    quizRestartBtn.style.display = 'inline-block';
    quizScoreEl.textContent = `Your score: ${quizScore} / ${currentQuizSet.length}`;
  } else {
    loadQuizQuestion();
    quizScoreEl.textContent = '';
  }
  quizNextBtn.disabled = true;
}

function restartQuiz() {
  currentQuizSet = getRandomQuizQuestions(quizQuestions, quizCount);
  currentQuizIndex = 0;
  quizScore = 0;
  loadQuizQuestion();
  quizScoreEl.textContent = '';
  quizNextBtn.style.display = 'inline-block';
  quizRestartBtn.style.display = 'none';
}

quizNextBtn.addEventListener('click', handleNextQuestion);
quizRestartBtn.addEventListener('click', restartQuiz);

// Initialize quiz on page load or quiz tool selection
restartQuiz();
