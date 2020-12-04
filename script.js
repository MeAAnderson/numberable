function displayGame() {
  let roundName = document.getElementById("roundName").value;
  let round = getRound(roundName);
  console.log(round);
}

function getRound(x) {
  let round;
  let roundTestOne = ["roundTestOne", "a", "b", "c", "d", "e", "f"];
  let roundTestTwo = ["roundTestTwo", "g", "h", "i", "j", "k", "l"];
  if (x === roundTestOne[0]) {
    round = roundTestOne;
    return round;
  } else if (x === roundTestTwo[0]) {
    round = roundTestTwo
    return round
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

//let roundTest = ["a", "b", "c", 'd', 'e', 'f']; //get me out of global memory please!
