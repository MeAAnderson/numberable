"use strict";

class MegQuiz {
  constructor() {
    document.getElementById("header_root").innerHTML = `
    <div style="border:#000 1px solid;margin:10px;position:fixed;top:0px;height:20px;">
      <div id="firestore_login" style="float:left;">
        <div id="currentName"  style="float:left;margin-right:10px;">
        </div>
        <div style="float:left;">Enter Name:</div>
        <input id="viewerNameInput" type="text" />
        <button onclick="viewerNameInput()">Change</button>
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
    this.initMasterQuestion();
  };
  initMasterQuestion() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot(function (doc) {
        doc.data().CurrentSession.onSnapshot((session) => {
          session.data().QuestionCollection.onSnapshot((collection) => {
            const CurrentQuestion = session.data().CurrentQuestion;
            collection
              .data()
              .Questions[CurrentQuestion].onSnapshot((question) => {
                if (CurrentQuestion == -1) {
                  setRound();
                } else {
                  setRound([
                    question.id,
                    question.data().Question,
                    ...question.data().Answers,
                  ]);
                }
              });
          });
        });
      });
  }
  initMasterSession() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot(function (doc) {
        doc.data().CurrentSession.onSnapshot((session) => {
          const { Users, CurrentGuess, CurrentContestant } = session.data();
          const userRef = firebase
            .firestore()
            .doc("quizUsers/" + firebase.auth().currentUser.uid);
          document.getElementById("available_game_name").innerText = session.id;

          CurrentContestant.onSnapshot((turn) => {
            document.getElementById("whose_turn").innerText = `Current Turn: ${
              turn.data().Name
            }`;
            SetShowing(
              "viewer_turn",
              turn.id === firebase.auth().currentUser.uid
            );
          });
          document.getElementById(
            "current_guess"
          ).innerText = `Current Guess: ${CurrentGuess}`;
          if (!Users.map((user) => user.path).includes(userRef.path)) {
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
        });
      });
  }
  initViewer() {
    firebase
      .firestore()
      .doc("quizUsers/" + firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        document.getElementById("currentName").innerText = `Signed in as: ${
          doc?.data()?.Name
        }`;
      });
  }
}

window.onload = function () {
  window.quiz = new MegQuiz();
};
