const questions = [
    {
        question: "What is the name of the killer in the original Scream movie?",
        answers: ["Ghostface", "Jason", "Freddy", "Michael"],
        correctAnswer: "Ghostface"
    },
    {
        question: "In which movie does a character say, 'What’s your favorite scary movie?'",
        answers: ["Scream", "Halloween", "The Shining", "Psycho"],
        correctAnswer: "Scream"
    },
    {
        question: "Who directed the 1978 film Halloween?",
        answers: ["Wes Craven", "John Carpenter", "Alfred Hitchcock", "Tobe Hooper"],
        correctAnswer: "John Carpenter"
    },
    {
        question: "What do the characters in Scream wear?",
        answers: ["Ghostface masks", "Clown masks", "Hockey masks", "V for Vendetta masks"],
        correctAnswer: "Ghostface masks"
    },
    {
        question: "In which movie does a group of friends get killed off one by one?",
        answers: ["Final Destination", "The Cabin in the Woods", "Scream", "A Nightmare on Elm Street"],
        correctAnswer: "Scream"
    },
    {
        question: "What is the name of the character played by Neve Campbell in Scream?",
        answers: ["Sydney Prescott", "Tatum Riley", "Gale Weathers", "Randy Meeks"],
        correctAnswer: "Sydney Prescott"
    },
    {
        question: "What is the name of the killer in 'A Nightmare on Elm Street'?",
        answers: ["Freddy Krueger", "Michael Myers", "Ghostface", "Jason Voorhees"],
        correctAnswer: "Freddy Krueger"
    },
    {
        question: "In 'The Shining', what does Jack say as he breaks down the door?",
        answers: ["Here’s Johnny!", "I’m coming for you!", "Let me in!", "Redrum!"],
        correctAnswer: "Here’s Johnny!"
    },
];

let currentQuestionIndex = 0;
let score = 0;
let attempts = 0;
let maxAttempts = 3;
let timer;
let timeLimit = 15; // seconds for each question

document.getElementById('start-button').onclick = startGame;

function startGame() {
    currentQuestionIndex = 0;
    score = 0;
    resetAttempts();
    document.getElementById('intro').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    showQuestion();
}

function resetAttempts() {
    attempts = 0;
}

function resetTimer() {
    clearInterval(timer);
    let timeLeft = timeLimit;
    const timerElement = document.getElementById('timer');

    timerElement.style.display = 'block';
    timerElement.textContent = `Time left: ${timeLeft} seconds`;

    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);
            notifyUser("Time's up! Lorenzo continues to bleed out!", false);
            currentQuestionIndex++;
            showQuestion();
        } else {
            timerElement.textContent = `Time left: ${timeLeft} seconds`;
        }
        timeLeft--;
    }, 1000);
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const answerButtons = document.querySelectorAll('.answer');
    const counterElement = document.getElementById('question-counter');

    if (currentQuestionIndex < questions.length) {
        const currentQuestion = questions[currentQuestionIndex];
        questionElement.textContent = currentQuestion.question;
        answerButtons.forEach((button, index) => {
            button.textContent = currentQuestion.answers[index];
            button.onclick = () => selectAnswer(button, currentQuestion.correctAnswer);
        });
        counterElement.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        resetTimer();
    } else {
        endGame();
    }
}

function selectAnswer(button, correctAnswer) {
    const selectedAnswer = button.textContent;
    attempts++;

    if (selectedAnswer === correctAnswer) {
        score++;
        notifyUser("Correct!", true);
        setTimeout(() => {
            currentQuestionIndex++;
            resetAttempts(); // Reset attempts for the next question
            showQuestion();
        }, 2000); // Pause for 2 seconds before showing the next question
    } else {
        notifyUser(`Incorrect! ${maxAttempts - attempts} attempts remaining.`, false);
        if (attempts >= maxAttempts) {
            notifyUser("Maximum attempts reached! Moving to next question.", false);
            setTimeout(() => {
                currentQuestionIndex++;
                resetAttempts(); // Reset attempts for the next question
                showQuestion();
            }, 2000); // Pause for 2 seconds before moving on
        }
    }
}

function notifyUser(message, isCorrect) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = isCorrect ? 'show correct' : 'show incorrect';
    notification.style.color = isCorrect ? 'green' : 'red';
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

function endGame() {
    clearInterval(timer);
    const questionContainer = document.getElementById('question-container');
    questionContainer.innerHTML = `<h2>Game Over!</h2>
                                  <p>You answered ${score} out of ${questions.length} questions correctly!</p>
                                  <button id="replay-button">Play Again</button>
                                  <button id="share-results">Share Results</button>`;

    document.getElementById('replay-button').onclick = () => location.reload();
    document.getElementById('share-results').onclick = shareResults;
}

function shareResults() {
    const results = `I scored ${score} out of ${questions.length} in Lorenzo's Ghostface Escape Room! Can you beat my score?`;
    const encodedResults = encodeURIComponent(results);
    const shareLink = `https://example.com/share?result=${encodedResults}`; // Change to your domain
    navigator.clipboard.writeText(shareLink).then(() => {
        notifyUser("Results link copied to clipboard! Share it with your friends!", true);
    }).catch(err => {
        console.error("Could not copy text: ", err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('intro').style.display = 'block';
});
