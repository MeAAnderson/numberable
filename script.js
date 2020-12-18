function checkIt() {
  console.log("it works");
}

function setPageLayout() {
  let body = document.getElementsByTagName("body");

  //current question, also title
  let header = document.createElement("div");
  document.body.appendChild(header);
  header.id = "header";
  header.style.gridColumn = "1 / span 3";
  header.style.gridRow = "1";
  buildHeaderAnchors();

  //game information goes here. who's playing, 
  //whose round, prize from previous rounds
  let info = document.createElement("div");
  document.body.appendChild(info);
  info.id = "info";
  info.style.gridColumn = "1";
  info.style.gridRow = "2";

  //pyramid goes here
  let content = document.createElement("div");
  document.body.appendChild(content);
  content.id = "content";
  content.style.gridColumnStart = "2";
  content.style.gridRow = "2 / span 1";
  buildContentAnchors();

  //guesses go in here
  let interact = document.createElement("div");
  document.body.appendChild(interact);
  interact.id = "interact";
  interact.style.gridColumn = "2";
  interact.style.gridRow = "3";
  buildInteractAnchors();

  //"this is where current lives 
  //+ correct out of ten/prize for the round so far goes
  let current = document.createElement("div");
  document.body.appendChild(current);
  current.id = "current";
  current.style.gridColumn = "3";
  current.style.gridRow = "2 / span 2";

  displayLoginPage();
}

function buildHeaderAnchors(){
  let header = document.getElementById("header");
  header.innerHTML = "";
  header.style.visibility = "visible";

  let title = document.createElement("div");
  header.appendChild(title);
  title.id = "title";
  title.style.gridColumn = "2 / span 3";
  title.style.gridRow = "2";
}

function buildContentAnchors() {
  let content = document.getElementById("content");
  content.innerHTML = "";

  let prompt = document.createElement("div");
  content.appendChild(prompt);
  prompt.id = "prompt";
  prompt.style.gridColumn = "2 / span 3";
  prompt.style.gridRow = "4 / span 3";

  let triangle = document.createElement("div");
  content.appendChild(triangle);
  triangle.id = "triangle";
  triangle.style.gridColumn = "1 / span 5";
  triangle.style.gridRow = "1 / span 20";

  let wrongTriangle = document.createElement("div");
  content.appendChild(wrongTriangle);
  wrongTriangle.id = "wrong-triangle";
  wrongTriangle.style.gridColumn = "1 / span 5";
  wrongTriangle.style.gridRow = "1 / span 20";
  
}

function buildInteractAnchors(){
  let interact = document.getElementById("interact");
  interact.innerHTML = "";

  let gameInput = document.createElement("input");
  interact.appendChild(gameInput);
  gameInput.id = "game-input";
  gameInput.type = "text";
  gameInput.style.gridColumn = "2 / span 3";
  gameInput.style.gridRow = "2 / span 2";

  let gamePrompt = document.createElement("div");
  interact.appendChild(gamePrompt);
  gamePrompt.id = "game-prompt";
  gamePrompt.style.gridColumn = "2 / span 3";
  gamePrompt.style.gridRow = "1";

}

function displayLoginPage() {
  let content = document.getElementById("content");

  let prompt = document.getElementById("prompt");
  
  prompt.innerHTML = "Enter your name";

//below should be the firestore login?
  let newForm = document.createElement("form"); 
  content.appendChild(newForm);
  newForm.style.gridRow = "9 / span 2";
  newForm.style.gridColumn = "1 / span 5";

  let userNameIn = document.createElement("input");
  newForm.appendChild(userNameIn);
  userNameIn.type = "text";
  userNameIn.addEventListener("submit", checkIt);

  //after form submission hide form and prompt but i haven't worked out form submission yet :(
  newForm.style.visibility = "hidden";
  prompt.style.visibility = "hidden";
  
}

function displayGame() {
  let round = ["round name", "1", "2", "3", "4", "0", "1", "2", "3", "4"];

  let triangle = document.getElementById("triangle");
  triangle.style.gridTemplateRows = `repeat(${round.length - 1}, 1fr`;
  triangle.style.visibility = "visible";

  let wrongTriangle = document.getElementById("wrong-triangle");
  wrongTriangle.style.gridTemplateRows = `repeat(${round.length - 1}, 1fr`;

  let currentQuestion = document.getElementById("title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${round[0]}`

  for (i = 1; i < round.length; i++) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = round[i];
    answer.className = "answer";
    answer.id = round[i];
    answer.gridRow = [i];
  }

  gameLoop();
}

function gameLoop(){
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


let roundData;
function setRound(data) {
  roundData = data;
  displayGame();
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
