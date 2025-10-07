// Typing Speed Test + Leaderboard
const quoteDisplay = document.getElementById("quoteDisplay");
const quoteInput = document.getElementById("quoteInput");
const timerEl = document.getElementById("timer");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const restartBtn = document.getElementById("restartBtn");
const leaderboardBody = document.getElementById("leaderboardBody");
const clearScoresBtn = document.getElementById("clearScores");

let startTime, interval;
let typedCharacters = 0;
let correctCharacters = 0;
let quote = "";

const quotes = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing is a useful skill to practice every day.",
  "Success is not final, failure is not fatal.",
  "Simplicity is the soul of efficiency.",
  "Practice makes progress, not perfection.",
  "Dream big. Work hard. Stay humble.",
  "Great things never come from comfort zones."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

function displayNewQuote() {
  quote = getRandomQuote();
  quoteDisplay.innerHTML = "";
  quote.split("").forEach(char => {
    const span = document.createElement("span");
    span.innerText = char;
    quoteDisplay.appendChild(span);
  });
  quoteInput.value = "";
  timerEl.textContent = 0;
  wpmEl.textContent = 0;
  accuracyEl.textContent = "100%";
  typedCharacters = 0;
  correctCharacters = 0;
  clearInterval(interval);
  startTime = null;
}

quoteInput.addEventListener("input", () => {
  const arrayQuote = quoteDisplay.querySelectorAll("span");
  const arrayValue = quoteInput.value.split("");

  if (!startTime) {
    startTime = new Date();
    interval = setInterval(updateStats, 1000);
  }

  typedCharacters++;
  let correct = true;
  correctCharacters = 0;

  arrayQuote.forEach((charSpan, index) => {
    const typedChar = arrayValue[index];
    if (typedChar == null) {
      charSpan.classList.remove("correct", "incorrect");
      correct = false;
    } else if (typedChar === charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
      correctCharacters++;
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
      correct = false;
    }
  });

  if (arrayValue.length === quote.length && correct) {
    clearInterval(interval);
    updateStats(true);
    saveScore();
  }
});

function updateStats(finished = false) {
  const timeElapsed = (new Date() - startTime) / 1000;
  timerEl.textContent = Math.floor(timeElapsed);

  const wordsTyped = quoteInput.value.trim().split(/\s+/).length;
  const minutes = timeElapsed / 60;
  const wpm = Math.round(wordsTyped / minutes) || 0;
  wpmEl.textContent = wpm;

  const accuracy = Math.round((correctCharacters / typedCharacters) * 100) || 0;
  accuracyEl.textContent = accuracy + "%";

  if (finished) {
    quoteInput.disabled = true;
  }
}

restartBtn.addEventListener("click", () => {
  quoteInput.disabled = false;
  displayNewQuote();
});

// Leaderboard Functions
const SCORE_KEY = "typing_leaderboard_v1";

function loadScores() {
  try {
    return JSON.parse(localStorage.getItem(SCORE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveScore() {
  const wpm = parseInt(wpmEl.textContent);
  const accuracy = accuracyEl.textContent;
  const time = parseInt(timerEl.textContent);
  const newScore = { wpm, accuracy, time };

  const scores = loadScores();
  scores.push(newScore);
  scores.sort((a,b) => b.wpm - a.wpm); // Highest WPM first
  localStorage.setItem(SCORE_KEY, JSON.stringify(scores.slice(0,5))); // Top 5 only

  renderLeaderboard();
}

function renderLeaderboard() {
  const scores = loadScores();
  leaderboardBody.innerHTML = "";
  if (scores.length === 0) {
    leaderboardBody.innerHTML = "<tr><td colspan='4'>No scores yet. Type to set your record!</td></tr>";
    return;
  }
  scores.forEach((s, i) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${i + 1}</td>
      <td>${s.wpm}</td>
      <td>${s.accuracy}</td>
      <td>${s.time}</td>
    `;
    leaderboardBody.appendChild(row);
  });
}

clearScoresBtn.addEventListener("click", () => {
  localStorage.removeItem(SCORE_KEY);
  renderLeaderboard();
});

// Init
displayNewQuote();
renderLeaderboard();
