let appContainer = document.querySelector(".quiz-app");
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let questionArea = document.querySelector(".quiz-area");
let answersArea = document.querySelector(".answer-area");
let submitButton = document.querySelector(".submit-btn");
let bulletsContainer = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let categorySelect = document.querySelector(".category-select");
let startButton = document.querySelector(".start-btn");
let categoryLabel = document.querySelector(".category-label");

// state
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let questions = [];
let totalCount = 0;

const CATEGORY_TO_FILE = {
  html: "Html_quest.json",
  css: "css_quest.json",
  js: "js_quest.json",
};

function resetState() {
  currentIndex = 0;
  rightAnswers = 0;
  questions = [];
  totalCount = 0;
  questionArea.innerHTML = "";
  answersArea.innerHTML = "";
  bulletsSpanContainer.innerHTML = "";
  resultsContainer.innerHTML = "";
  resultsContainer.style.display = "none";
  if (countDownInterval) {
    clearInterval(countDownInterval);
  }
  countDownElement.innerHTML = "";
}

async function loadQuestions(categoryKey) {
  const file = CATEGORY_TO_FILE[categoryKey] || CATEGORY_TO_FILE.html;
  const response = await fetch(file);
  const data = await response.json();
  questions = data;
  totalCount = questions.length;
}

function initBullets(num) {
  countSpan.innerHTML = num;
  bulletsSpanContainer.innerHTML = "";
  for (let i = 0; i < num; i++) {
    let theBullet = document.createElement("span");
    if (i === 0) {
      theBullet.className = "on";
    }
    bulletsSpanContainer.appendChild(theBullet);
  }
}

function renderQuestion() {
  if (currentIndex >= totalCount) {
    return;
  }
  const question = questions[currentIndex];
  questionArea.innerHTML = "";
  answersArea.innerHTML = "";

  let titleEl = document.createElement("h2");
  titleEl.appendChild(document.createTextNode(question.title));
  questionArea.appendChild(titleEl);

  for (let i = 1; i <= 4; i++) {
    let mainDiv = document.createElement("div");
    mainDiv.className = "answer";

    let radio = document.createElement("input");
    radio.name = "quest";
    radio.type = "radio";
    radio.id = `answer_${i}`;
    radio.dataset.answer = question[`answer_${i}`];

    let label = document.createElement("label");
    label.htmlFor = `answer_${i}`;
    label.appendChild(document.createTextNode(question[`answer_${i}`]));

    mainDiv.appendChild(radio);
    mainDiv.appendChild(label);
    answersArea.appendChild(mainDiv);
  }
}

function checkAnswer(rightAnswer) {
  let answers = document.getElementsByName("quest");
  let chosen;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chosen = answers[i].dataset.answer;
      break;
    }
  }
  if (rightAnswer === chosen) {
    rightAnswers++;
  }
}

function updateBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let spansArray = Array.from(bulletsSpans);
  spansArray.forEach((span, index) => {
    span.className = index <= currentIndex ? "on" : "";
  });
}

function showResults() {
  if (currentIndex < totalCount) return;

  questionArea.remove();
  answersArea.remove();
  submitButton.remove();
  bulletsContainer.remove();

  let results;
  if (rightAnswers === totalCount) {
    results = `<span class="perfect">Perfect</span>, All answers are correct`;
  } else if (rightAnswers > totalCount / 2) {
    results = `<span class="good">Good</span>, ${rightAnswers} of ${totalCount}`;
  } else {
    results = `<span class="bad">Bad</span>, ${rightAnswers} of ${totalCount}`;
  }

  const restart = `<div class="actions"><button class="restart-btn">Restart</button></div>`;
  resultsContainer.innerHTML = `${results}${restart}`;
  resultsContainer.style.display = "block";

  let restartBtn = document.querySelector(".restart-btn");
  restartBtn.onclick = () => {
    window.location.reload();
  };
}

function countdown(duration) {
  if (countDownInterval) clearInterval(countDownInterval);
  if (currentIndex >= totalCount) return;

  let remaining = duration;
  const circle = document.querySelector(".countdown-circle .progress");
  const countdownText = document.querySelector(".countdown");
  const circumference = 113;

  circle.style.strokeDashoffset = 0;

  countDownInterval = setInterval(() => {
    remaining--;
    const offset = circumference - (remaining / duration) * circumference;
    circle.style.strokeDashoffset = offset;
    countdownText.textContent = remaining;

    if (remaining <= 0) {
      clearInterval(countDownInterval);
      submitButton.click();
    }
  }, 1000);
}

async function startQuizFlow() {
  resetState();
  const categoryKey = (categorySelect.value || "html").toLowerCase();
  categoryLabel.textContent = categoryKey.toUpperCase();
  appContainer.style.display = "block";

  await loadQuestions(categoryKey);
  initBullets(totalCount);
  renderQuestion();
  countdown(10);
}

startButton.onclick = () => {
  // Recreate dynamic areas that were removed on previous runs (if any)
  if (!document.querySelector(".quiz-area")) {
    const qa = document.createElement("div");
    qa.className = "quiz-area";
    appContainer.insertBefore(qa, appContainer.children[2]);
    questionArea = qa;
  }
  if (!document.querySelector(".answer-area")) {
    const aa = document.createElement("div");
    aa.className = "answer-area";
    appContainer.insertBefore(aa, appContainer.children[3]);
    answersArea = aa;
  }
  if (!document.querySelector(".submit-btn")) {
    const sb = document.createElement("button");
    sb.className = "submit-btn";
    sb.textContent = "Submit Answer";
    appContainer.insertBefore(sb, appContainer.children[4]);
    submitButton = sb;
  }
  if (!document.querySelector(".bullets")) {
    const bl = document.createElement("div");
    bl.className = "bullets";
    bl.innerHTML = `<div class="spans"></div>
<div class="countdown-container">
  <div class="countdown-circle">
    <svg>
      <circle cx="20" cy="20" r="18"></circle>
      <circle cx="20" cy="20" r="18" class="progress"></circle>
    </svg>
    <span class="countdown">10</span>
  </div>
</div>`;
    appContainer.insertBefore(bl, appContainer.children[5]);
    bulletsContainer = bl;
    bulletsSpanContainer = bl.querySelector(".spans");
    countDownElement = bl.querySelector(".countdown");
  }
  startQuizFlow();
};

submitButton.onclick = () => {
  if (currentIndex >= totalCount) return;
  const rightAnswer = questions[currentIndex].right_answer;
  checkAnswer(rightAnswer);
  currentIndex++;
  questionArea.innerHTML = "";
  answersArea.innerHTML = "";
  renderQuestion();
  updateBullets();
  countdown(10);
  showResults();
};
