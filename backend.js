const express = require("express");
const app = express();
const port = 8080;

app.use(express.json());
app.use(express.static("public"));

let correctNumber = Math.floor(Math.random() * 10) + 1;
let attemptsLeft = 5;
let score = 0;
let highscore = 0;

app.get("/highscore", (req, res) => {
  res.json({ highscore });
});

app.post("/submit-guess", (req, res) => {
  const playerGuess = req.body.guess;

  if (playerGuess === correctNumber) {
    score++;
    highscore = Math.max(highscore, score);
    correctNumber = Math.floor(Math.random() * 10) + 1;
    attemptsLeft = 5;
    res.json({ status: "win", score, highscore, attemptsLeft });
  } else {
    attemptsLeft--;
    if (attemptsLeft === 0) {
      const oldCorrectNumber = correctNumber;
      correctNumber = Math.floor(Math.random() * 10) + 1;
      attemptsLeft = 5;
      score = 0;
      res.json({ status: "gameover", correctNumber: oldCorrectNumber, attemptsLeft });
    } else {
      const status = playerGuess < correctNumber ? "low" : "high";
      res.json({ status, attemptsLeft });
    }
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
