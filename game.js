document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const difficulty = body.getAttribute("data-difficulty");
  let max;

  if (difficulty === "easy") {
    max = 10;
  } else if (difficulty === "medium") {
    max = 50;
  } else if (difficulty === "hard") {
    max = 100;
  } else {
    console.error("Error: Difficulty not recognized! Defaulting to easy.");
    max = 10;
  }

  let correctNumber = Math.floor(Math.random() * max) + 1;
  let attemptsLeft = 5;
  let score = 0;
  let highscore = 0;

  const guessInput = document.getElementById("guess");
  const submitButton = document.getElementById("submit");
  const attemptsDisplay = document.getElementById("attempts");
  const scoreDisplay = document.getElementById("score");
  const highscoreDisplay = document.getElementById("highscore");
  const correct = document.getElementById("correct-screen");
  const main = document.querySelector(".main");
  const losing = document.getElementById("lose-screen");
  const newrnd = document.querySelector(".newrnd");
  const restart = document.getElementById("restart");
  const quit = document.getElementById("quit");
  const home = document.getElementById("home");
  const no = document.getElementById("no");

  const updateAttemptsDisplay = () => {
    let hearts = '';

    for (let i = 0; i < 5; i++) {
      if (i < attemptsLeft) {
        hearts += '❤️'; // Red heart for remaining attempts
      } else {
        hearts += '🤍'; // White heart for used-up attempts
      }
    }

    attemptsDisplay.innerHTML = `Attempts Left: ${hearts}`;
  };

  // Initial display update
  updateAttemptsDisplay();
  scoreDisplay.textContent = score;
  highscoreDisplay.textContent = highscore;

  let currentFeedbackMessage = null;

  const giveFeedback = (message, color) => {

    if (currentFeedbackMessage) {
      currentFeedbackMessage.remove();
    }

    guessInput.style.backgroundColor = color;
    const feedbackMessage = document.createElement("div");
    feedbackMessage.textContent = message;
    feedbackMessage.style.position = "absolute";
    feedbackMessage.style.top = "68%";
    feedbackMessage.style.left = "50%";
    feedbackMessage.style.transform = "translate(-50%, -50%)";
    feedbackMessage.style.padding = "5px 20px";
    feedbackMessage.style.borderRadius = "8px";
    feedbackMessage.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    feedbackMessage.style.color = "white";
    feedbackMessage.style.fontSize = "18px";
    feedbackMessage.style.zIndex = "20";
    feedbackMessage.style.textAlign = "center";
    document.body.appendChild(feedbackMessage);

    currentFeedbackMessage = feedbackMessage;

    setTimeout(() => {
      guessInput.style.backgroundColor = "white";
    }, 500);

      setTimeout(() => {
        currentFeedbackMessage.remove(); 
      }, 5000);
  };

  const losingScreen = () => {
    losing.style.visibility = 'visible'; 
  };

  const correctScreen = () => {
    main.style.visibility = 'hidden';

    correct.style.visibility = 'visible'; 

  };

  home.addEventListener('click', function () {
    quit.style.visibility = 'visible'; 
  });

  no.addEventListener('click', function () {
    quit.style.visibility = 'hidden'; 
  });

  newrnd.addEventListener('click', function () {
    resetGame();

    main.style.visibility = 'visible';
    correct.style.visibility = 'hidden'; 
  });

  const resetGame = () =>  {
    losing.style.visibility = 'hidden'; 
    correct.style.visibility = 'hidden'; 
    main.style.visibility = 'visible';
    correctNumber = Math.floor(Math.random() * max) + 1; // Get a new random number
    attemptsLeft = 5; // Reset attempts or other necessary values
    guessInput.value = ''; // Clear the guess input
    currentFeedbackMessage.remove(); 
    updateAttemptsDisplay();
  }

    const restartGame = () =>  {
    losing.style.visibility = 'hidden'; 
    correct.style.visibility = 'hidden'; 
    main.style.visibility = 'visible';
    correctNumber = Math.floor(Math.random() * max) + 1; // Get a new random number
    attemptsLeft = 5; // Reset attempts or other necessary values
    guessInput.value = ''; // Clear the guess input
    updateAttemptsDisplay();
    score = 0
    currentFeedbackMessage.remove(); 
  }

  const handleGuess = () => {
    const playerGuess = parseInt(guessInput.value);

    if (isNaN(playerGuess) || playerGuess < 1 || playerGuess > max) {
      giveFeedback(`Please enter a number between 1 and ${max}`, "orange");
      return;
    }

    if (playerGuess === correctNumber) {
      score++;
      highscore = Math.max(highscore, score);
      giveFeedback("Correct! Well done!", "green");
      correctNumber = Math.floor(Math.random() * max) + 1;
      attemptsLeft = 5;
      updateAttemptsDisplay(); // Update attempts with hearts after correct guess
      scoreDisplay.textContent = score; 
      highscoreDisplay.textContent = highscore;
      guessInput.value = "";

      correctScreen();
    } else {
      attemptsLeft--;
      updateAttemptsDisplay(); // Update attempts with hearts after incorrect guess

      if (playerGuess < correctNumber) {
        giveFeedback("Too low!", "red");
      } else {
        giveFeedback("Too high!", "red");
      }

      if (attemptsLeft === 0) {
        giveFeedback(`Game Over! The correct number was ${correctNumber}`, "gray");
        score = 0;
        correctNumber = Math.floor(Math.random() * max) + 1;
        attemptsLeft = 5;
        updateAttemptsDisplay(); // Reset attempts with hearts
        scoreDisplay.textContent = score;
        guessInput.value = "";

        losingScreen();
      }
    }
  };

  submitButton.addEventListener("click", handleGuess);
  restart.addEventListener("click", restartGame);

  guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleGuess(); // Trigger the same function as the submit button click
    }
  });

});
