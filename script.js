// per game and per round prize
let gamePrize = 0;
// 1 per round overRule
// 3 per game nominate
let nominate = 0;
// 1 per round free wrong answer
let incorrects = 0;
// final round 2x category options

function displayGame() {
  let incorrects = 0;
  let corrects = 0;
  let roundPrize = 0;

  let roundName = document.getElementById("roundName").value;
  let round = getRound(roundName);

  const triangle = document.getElementById("triangle");
  const wrongTriangle = document.getElementById("wrongTriangle");

  const select = document.getElementById("select");
  select.style.visibility = "hidden";
  document.getElementById("guess").style.visibility = "visible";

  const questionSection = document.getElementById("questionSection");
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

function getRound(x) {
  let round;
  let One = [
    "One",
    "Guess the first ten symbols of the periodic table",
    "H",
    "He",
    "Li",
    "Be",
    "B",
    "C",
    "N",
    "O",
    "F",
    "Ne",
  ];
  let Two = [
    "Two",
    "Guess the most popular boys names in the UK, 1954",
    "David",
    "John",
    "Stephen",
    "Michael",
    "Peter",
    "Robert",
    "Paul",
    "Alan",
    "Christopher",
    "Richard",
  ];
  if (x === One[0]) {
    round = One;
    return round;
  } else if (x === Two[0]) {
    round = Two;
    return round;
  }
}

function tryGuess() {
  let roundName = document.getElementById("roundName").value;
  let round = getRound(roundName);
  let userGuess = document.getElementById("input").value;
  let count = 0;

  for (i = 0; i < round.length; i++) {
    if (userGuess === round[i]) {
      console.log(userGuess + " correct");
      a = document.getElementById(userGuess);
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
    document.getElementById("wrongTriangle").style.backgroundColor = "tomato";
    document.getElementById("wrongTriangle").style.visibility = "visible";
    if (incorrects < 2) {
      window.setTimeout(tryAgain, 1000);
      incorrects += 1;
    }
  }
  function tryAgain() {
    console.log("try again");
    document.getElementById("wrongTriangle").style.visibility = "hidden";
  }
}
