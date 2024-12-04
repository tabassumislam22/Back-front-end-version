document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const difficulty = body.getAttribute("data-difficulty");
  let roundId, max;

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

  const updateAttemptsDisplay = (attemptsLeft) => {
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

  const newRound = () => {
    fetch('/newround', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ difficulty }),
    })
    .then(response => response.json())
    .then(data => {
      roundId = data.roundId; // Store the roundId for later guesses
      max = data.max;
      updateAttemptsDisplay(5);
      scoreDisplay.textContent = data.score;
      highscoreDisplay.textContent = data.highscore;
      losing.style.visibility = 'hidden'; 
      correct.style.visibility = 'hidden'; 
      main.style.visibility = 'visible';
      guessInput.value = ''; // Clear the guess input
      currentFeedbackMessage.remove(); 

    })
    .catch(error => console.error('Error starting the round:', error));
  };

  const handleGuess = () => {
    const playerGuess = parseInt(guessInput.value);

    if (isNaN(playerGuess) || playerGuess < 1 || playerGuess > max) {
      giveFeedback(`Please enter a number between 1 and ${max}`, "orange");
      return;
    }

    fetch(`/guess/${roundId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guess: playerGuess }),
    })
    .then(response => response.json())
    .then(data => {
      giveFeedback(data.feedback, data.correct ? "green" : "red");
      updateAttemptsDisplay(data.attemptsLeft);
      scoreDisplay.textContent = data.score;
      highscoreDisplay.textContent = data.highscore;
      
      if (data.feedback.includes("Game Over!")) {
        losingScreen();
      } else if (data.correct) {
        correctScreen();
      }
    })
    .catch(error => console.error("Error submitting guess:", error));
  };

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
    newRound();

    main.style.visibility = 'visible';
    correct.style.visibility = 'hidden'; 
  });

    const restartGame = () =>  {
    losing.style.visibility = 'hidden'; 
    correct.style.visibility = 'hidden'; 
    main.style.visibility = 'visible';
    correctNumber = Math.floor(Math.random() * max) + 1; // Get a new random number
    attemptsLeft = 5; // Reset attempts or other necessary values
    guessInput.value = ''; // Clear the guess input
    updateAttemptsDisplay(5);
    score = 0;
    currentFeedbackMessage.remove(); 
  }


  submitButton.addEventListener("click", handleGuess);
  restart.addEventListener("click", restartGame);

  guessInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      handleGuess(); // Trigger the same function as the submit button click
    }
  });

  newRound();

});
