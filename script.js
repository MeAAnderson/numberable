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

function setRound(data, answers, reveal, totalprize) {
  if (data == null) {
    return;
  }
  displayGame(data, answers, reveal);
  //TODO call with data in the fashion below and the info section works
  displayInfo(
    totalprize,
    [
      { nameOfPlayer: "megan", isOnTeam: true, isCaptain: true },
      { nameOfPlayer: "james", isOnTeam: false, isCaptain: false },
    ],
    answers.length
  );
}

function displayGame(roundData, answersData, revealData) {
  let triangle = document.getElementById("triangle");
  triangle.innerHTML = "";
  triangle.style.gridTemplateRows = `repeat(${roundData.length}, 1fr`;
  triangle.style.visibility = "visible";

  let currentQuestion = document.getElementById("title");
  currentQuestion.style.visibility = "visible";
  currentQuestion.innerHTML = `${roundData[1]}`;

  for (i = `${roundData.length - 1}`; i > 1; i--) {
    const shouldShow =
      answersData.includes(roundData[i]) || revealData.includes(roundData[i]);
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = roundData[i];
    answer.className = "answer";
    answer.id = `answer ${i}`;
    answer.style.gridRow = `${i + 2}`;
    answer.style.width = `${(i - 1) * 4.5 + 22}vw`;
    answer.style.visibility = shouldShow ? "visible" : "hidden";
    answerBackground = document.createElement("div");
    triangle.appendChild(answerBackground);
    answerBackground.className = revealData.includes(roundData[i])
      ? "reveal-background"
      : "answer-background";
    answerBackground.id = `answer-background ${i}`;
    answerBackground.style.gridRow = `${i + 2}`;
    answerBackground.style.width = `${(i - 1) * 4.5 + 22}vw`;
    answerBackground.style.visibility = shouldShow ? "visible" : "hidden";
  }
}

function displayInfo(totalPrize, teamData, prizeLevelReached) {
  displayLockedInPrize(totalPrize);
  displayContestants(teamData);
  displayCurrentRoundInfo(prizeLevelReached);
}

function displayLockedInPrize(totalPrize) {
  let prize = totalPrize;
  document.getElementById("locked-in-prize").innerHTML =
    prize == null ? "" : `Playing for: ${prize}`;
}

/*function displayContestants(teamData) {
  let data = teamData;
  let contestantsSection = document.getElementById("contestants");
  contestantsSection.innerHTML = "";

  for (i = 0; i < data.length; i++) {
    let contestant = findOrCreateElement("div", `${data[i].nameOfPlayer}`);
    contestantsSection.appendChild(contestant);
    contestant.className = "contestant";
    contestant.style.gridRow = `${i + 1}`;
    contestant.innerHTML = data[i].isOnTeam
      ? `${teamData[i].nameOfPlayer} is In`
      : `${teamData[i].nameOfPlayer} is Out`;
    contestant.style.backgroundColor = data[i].isOnTeam
      ? `aquamarine`
      : `silver`;
    contestant.innerHTML = data[i].isCaptain
      ? `Captain ${data[i].nameOfPlayer}`
      : contestant.innerHTML;
  }
}*/

function displayCurrentRoundInfo(prizeLevelReached = 0) {
  const currentRoundInfo = document.getElementById("content");
  currentRoundInfo.style.visibility = "visible";
  for (i = 0; i < 9; i++) {
    let prizeLevel = findOrCreateElement("div", `prize-level-${i}`);
    currentRoundInfo.appendChild(prizeLevel);
    prizeLevel.className = "prize-level";
    prizeLevel.innerHTML = POINTS_LADDER[i] > 0 ? POINTS_LADDER[i] : "";
    prizeLevel.style.width = `${i * 1.25 + 3}vw`;
    prizeLevel.style.gridRow = `${12 - i}`;
    prizeLevel.style.visibility = prizeLevelReached > i ? "visible" : "hidden";
  }
  findOrCreateElement(
    `prize-level-${prizeLevelReached - 1}`
  ).style.backgroundColor = " rgb(69, 1, 100)";
}

//TO DO add nowPlayingContestant = null button to admin page and/or
//call setCurrentContestant(null) when setting new round/
function setCurrentContestant(
  iAmCurrentContestant,
  nameOfPlayer,
  currentlyGuessable
) {
  document.getElementById("interact").style.visibility =
    iAmCurrentContestant && currentlyGuessable ? "visible" : "hidden";
  document.getElementById("user-guess").innerHTML = currentlyGuessable
    ? "Waiting for guess"
    : document.getElementById("user-guess").innerHTML;
  document.getElementById("user-prompt").innerHTML = iAmCurrentContestant
    ? "It's your turn!"
    : `${nameOfPlayer}</br>playing now!`;
  document.getElementById(
    "user-prompt"
  ).style.backgroundColor = iAmCurrentContestant
    ? currentlyGuessable
      ? "chartreuse"
      : "aquamarine"
    : "silver";
  document.getElementById("user-prompt").innerHTML = currentlyGuessable
    ? document.getElementById("user-prompt").innerHTML
    : "";
}

function setOwnUserName(name) {
  let myname = name;
  let ownUserNameSection = document.getElementById("own-user-name");
  ownUserNameSection.innerHTML = `You are ${myname}!`;
}
function submitUserInput() {
  sendUserGuess(document.getElementById("user-input").value);
  document.getElementById("user-input").value = "";

  function sendUserGuess(guess) {
    setCurrentGuess(guess);
  }
}

function setUserGuessMessage(username, userguess) {
  let name = username;
  let guess = userguess;
  let userGuessMessage = findOrCreateElement("div", "user-guess");
  let content = document.getElementById("content");
  content.appendChild(userGuessMessage);
  userGuessMessage.innerHTML =
    guess == "" || null ? "Waiting to play" : `${name} guessed: ${guess}`;
}

function wrongAnswer(currentWrongGuesses) {
  switch (currentWrongGuesses) {
    case 0:
      setText("wrong-answers", `One life left`);
      findOrCreateElement("div", "wrong-answers").style.backgroundColor =
        "aquamarine";
      findOrCreateElement("div", "wrong-triangle").style.visibility = "hidden";
      break;
    case 1:
      setText("wrong-answers", "No lives left!");
      findOrCreateElement("div", "wrong-answers").style.backgroundColor = "red";
      break;
    case 2:
      setText("wrong-answers", "You're off the team!");
      findOrCreateElement("div", "wrong-triangle").style.visibility = "visible";
      break;
    default:
      setText("wrong-answers", "");
      findOrCreateElement("div", "wrong-answers").style.backgroundColor =
        "aquamarine";
      findOrCreateElement("div", "wrong-triangle").style.visibility = "hidden";
  }
}

function tryAgain() {
  document.getElementById("wrong-triangle").style.visibility = "hidden";
}
