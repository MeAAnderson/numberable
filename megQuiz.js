"use strict";

class MegQuiz {
  constructor() {
    document.getElementById("header_root").innerHTML = `
    <div style="visibility:hidden;border:#000 1px solid;margin:10px;position:fixed;top:0px;height:20px;">
      <div id="firestore_login" style="float:left;">
        <div id="currentName"  style="float:left;margin-right:10px;">
        </div>
        <div style="float:left;">Enter Name:</div>
      </div>
      <div id="firestore_logout" style="float:left;">
        <button onclick="viewerLogOut()">Log Out</button>
      </div>
    </div>
    <div style="height:20px;"></div>
    <div id="available_game">
      <h2>Available Games</h2>
        <div id="isPlaying" style="display:none;">Currently Playing</div>
        <div id="available_game_name"></div>
        <div id="firestore_setInMasterSession" style="display:none;">
          <button onclick="setInMasterSession()">Join Game</button>
        </div>
    </div>
    <div id="whose_turn">
    </div>
    <div id="current_guess">
    </div>
    <div id="viewer_turn" style="background-color:rgb(228, 230, 124);padding:5px;display:none;">
    It's your turn!
    </div>`;

    firebase
      .firestore()
      .enablePersistence({ synchronizeTabs: true })
      .then(function () {
        return firebase.auth().signInAnonymously();
      })
      .then(this.initializeFields)
      .catch(function (err) {
        console.log(err);
      });
  }
  initializeFields = () => {
    this.initViewer();
    this.initMasterSession();
    window.loginpage = new MegLoginPage();
  };
  initMasterSession() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot(function (doc) {
        doc.data().CurrentSession.onSnapshot((session) => {
          const {
            Users,
            CurrentGuess,
            CurrentContestant,
            CurrentlyAcceptingGuess,
            CurrentQuestion,
            CurrentWrongGuesses,
            QuestionCollection,
          } = session.data();
          const userRef = firebase
            .firestore()
            .doc("quizUsers/" + firebase.auth().currentUser.uid);
          document.getElementById("available_game_name").innerText = session.id;
          wrongAnswer(CurrentWrongGuesses);
          CurrentContestant?.get().then((contestant) => {
            setUserGuessMessage(contestant.data().Name, CurrentGuess);
            setCurrentContestant(
              contestant.id === firebase.auth().currentUser.uid,
              contestant.data().Name,
              CurrentlyAcceptingGuess
            );
          });
          if (!(Users || []).map((user) => user.path).includes(userRef.path)) {
            document.getElementById("isPlaying").style.display = "none";
            document.getElementById(
              "firestore_setInMasterSession"
            ).style.display = "block";
          } else {
            document.getElementById("isPlaying").style.display = "block";
            document.getElementById(
              "firestore_setInMasterSession"
            ).style.display = "none";
          }

          QuestionCollection.get().then((collect) => {
            const { CurrentQuestion } = collect;
            if (CurrentQuestion == -1) {
              setRound();
            }
            collect
              .data()
              //TODO -1 check this
              .Questions[CurrentQuestion].get()
              .then((question) =>
                setRound(
                  [
                    question.id,
                    question.data().Question,
                    ...question.data().Answers,
                  ],
                  session.data().CurrentAnswers
                )
              );
          });
        });
      });
  }
  initViewer() {
    firebase
      .firestore()
      .doc("quizUsers/" + firebase.auth().currentUser.uid)
      .onSnapshot((doc) => setOwnUserName(doc?.data()?.Name));
  }
}

window.onload = function () {
  window.quiz = new MegQuiz();
};
