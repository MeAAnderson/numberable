
function setPageLayout(){
  let body = document.getElementsByTagName("body");
  console.log("layout");
  let header = document.createElement("div");
  document.body.appendChild(header);
  header.id = "header";
  header.style.gridColumn =  "1 / span 3";
  header.style.gridRow = "1";
  header.innerHTML = "current question, also title";

  let info = document.createElement("div");
  document.body.appendChild(info);
  info.id = "info";
  info.style.gridColumn = "1";
  info.style.gridRow = "2 / span 2";
  info.innerHTML = "game information goes here. who's playing, whose round, prize from previous rounds, ";

  let content = document.createElement("div");
  document.body.appendChild(content);
  content.id = "content";
  content.style.gridColumn = "2";
  content.style.gridRow = "2 / span 2";
  content.innerHTML = "pyramid goes here";

  let interact = document.createElement("div");
  document.body.appendChild(interact);
  interact.id = "interact";
  interact.style.gridColumn = "2";
  interact.style.gridRow = "3";
  interact.innerHTML = "guesses go in here"

  let current = document.createElement("div");
  document.body.appendChild(current);
  current.id = "current";
  current.style.gridColumn = "3";
  current.style.gridRow = "2 / span 2";
  current.innerHTML = "this is where current lives + correct out of ten/prize for the round so far goes";

  displayLoginPage();
}

function displayLoginPage(){

  //header.style.visibility = "visible";
}

function displayGame() {
  //let incorrects = 0;
  //let corrects = 0;
  //let roundPrize = 0;

  let round = roundData;

  const triangle = document.createElement("triangle");
  const wrongTriangle = document.createElement("wrongTriangle");

  const select = document.createElement("select");
  select.style.visibility = "hidden";
  document.createElement("guess").style.visibility = "visible";

  const questionSection = document.createElement("questionSection");
  questionSection.innerHTML = '';
  question = document.createElement("div");
  questionSection.append(question);
  question.textContent = round[1];

  for (i = 2; i < round.length; i++) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.textContent = round[i];
    answer.className = "answer";
    answer.id = round[i];

    wrongAnswer = document.createElement("div");
    wrongTriangle.appendChild(wrongAnswer);
    wrongAnswer.textContent = round[i];
    wrongAnswer.className = "wrongAnswer";
    wrongAnswer.id = "wrong" + round[i];
  }
}


function setRound(data) {
  roundData = data;
  displayGame();
}
function sendUserGuess(guess){
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

  function wrongAnswer() {
    incorrects += 1;
    console.log(incorrects);
    document.createElement("wrongTriangle").style.backgroundColor = "tomato";
    document.createElement("wrongTriangle").style.visibility = "visible";
    if (incorrects < 2) {
      window.setTimeout(tryAgain, 1000);
      incorrects += 1;
    }
  }
  function tryAgain() {
    console.log("try again");
    document.createElement("wrongTriangle").style.visibility = "hidden";
  }
}
