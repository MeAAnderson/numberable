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
  header.style.visibility = "visible";

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
  gameInput.type = "text";

  let gamePrompt = document.createElement("div");
  interact.appendChild(gamePrompt);
  gamePrompt.id = "game-prompt";
}

function displayLoginPage() {
  let content = document.getElementById("content");
  let prompt = document.getElementById("prompt");

  //below should be the firestore login?
  let userInput = document.getElementById("user-input");
  console.log(userInput);
  
  prompt.innerHTML = "Enter your answer";
}

let roundData;
function setRound(data) {
  roundData = data;;
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
  }

  gameLoop();
}

function gameLoop() {
  //below should send answers/choices to server
  let gameInput = document.getElementById("game-input");

  let gamePrompt = document.getElementById("game-prompt");
  gamePrompt.innerHTML = "Enter your answer";
}

function wrongAnswer() {
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

function displayGameA() {
  let round = ["0", "1"];

  const select = document.createElement("select");
  select.style.visibility = "hidden";
  document.createElement("guess").style.visibility = "visible";
  document.body.appendChild(select);

  const questionSection = document.createElement("questionSection");
  questionSection.innerHTML = "";
  question = document.createElement("div");
  questionSection.append(question);
  question.textContent = round[1];
  document.body.appendChild(questionSection);

  wrongAnswer = document.createElement("div");
  wrongTriangle.appendChild(wrongAnswer);
  wrongAnswer.textContent = round[i];
  wrongAnswer.className = "wrongAnswer";
  wrongAnswer.id = "wrong" + round[i];
}

function sendUserGuess(guess) {
  console.log(`Sending ${guess} to server.`);
  setCurrentGuess(guess);
}

function tryGuess() {
  let round = roundData;
  let userGuess = document.createElement("input").value;
  sendUserGuess(userGuess);
  let count = 0;

  for (i = 0; i < round.length; i++) {
    if (userGuess === round[i]) {
      console.log(userGuess + " correct");
      a = document.createElement(userGuess);
      a.style.visibility = "visible";
      break;
    } else {
      count += 1;
      if (count === round.length) {
        wrongAnswer();
      }
    }
  }
}
