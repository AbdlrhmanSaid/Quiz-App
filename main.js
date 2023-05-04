let qApp = document.querySelector(".quiz-app");
let countSpan = document.querySelector(".quiz-info .count span");
let bulletsSpanContainer = document.querySelector(".bullets .spans");
let qarea = document.querySelector(".quiz-area");
let aArea = document.querySelector(".answer-area");
let subBtn = document.querySelector(".submit-btn");
let bullets = document.querySelector(".bullets");
let resultsContainer = document.querySelector(".results");
let countDownElement = document.querySelector(".countdown");
let cwin = document.querySelector(".choose-window");
let allBtns = document.querySelectorAll(".cbtn");
let hbtn = document.querySelectorAll(".h-btn");
let cbtn = document.querySelectorAll(".c-btn");
let jbtn = document.querySelectorAll(".j-btn");

// set options
let currentIndex = 0;
let rigthAnswers = 0;
let countDowninterval;

function getQuest() {
  let myreq = new XMLHttpRequest();
  myreq.open("get", "Html_quest.json", true);
  myreq.send();
  myreq.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let questObj = JSON.parse(this.responseText);
      // create Number of bullets and count for question
      qCount = questObj.length;

      // add bullets and set quest count
      createBullets(qCount);

      // add quest data
      addQuest(questObj[currentIndex], qCount);

      // start countdown
      countdown(10, qCount);

      // click on submit
      subBtn.onclick = () => {
        // get rigth answer
        let therigthA = questObj[currentIndex].right_answer;

        // increase Index
        currentIndex++;

        // check answer
        checkAnswer(therigthA, qCount);

        // remove previous question
        qarea.innerHTML = "";
        aArea.innerHTML = "";

        // Add Question Data
        addQuest(questObj[currentIndex], qCount);

        // handle bullets class
        handleBullets();

        // start countdown
        countdown(10, qCount);
        // show results
        showResults(qCount);
      };
    }
  };
}
getQuest();

// create Bullets function
function createBullets(num) {
  countSpan.innerHTML = num;

  for (let i = 0; i < num; i++) {
    // create span
    let theBullet = document.createElement("span");
    // append thebullet in bulletsSpanContainer
    bulletsSpanContainer.appendChild(theBullet);
    // add class on to first span
    if (i === 0) {
      theBullet.className = "on";
    }
  }
}

// create Add Question Function
function addQuest(obj, count) {
  if (currentIndex < count) {
    // create Title  Quest
    let qtitle = document.createElement("h2");
    // create qtext
    let qtxt = document.createTextNode(obj["title"]);
    // append text to h2
    qtitle.appendChild(qtxt);
    // h2 text to qarea
    qarea.appendChild(qtitle);
    // craerte answers
    for (let i = 1; i <= 4; i++) {
      // create main div
      let mainDiv = document.createElement("div");
      // add class answer to div
      mainDiv.className = "answer";
      // create input radio
      let radio = document.createElement("input");
      // add type , name , id , data-attr
      radio.name = "quest";
      radio.type = "radio";
      radio.id = `answer_${i}`;
      radio.dataset.answer = obj[`answer_${i}`];
      // create label and add attr
      let label = document.createElement("label");
      label.htmlFor = `answer_${i}`;
      // create label text
      let labelTxt = document.createTextNode(obj[`answer_${i}`]);
      // add labeltxt to label
      label.appendChild(labelTxt);
      // append input radio and label in main div
      mainDiv.appendChild(radio);
      mainDiv.appendChild(label);
      // appeend main div in aArea
      aArea.appendChild(mainDiv);
    }
  }
}

// check answer function
function checkAnswer(rAnswer, count) {
  // select all answers
  let answers = document.getElementsByName("quest");
  let theChoosenAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      theChoosenAnswer = answers[i].dataset.answer;
    }
  }
  if (rAnswer === theChoosenAnswer) {
    rigthAnswers++;
    console.log(`good answers`);
  }
}

// handke bullets function
function handleBullets() {
  let bulletsSpans = document.querySelectorAll(".bullets .spans span");
  let arrayOfspnas = Array.from(bulletsSpans);
  arrayOfspnas.forEach((span, index) => {
    if (currentIndex === index) {
      span.className = "on";
    }
  });
}

// show results function
function showResults(count) {
  let results;
  if (currentIndex === count) {
    qarea.remove();
    aArea.remove();
    subBtn.remove();
    bullets.remove();
    resultsContainer.style.display = "block";
  }

  if (rigthAnswers > count / 2 && rigthAnswers < count) {
    results = `<span class="good">Good</span>, ${rigthAnswers} From ${count}`;
  } else if (rigthAnswers === count) {
    results = `<span class="perfect">Perfect</span>, All Answers Is Good`;
  } else {
    results = `<span class="bad">Bad</span>, ${rigthAnswers} From ${count}`;
  }
  resultsContainer.innerHTML = results;
  resultsContainer.style.padding = "10px";
  resultsContainer.style.backgroundColor = "white";
  resultsContainer.style.marginTop = "10px";
}

// count down function
function countdown(duration, count) {
  if (currentIndex < count) {
    let min, sec;
    countDowninterval = setInterval(function () {
      min = parseInt(duration / 60);
      sec = parseInt(duration % 60);

      min = min < 10 ? `0${min}` : min;
      sec = sec < 10 ? `0${sec}` : sec;

      countDownElement.innerHTML = `${min} : ${sec}`;

      if (--duration < 0) {
        clearInterval(countDowninterval);
        subBtn.click();
      }
    }, 1000);
  }
}
