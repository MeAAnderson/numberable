function displayGame() {
  let roundName = document.getElementById("roundName").value;
  let round = getRound(roundName);
  const triangle = document.getElementById("triangle");
  document.getElementById('display').disabled = 'true'

  for (i = 1; i < round.length; i++) {
    answer = document.createElement("div");
    triangle.appendChild(answer);
    answer.textContent = round[i];
    answer.className = 'answer';
    answer.id = round[i];
  }
}

function getRound(x) {
  let round;
  let roundTestOne = ["roundTestOne", "a", "b", "c", "d", "e", "f"];
  let roundTestTwo = ["roundTestTwo", "g", "h", "i", "j", "k", "l"];
  if (x === roundTestOne[0]) {
    round = roundTestOne;
    return round;
  } else if (x === roundTestTwo[0]) {
    round = roundTestTwo;
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
      a.style.visibility = 'visible';
      break;
    } else {
      console.log("testing " + (i + 1));
      count += 1;
      if (count === round.length) {
        console.log(userGuess + " incorrect");
      }
    }
  }
}

