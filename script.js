function checkIt() {
  console.log("it works");
}

function setPageLayout() {
  let body = document.getElementsByTagName("body");

  //current question, also title
  let header = document.createElement("div");
  document.body.appendChild(header);
  header.id = "header";
  buildHeaderAnchors();

  //game information goes here. who's playing,
  //whose round, prize from previous rounds
  let info = document.createElement("div");
  document.body.appendChild(info);
  info.id = "info";

  //pyramid goes here
  let content = document.createElement("div");
  document.body.appendChild(content);
  content.id = "content";
  buildContentAnchors();

  //guesses go in here
  let interact = document.createElement("div");
  document.body.appendChild(interact);
  interact.id = "interact";
  buildInteractAnchors();

  //"this is where current lives
  //+ correct out of ten/prize for the round so far goes
  let current = document.createElement("div");
  document.body.appendChild(current);
  current.id = "current";
}

function buildHeaderAnchors() {
  let header = document.getElementById("header");
  header.innerHTML = "";

  let title = document.createElement("div");
  header.appendChild(title);
  title.id = "title";
}

function buildContentAnchors() {
  let content = document.getElementById("content");
  content.innerHTML = "";

  let prompt = document.createElement("div");
  content.appendChild(prompt);
  prompt.id = "prompt";

  let userInput = document.createElement("input");
  content.appendChild(userInput);
  userInput.type = "text";
  userInput.id = "user-input";

  let triangle = document.createElement("div");
  content.appendChild(triangle);
  triangle.id = "triangle";

  let wrongTriangle = document.createElement("div");
  content.appendChild(wrongTriangle);
  wrongTriangle.id = "wrong-triangle";
}

function buildInteractAnchors() {
  let interact = document.getElementById("interact");
  interact.innerHTML = "";

  let gameInput = document.createElement("input");
  interact.appendChild(gameInput);
  gameInput.id = "game-input";

  let gamePrompt = document.createElement("div");
  interact.appendChild(gamePrompt);
  gamePrompt.id = "game-prompt";

  let gameChoices = document.createElement("div");
  interact.appendChild(gameChoices);
  gameChoices.id = "game-choices";
}

function displayLoginPage() {
  let content = document.getElementById("content");
  content.style.visibility = "visible";
  let prompt = document.getElementById("prompt");
  prompt.style.visibility = "visible";

  let userInput = document.getElementById("user-input");
  //TO DO server takes value as user name
  let User = userInput.value;

  prompt.innerHTML = "Enter user name";
}

let roundData;

function setRound(data) {
  roundData = data;
  console.log(roundData);
  if (roundData == null) {
    displayLoginPage();
  } else {
    displayGame();
  }
}

function displayGame() {
  let triangle = document.getElementById("triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length - 2}, 1fr`;
  triangle.style.visibility = "visible";

  let wrongTriangle = document.getElementById("wrong-triangle");
  wrongTriangle.innerHTML = "";
  wrongTriangle.style.gridTemplateRows = `repeat(${roundData.length - 1}, 1fr`;

  let currentQuestion = document.getElementById("title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${roundData[1]}`;

  for (i = 2; i < roundData.length; i++) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = roundData[i];
    answer.className = "answer";
    answer.id = roundData[i];
    answer.gridRow = [i];
    answer.style.visibility = "hidden";
  }

  gameLoop();
}

function gameLoop() {
  let gameInput = document.getElementById("game-input");
  let gamePrompt = document.getElementById("game-prompt");
  let gameChoices = document.getElementById("game-choices");

  gamePrompt.innerHTML = "Keep playing?";
  //for megan: why aren't these buttons calling the function
  gameChoices.innerHTML = `
    <button onclick="keepPlaying()">yes</button>
    <button onclick="moveOn()">no</button>
  `;
  function keepPlaying() {
    gamePrompt.innerHTML = "Enter your answer";
    gameChoices.style.visibility = "hidden";
    gameInput.style.visibility = "visible";
    //TO DO server takes user guess for approval/rejection
    let userGuess = gameInput.value;
    sendUserGuess(userGuess);
  }
}

function sendUserGuess(guess) {
  console.log(`Sending ${guess} to server.`);
  setCurrentGuess(guess);
}

//TO DO if guess is correct, send index of correct answer
function correctAnswer(indexOfCorrect) {
  roundData = data;
  let currentCorrect = document.getElementById(`${roundData[indexOfCorrect]}`);
  currentCorrect.style = "visible";
  currentCorrect.id = "answered";
}

//TO DO if guess is incorrect, send previous incorrects count
//for megan: that ladder thing
function wrongAnswer(incorrects) {
  incorrects += 1;
  document.getElementById("wrong-triangle").style.visibility = "visible";
  if (incorrects < 2) {
    window.setTimeout(tryAgain, 1000);
    incorrects += 1;
  }
}

function tryAgain() {
  document.getElementById("wrong-triangle").style.visibility = "hidden";
}

function moveOn() {
  wrongTriangle.visibility = "hidden";
  for (i = 2; i < roundData.length; i++) {
    try {
      answer = document.getElementById(`${roundData[i]}`);
      answer.style.visibility = "visible";
    } catch (err) {
      continue
    }
  }
}
