const express = require("express");
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.static("main"));

let highscore = 0;
let score = 0;

//routing html files
app.get("/", (req, res) => {
  res.sendFile(__dirname + '/main/home.html');
});

app.get('/easy', (req, res) => {
    res.sendFile(__dirname + '/main/easy.html');
});

app.get('/med', (req, res) => {
    res.sendFile(__dirname + '/main/med.html');
});

app.get("/hard", (req, res) => {
  res.sendFile(__dirname + '/main/hard.html');
});

// Object to store game data
let rounds = {}; 

// Endpoint to start a new round
app.post('/newround', (req, res) => {
  const difficulty = req.body.difficulty || "easy";
  let max;

  if (difficulty === "easy") {
    max = 10;
  } else if (difficulty === "medium") {
    max = 50;
  } else if (difficulty === "hard") {
    max = 100;
  } else {
    console.error("Error: Difficulty not recognized! Defaulting to easy.");
    max = 10; // Default to easy 
  }

  const roundId = Date.now().toString(); // Create a unique round ID
  const correctNumber = Math.floor(Math.random() * max) + 1;

  rounds[roundId] = {
    correctNumber: correctNumber,
    attemptsLeft: 5,
    max: max,
  };

  res.json({ 
    roundId: roundId,
    max: max,
    score: score,   
    highscore: highscore,   
  });
});

// Endpoint to handle a guess
app.post('/guess/:roundId', (req, res) => {
  const roundId = req.params.roundId;
  const guess = req.body.guess;

  if (!rounds[roundId]) {
    return res.status(404).json({ result: "Round not found!" });
  }

  const round = rounds[roundId];
  let feedback = '';
  let correct = false;

  // Check if guess is valid
  if (isNaN(guess) || guess < 1 || guess > round.max) {
    return res.status(400).json({ result: `Please enter a number between 1 and ${round.max}` });
  }

  if (guess === round.correctNumber) {
    score++;
    feedback = "Correct! Well done!";
    correct = true;
    round.correctNumber = Math.floor(Math.random() * round.max) + 1; // New number for the next round
    round.attemptsLeft = 5; // Reset attempts for the next round    
    highscore = Math.max(highscore, score);
  } else {
    round.attemptsLeft--;
    feedback = guess < round.correctNumber ? "Too low!" : "Too high!";
  }

  // If no attempts left, end the game
  if (round.attemptsLeft === 0) {
    feedback = `Game Over! The correct number was ${round.correctNumber}`;
    score = 0; // Reset score on game over
    round.correctNumber = Math.floor(Math.random() * round.max) + 1; // New number for next round
    round.attemptsLeft = 5; // Reset attempts for next round
  }

  res.json({
    feedback,
    score: score,
    attemptsLeft: round.attemptsLeft,
    correct: correct,
    highscore: highscore,
  });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
