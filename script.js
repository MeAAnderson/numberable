function checkIt() {
  console.log("it works");
}

function setPageLayout() {
  buildHeaderAnchors();
  buildInfoAnchors();
  buildContentAnchors();
  buildInteractAnchors();
  buildCurrentAnchors();
}

function findOrCreateElement(type, id) {
  let elem = document.getElementById(id);
  if (elem == null || elem == undefined) {
    elem = document.createElement(type);
    document.body.appendChild(elem);
    elem.id = id;
  }
  return elem;
}

function buildHeaderAnchors() {
  const header = findOrCreateElement("div", "header");
  header.innerHTML = `<div id="title"></div>`;
}

function buildInfoAnchors() {
  const info = findOrCreateElement("div", "info");
  info.innerHTML = `
  <div id="team-name"></div>
  <div id="locked-in-prize"></div>
  <div id="now-playing"></div>
  <div id="contestants"></div>
  `;
}

function buildContentAnchors() {
<<<<<<< HEAD
  let content = document.getElementById("content");
  content.innerHTML = "";

  let triangle = document.createElement("div");
  content.appendChild(triangle);
  triangle.id = "triangle";

  let wrongTriangle = document.createElement("div");
  content.appendChild(wrongTriangle);
  wrongTriangle.id = "wrong-triangle";

  let backgroundTriangle = document.createElement("div");
  content.appendChild(backgroundTriangle);
  backgroundTriangle.id = "background-triangle";

  let prompt = document.createElement("div");
  content.appendChild(prompt);
  prompt.id = "user-prompt";

  content.innerHTML += `<input id="user-input" />`;
  content.innerHTML += `<button id="submit-user-input" onclick="submitUserInput()" />`;
=======
  const content = findOrCreateElement("div", "content");
  content.innerHTML = `
  <div id="triangle"></div>
  <div id="wrong-triangle"></div>
  <div id="user-prompt"></div>
  <input id="user-input" />
  <button id="submit-user-input" onclick="submitUserInput()" >Guess</button>
  `;
>>>>>>> a35b4867485a67acb9c569ada4c1b83474459824
}

function buildInteractAnchors() {
  const interact = findOrCreateElement("div", "interact");
  interact.style.visibility = "hidden";
  interact.innerHTML = `<div id="game-prompt" />
  <input id="game-input" />
  <button id="game-input-button" onclick="userMakesGuess()">submit</button>`;
}

function buildCurrentAnchors() {
<<<<<<< HEAD
  let current = document.getElementById("current");
=======
  const current = findOrCreateElement("div", "current");
>>>>>>> a35b4867485a67acb9c569ada4c1b83474459824
  current.innerHTML = "";
}

//Assigned some variables in order to test the functions
let teamName = "christmas travellers";
let captainName;

let userData = ["isOnTeam", "livesRemaining"];
let totalPrize = "total prize";
let roundPrize = "round prize";

let roundData;
let answersData;

function setRound(data, answers) {
  roundData = data;
  answersData = answers;
  displayGame();
}

function displayLoginPage() {
  buildContentAnchors();
  let content = document.getElementById("content");
  content.style.visibility = "visible";

  let userInput = document.getElementById("user-input");
  let User = userInput.value;
  prompt.innerHTML = "Enter user name";
}

function setCaptain() {
  let prompt = document.getElementById("prompt");
  prompt.innerHTML = "enter team name";
  let teamNameInput = document.getElementById("user-input");
  teamName = teamNameInput.value;
}

function displayGame() {
  buildContentAnchors();
  let triangle = document.getElementById("triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length + 2}, 1fr`;
  triangle.style.visibility = "visible";

  let wrongTriangle = document.getElementById("wrong-triangle");
  wrongTriangle.innerHTML = "";
  wrongTriangle.style.gridTemplateRows = `repeat(${roundData.length + 2}, 1fr)`;

  let currentQuestion = document.getElementById("title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${roundData[1]}`;

  for (i = roundData.length; i > 1; i--) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = roundData[i];
    answer.className = "answer";
    answer.id = roundData[i];
<<<<<<< HEAD
    answer.style.gridRow = `${i + 3}`;
    answer.style.width = `$${(i - 1) * 3 + 28}vw`;
=======
    answer.gridRow = [i];
    answer.style.width = `${(i - 1) * 10}%`;
>>>>>>> a35b4867485a67acb9c569ada4c1b83474459824
    answer.style.visibility = answersData.includes(roundData[i])
      ? "visible"
      : "hidden";
    answerBackground = document.createElement("div");
    triangle.appendChild(answerBackground);
    answerBackground.className = "answer-background";
    answerBackground.id = `${roundData[i]}answer-background`;
    answerBackground.style.gridRow = `${i + 3}`;
    answerBackground.style.width = `${(i - 1) * 4 + 20}vw`;
    answerBackground.style.visibility = answersData.includes(roundData[i])
      ? "visible"
      : "hidden";
  }
}

function displayInfo(data) {
  document.getElementById("info").style.visibility = "visible";

  let teamData;
  teamData = data;

  let teamNameSection = document.getElementById("team-name");
  let lockedInPrizeSection = document.getElementById("locked-in-prize");
  let nowPlayingSection = document.getElementById("now-playing");
  let contestantsSection = document.getElementById("contestants");

  teamNameSection.innerHTML = `${teamName} are playing`;
  lockedInPrizeSection.innerHTML = `${totalPrize}`;
  nowPlayingSection.innerHTML = "";
  contestantsSection.innerHTML = "";
  for (i = 0; i < teamData.length; i++) {
    if (teamData[i].currentContestant) {
      nowPlayingSection.innerHTML = `${teamData[i].name} is playing`;
    }
    let contestant = document.createElement("div");
    contestantsSection.appendChild(contestant);
    contestant.id = `${teamData[i].name}`;
    contestant.style.gridRow = `${i + 1}`;
    contestant.innerHTML = teamData[i].onTeam
      ? `${teamData[i].name} is in the game`
      : `${teamData[i].name} not in the game`;
  }
}

function setCurrentContestant(iAmCurrentContestant) {
  document.getElementById("interact").style.visibility = iAmCurrentContestant
    ? "visible"
    : "hidden";
  document.getElementById("title").innerHTML = iAmCurrentContestant
    ? "it's your round"
    : "it's not your round";
  document.getElementById("title").style.backgroundColor = iAmCurrentContestant
    ? "PaleGreen"
    : "Coral";
}

function submitUserInput() {
  sendUserGuess(document.getElementById("user-input").value);
}

function sendUserGuess(guess) {
  console.log(`Sending ${guess} to server.`);
  setCurrentGuess(guess);
}

function bigRevealAnimation(indexOfCorrect) {
  //animation use index for the dings then displayGame();
  let triangle = document.getElementById("triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length - 2}, 1fr`;
  triangle.style.visibility = "visible";

  let currentQuestion = document.getElementById("title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${roundData[1]}`;

  //for megan add animation
  for (i = indexOfCorrect; i > 2; i--) {
    aniBox = document.createElement("div");
    triangle.appendChild(aniBox);
    aniBox.style.width = `${(i - 1) * 10}%`;
    aniBox.style.backgroundColor = "blue";
  }
  setTimeout(displayGame(), 3000);
}

let livesRemaining = true;

function wrongAnswer() {
  document.getElementById("wrong-triangle").style.visibility = "visible";
  if (livesRemaining) {
    window.setTimeout(tryAgain, 1000);
  }
}

function tryAgain() {
  document.getElementById("wrong-triangle").style.visibility = "hidden";
}

function newRound() {
  buildInteractAnchors();
  buildCurrentAnchors();
}
