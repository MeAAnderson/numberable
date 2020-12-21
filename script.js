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
  header.innerHTML = `
  <div id="title"></div>
  <div id="user-prompt"></div>
  `;
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
  const content = findOrCreateElement("div", "content");
  content.innerHTML = `
  <div id="outline-triangle"></div>
  <div id="triangle"></div>
  <div id="background-triangle"></div>
  <div id="wrong-triangle"></div>
  `;
}

function buildInteractAnchors() {
  const interact = findOrCreateElement("div", "interact");
  interact.style.visibility = "hidden";
  interact.innerHTML = `
  <input id="user-input" />
  <button id="submit-user-input" onclick="submitUserInput()" >Guess</button>
  `;
}

function buildCurrentAnchors() {
  const current = findOrCreateElement("div", "current");
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
  displayGame(roundData);
  displayInfo(roundData);
  displayCurrentRoundInfo(roundData);
}

function setCaptain() {
  let prompt = document.getElementById("prompt");
  prompt.innerHTML = "enter team name";
  let teamNameInput = document.getElementById("user-input");
  teamName = teamNameInput.value;
}

function displayGame() {
  buildContentAnchors();
  let triangle = findOrCreateElement("div", "triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length}, 1fr`;
  triangle.style.visibility = "visible";

  let currentQuestion = findOrCreateElement("div", "title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${roundData[1]}`;

  for (i = `${roundData.length - 1}`; i > 1; i--) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = roundData[i];
    answer.className = "answer";
    answer.id = roundData[i];
    answer.style.gridRow = `${i + 2}`;
    answer.style.width = `${(i - 1) * 4.5 + 22}vw`;
    answer.style.visibility = answersData.includes(roundData[i])
      ? "visible"
      : "hidden";
    answerBackground = document.createElement("div");
    triangle.appendChild(answerBackground);
    answerBackground.className = "answer-background";
    answerBackground.id = `${roundData[i]}answer-background`;
    answerBackground.style.gridRow = `${i + 2}`;
    answerBackground.style.width = `${(i - 1) * 4.5 + 22}vw`;
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

let prizeLevelReached = 6;

function displayCurrentRoundInfo() {
  const currentRoundInfo = findOrCreateElement("div", "current");
  currentRoundInfo.innerHTML = "";
  currentRoundInfo.style.visibility = "visible";
  for (i = 0; i < 10; i++) {
    let prizeLevel = document.createElement("div");
    currentRoundInfo.appendChild(prizeLevel);
    prizeLevel.className = "prize-level";
    prizeLevel.id = `prize-level ${prizeLevel[i]}`;
    prizeLevel.innerHTML = "1000";
    prizeLevel.style.width = `${i + 1 * 8}vw`;
    prizeLevel.style.gridRow = `${10 - i}`;
    prizeLevel.style.visibility = prizeLevelReached >= i ? "visible" : "hidden";
  }
}

function setCurrentContestant(iAmCurrentContestant, nameOfPlayer, currentlyGuessable) {
  document.getElementById("header").style.visibility = "visibility";
  document.getElementById("interact").style.visibility =
    iAmCurrentContestant && currentlyGuessable ? "visible" : "hidden";
  document.getElementById("user-prompt").innerHTML = iAmCurrentContestant
    ? "it's your turn!"
    : `${nameOfPlayer}</br>is playing now!`;
  document.getElementById("title").style.backgroundColor = iAmCurrentContestant
    ? "chartreuse"
    : "red";
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
