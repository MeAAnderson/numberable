"use strict";

class MegQuiz {
  constructor() {
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
            collection
              .data()
              .Questions[session.data().CurrentQuestion].onSnapshot(
                (question) => {
                  setRound([
                    question.id,
                    question.data().Question,
                    ...question.data().Answers,
                  ]);
                }
              );
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
          const userRef = firebase
            .firestore()
            .doc("quizUsers/" + firebase.auth().currentUser.uid);
          document.getElementById(
            "available_game_name"
          ).innerText = session.data().Name;
          const users = session.data().Users;
          if (!users.map((user) => user.path).includes(userRef.path)) {
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
