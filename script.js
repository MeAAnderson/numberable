function setPageLayout() {
  buildHeaderAnchors();
  buildInfoAnchors();
  buildContentAnchors();
  buildInteractAnchors();
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
  <div id="own-user-name"></div>
  <div id="wrong-answers"></div>
  `;
}

function buildInfoAnchors() {
  const info = findOrCreateElement("div", "info");
  info.innerHTML = `
  <div id="locked-in-prize"></div>
  <div id="contestants"></div>
  `;
}

function buildContentAnchors() {
  const content = findOrCreateElement("div", "content");
  content.innerHTML = `
  <div id="outline-triangle"></div>
  <div id="triangle"></div>
  <div id="background-triangle"></div>
  ${getWrongTriangle()}
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
//Assigned some variables in order to test the functions
let captainName;
let roundData;
let answersData;

function setRound(data, answers) {
  roundData = data;
  answersData = answers;
  displayGame(roundData);
  displayInfo();
}

function displayGame() {
  let triangle = document.getElementById("triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length}, 1fr`;
  triangle.style.visibility = "visible";

  let currentQuestion = document.getElementById("title");
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

function displayInfo(totalPrize, teamData, prizeLevelReached) {
  displayLockedInPrize(totalPrize);
  displayContestants(["teamData"]);
  displayCurrentRoundInfo(prizeLevelReached);
}

function displayLockedInPrize(totalPrize) {
  let prize = totalPrize;
  document.getElementById(
    "locked-in-prize"
  ).innerHTML = `playing for: ${prize}`;
}

function displayContestants(teamData){
  let data = teamData;
  let contestantsSection = document.getElementById("contestants");
  contestantsSection.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    let contestant = findOrCreateElement("div", `${data[i].nameOfPlayer}`);
    contestantsSection.appendChild(contestant);
    contestant.className = "contestant";
    contestant.style.gridRow = `${i + 1}`;
    contestant.innerHTML = data[i].isOnTeam
      ? `${teamData[i].nameOfPlayer} is in the game`
      : `${teamData[i].nameOfPlayer} is not in the game`;
      contestant.style.backgroundColor = data[i].isOnTeam
      ? `aquamarine`
      : `silver`;
  }
}

function displayCurrentRoundInfo(prizeLevelReached = -1) {
  let level = prizeLevelReached;
  const currentRoundInfo = document.getElementById("content");
  currentRoundInfo.style.visibility = "visible";
  for (i = 0; i < level; i++) {
    let prizeLevel = findOrCreateElement("div", `prize-level ${i}`);
    console.log(`prize-level ${i}`);
    currentRoundInfo.appendChild(prizeLevel);
    prizeLevel.className = "prize-level";
    prizeLevel.innerHTML = "1000";
    prizeLevel.style.width = `${i + 1 * 4}vw`;
    prizeLevel.style.gridRow = `${14 - i}`;
    prizeLevel.style.visibility = level >= i ? "visible" : "hidden";
  }
  findOrCreateElement(`prize-level ${level-1}`).style.backgroundColor =
    " rgb(69, 1, 100)";
}

function setCurrentContestant(
  iAmCurrentContestant,
  nameOfPlayer,
  currentlyGuessable
) {
  document.getElementById("header").style.visibility = "visibility";
  document.getElementById("interact").style.visibility =
    iAmCurrentContestant && currentlyGuessable ? "visible" : "hidden";
  document.getElementById("user-prompt").innerHTML = iAmCurrentContestant
    ? "it's your turn!"
    : `${nameOfPlayer}</br>is playing now!`;
  document.getElementById(
    "user-prompt"
  ).style.backgroundColor = iAmCurrentContestant
    ? currentlyGuessable
      ? "chartreuse"
      : "aquamarine"
    : "silver";
}
function setOwnUserName(name) {
  let myname = name;
  let ownUserNameSection = document.getElementById("own-user-name");
  ownUserNameSection.innerHTML = `your name is ${myname}!`;
}
function submitUserInput() {
  sendUserGuess(document.getElementById("user-input").value);

  function sendUserGuess(guess) {
    console.log(`Sending ${guess} to server.`);
    setCurrentGuess(guess);
  }
}

function setUserGuessMessage(username, userguess) {
  let name = username;
  let guess = userguess;
  let userGuessMessage = findOrCreateElement("div", "user-guess");
  let content = document.getElementById("content");
  content.appendChild(userGuessMessage);
  userGuessMessage.innerHTML = `${name} guessed: ${guess}`;
}
function clearUserGuessMessage() {
  remove(findOrCreateElement("div", "user-guess"));
}

function wrongAnswer(currentWrongGuesses) {
  setText("wrong-answers", `Lives left: ${1 - currentWrongGuesses}`);
}

function getWrongTriangle() {
  return `<div id="wrong-triangle" style="visibility:hidden;"></div>`;
}

function tryAgain() {
  animatingWrongAnswer = false;
  document.getElementById("wrong-triangle").style.visibility = "hidden";
}
