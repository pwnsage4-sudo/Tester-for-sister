// State
let questions = [];
let currentQuestionIndex = 0;
let score = 0;

// Elements
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');

const questionCounter = document.getElementById('question-counter');
const scoreCounter = document.getElementById('score-counter');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');

const finalScore = document.getElementById('final-score');
const finalScoreText = document.getElementById('final-score-text');
const restartBtn = document.getElementById('restart-btn');

// Initialization: Use questionData from data.js
window.addEventListener('DOMContentLoaded', () => {
    if (typeof questionData !== 'undefined' && questionData.length > 0) {
        questions = shuffleArray(questionData);
        startQuiz();
    } else {
        console.error('Error: questionData not found');
        alert('Сұрақтар табылмады. data.js файлы дұрыс жүктелгеніне көз жеткізіңіз.');
    }
});

function shuffleArray(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function showScreen(screen) {
    quizScreen.classList.remove('active');
    resultScreen.classList.remove('active');
    screen.classList.add('active');
}

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showScreen(quizScreen);
    loadQuestion();
}

function loadQuestion() {
    if (questions.length === 0) return;
    
    nextBtn.style.display = 'none';
    const currentQ = questions[currentQuestionIndex];
    
    questionCounter.textContent = `Сұрақ: ${currentQuestionIndex + 1} / ${questions.length}`;
    scoreCounter.textContent = `Ұпай: ${score}`;
    
    // Remove citations from question text if any (e.g. [cite: 3])
    const cleanQuestion = currentQ.question.replace(/\[cite:\s*\d+\]/g, '').trim();
    questionText.textContent = cleanQuestion;
    
    optionsContainer.innerHTML = '';
    
    // Shuffle options
    const shuffledOptions = shuffleArray(currentQ.options);
    
    shuffledOptions.forEach(optionText => {
        const btn = document.createElement('div');
        btn.className = 'option';
        btn.textContent = optionText;
        btn.addEventListener('click', () => selectOption(btn, optionText, currentQ.answer));
        optionsContainer.appendChild(btn);
    });
}

function selectOption(selectedBtn, selectedAnswer, correctAnswer) {
    // Disable all options
    const allOptions = optionsContainer.querySelectorAll('.option');
    allOptions.forEach(opt => opt.classList.add('disabled'));
    
    if (selectedAnswer === correctAnswer) {
        selectedBtn.classList.add('correct');
        score++;
        scoreCounter.textContent = `Ұпай: ${score}`;
    } else {
        selectedBtn.classList.add('wrong');
        // Find and highlight correct answer
        allOptions.forEach(opt => {
            if (opt.textContent === correctAnswer) {
                opt.classList.add('correct');
            }
        });
    }
    
    nextBtn.style.display = 'block';
}

nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
});

function showResult() {
    showScreen(resultScreen);
    const percentage = Math.round((score / questions.length) * 100);
    
    finalScore.textContent = `${percentage}%`;
    finalScoreText.textContent = `Сіз ${questions.length} сұрақтың ${score} дұрыс жауап бердіңіз.`;
    
    // Change color based on score
    if (percentage >= 80) {
        finalScore.parentElement.style.borderColor = "var(--accent)";
        finalScore.parentElement.style.boxShadow = "0 0 30px rgba(0, 230, 118, 0.2)";
        finalScore.style.color = "var(--accent)";
    } else if (percentage >= 50) {
        finalScore.parentElement.style.borderColor = "#ffd600";
        finalScore.parentElement.style.boxShadow = "0 0 30px rgba(255, 214, 0, 0.2)";
        finalScore.style.color = "#ffd600";
    } else {
        finalScore.parentElement.style.borderColor = "var(--danger)";
        finalScore.parentElement.style.boxShadow = "0 0 30px rgba(255, 23, 68, 0.2)";
        finalScore.style.color = "var(--danger)";
    }
}

restartBtn.addEventListener('click', () => {
    questions = shuffleArray(questions);
    startQuiz();
});
