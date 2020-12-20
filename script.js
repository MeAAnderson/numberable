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
  buildInfoAnchors();

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
  header.innerHTML = `<div id="title"></div>`;
}

function buildInfoAnchors() {
  let info = document.getElementById("info");
  info.innerHTML = "";
  info.innerHTML += `
  <div id="team-name"></div>
  <div id="locked-in-prize"></div>
  <div id="now-playing"></div>
  <div id="contestants"></div>
  `;
}

function buildContentAnchors() {
  let content = document.getElementById("content");
  content.innerHTML = "";

  let triangle = document.createElement("div");
  content.appendChild(triangle);
  triangle.id = "triangle";

  let wrongTriangle = document.createElement("div");
  content.appendChild(wrongTriangle);
  wrongTriangle.id = "wrong-triangle";

  let prompt = document.createElement("div");
  content.appendChild(prompt);
  prompt.id = "user-prompt";

  content.innerHTML += `<input id="user-input" />`;
  content.innerHTML += `<button id="submit-user-input" onclick="submitUserInput()" />`;
}

function buildInteractAnchors() {
  let interact = document.getElementById("interact");
  interact.style.visibility = "hidden";
  interact.innerHTML += `<div id="game-prompt" />`;
  interact.innerHTML += `<input id="game-input" />`;
  interact.innerHTML += `<button id="game-input-button" onclick="userMakesGuess()">submit</button>`;
}

function buildCurrentAnchors(){
  let current = document.getElementById("current");
  current.innerHTML = "";
}

let teamName = "christmas travellers";;
let captainName;

let teamData;
teamData = [
  {
    name: "james",
    captain: true,
    onTeam: true,
    currentContestant: false,
    lives: 0,
  },
  {
    name: "megan",
    captain: false,
    onTeam: true,
    currentContestant: true,
    lives: 2,
  },
  {
    name: "jacob",
    captain: false,
    onTeam: false,
    currentContestant: false,
    lives: 0,
  },
];
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

function setCaptain(){
  let prompt = document.getElementById("prompt");
  prompt.innerHTML = "enter team name";
  let teamNameInput = document.getElementById("user-input");
  teamName = teamNameInput.value;
}

function displayGame() {
  buildContentAnchors();
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

  for (i = roundData.length; i > 2; i--) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.innerHTML = roundData[i];
    answer.className = "answer";
    answer.id = roundData[i];
    answer.gridRow = [i];
    answer.style.width = `${(i-1)*10}%`;
    answer.style.visibility = answersData.includes(roundData[i])
      ? "visible"
      : "hidden";
  }
  
  
}

function displayInfo(data) {
  document.getElementById("info").style.visibility = "visible";

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
      contestant.style.gridRow = `${(i+1)}`;
      contestant.innerHTML = teamData[i].onTeam
        ? `${teamData[i].name} is in the game`
        : `${teamData[i].name} not in the game`;
    
  }
}

function setCurrentContestant(iAmCurrentContestant) {
  document.getElementById("interact").style.visibility = iAmCurrentContestant ? "visible" : "hidden";
  document.getElementById("title").innerHTML = iAmCurrentContestant ? "it's your round" : "it's not your round";
  document.getElementById("title").style.backgroundColor = iAmCurrentContestant ? "PaleGreen" : "Coral";
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
    aniBox.style.width = `${(i-1)*10}%`;
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

function newRound (){
  buildInteractAnchors();
  buildCurrentAnchors();
}
//setCurrentContestant();
//function setCurrentContestant() {
//TO DO admin assigns user to round
//}
//if (roundCount == finalRound - 1) {
//  gameLoopFinal();
//} else {
//  gameLoopContestant(currentContestant);
//  gameLoopPassive(passiveContestants);
//}

//function gameLoopContestant() {
//  let gameInput = document.getElementById("game-input");
// let gamePrompt = document.getElementById("game-prompt");
// let gameChoices = document.getElementById("game-choices");

/*//if (corrects > 4) {
     // gamePrompt.innerHTML = "Keep playing?";
      //for megan: why aren't these buttons calling the function
      gameChoices.innerHTML = `
    // <button onclick="keepPlaying()">yes</button>
    <button onclick="moveOn()">no</button>
  `;
    } else {
      function keepPlaying() {
        gamePrompt.innerHTML = "Enter your answer";
        gameChoices.style.visibility = "hidden";
        gameInput.style.visibility = "visible";
        //TO DO server takes user guess for approval/rejection
        let userGuess = gameInput.value;
        sendUserGuess(userGuess);
        //function when press enter
      }
    }*/
//}

//TO DO if guess is correct, send index of correct answer, previous corrects
/*function correctAnswer(
    roundData,
    indexOfCorrect,
    boolCaptain = false,
    corrects,
    roundPrize
  ) {
    let returnObj = [];

    if (corrects <= 5) {
      if (boolCaptain === true) {
        //for megan get teamMate back or roundPrize+=1000?
      } else {
        roundPrize += 1000;
      }
      let currentCorrect = document.getElementById(
        `${roundData[indexOfCorrect]}`
      );
      currentCorrect.style = "visible";
      currentCorrect.id = "answered";
      //for megan update prize displays
      corrects += 1;
      if ((corrects = roundData.length - 2)) {
        moveOn();
      }
      returnObj.push(corrects, roundPrize);
      return;
    }

    //TO DO if guess is incorrect, send previous incorrects count &
    //index of contestant in case of removal
    //for megan: that ladder thing
    function wrongAnswer(lives, indexofCurrentContestant) {
      let index = indexofCurrentContestant;

      document.getElementById("wrong-triangle").style.visibility = "visible";
      if (lives > 0) {
        window.setTimeout(tryAgain, 1000);
        lives -= 1;
      } else if ((lives = 0)) {
        removeCurrentContestant(index);
      }
    }

    function removeCurrentContestant(index) {
      let testTeam = ["user1", "user2", "user3", "user4", "user5"];
      for (i = 0; i < index; i++) {
        testTeam.push(testTeam[i]);
        testTeam.shift();
      }
      testTeam.shift();
    }

    function tryAgain() {
      document.getElementById("wrong-triangle").style.visibility = "hidden";
    }

    //TO DO this should be exposing answers from the bottom up as the
    //admin presses a button
    function moveOn() {
      let interact = getElementById("interact");
      interact.visibility = "hidden";
      let wrongTriangle = document.getElementById("wrong-triangle");
      wrongTriangle.visibility = "hidden";

      for (i = roundData.length; i > 2; i--) {
        try {
          answer = document.getElementById(`${roundData[i]}`);
          answer.style.visibility = "visible";
          answer.id = "exposed";
        } catch (err) {
          break;
        }
      }
    }

    function gameLoopPassive() {
      //TO DO if guess is correct, send index of correct answer
      function correctAnswer(indexOfCorrect) {
        roundData = data;
        let currentCorrect = document.getElementById(
          `${roundData[indexOfCorrect]}`
        );
        currentCorrect.style = "visible";
        currentCorrect.id = "answered";
      }

      //TO DO if guess is incorrect, send previous incorrects count
      //for megan: that ladder thing
      
      //TO DO this should be exposing answers from the bottom up as the
      //admin presses a button
      function moveOn() {
        //animation then wait for admin input?
        let interact = getElementById("interact");
        interact.visibility = "hidden";
        let wrongTriangle = document.getElementById("wrong-triangle");
        wrongTriangle.visibility = "hidden";

        for (i = roundData.length; i > 2; i--) {
          try {
            answer = document.getElementById(`${roundData[i]}`);
            answer.style.visibility = "visible";
            answer.id = "exposed";
          } catch (err) {
            break;
          }
        }
      }
    }
  }
}*/
