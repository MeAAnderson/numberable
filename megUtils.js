"use strict";

function viewerNameInput() {
  const value = document.getElementById("viewerNameInput").value;
  firebase
    .firestore()
    .collection("quizUsers")
    .doc(firebase.auth().currentUser.uid)
    .set(
      {
        Name: value,
      },
      { merge: true }
    )
    .then(function () {})
    .catch(function (error) {
      console.error("Error setting username. ", error);
    });
}

function viewerLogOut() {
  firebase.auth().signOut();
}

function setSessionPreviousQuestion() {
  setSessionCurrentQuestion(-1);
}

function setSessionNextQuestion() {
  setSessionCurrentQuestion(1);
}

function setSessionCurrentQuestion(move) {
  withMasterSessionRef((ref) => {
    ref.get().then((snap) =>
      ref
        .set(
          {
            CurrentQuestion: snap.data().CurrentQuestion + move,
          },
          { merge: true }
        )
        .catch((err) => console.log(err))
    );
  });
}

function setMasterlistCurrentSession() {
  const value = document.getElementById(
    "sm_masterlist_setmasterlistcurrentsession"
  ).value;
  const CurrentSession = firebase.firestore().doc(value);
  firebase
    .firestore()
    .doc("quizSessions/Masterlist")
    .set(
      {
        CurrentSession,
      },
      { merge: true }
    )
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function setMasterSessionFields(fields) {
  withMasterSessionRef((ref) => {
    ref.set(fields, { merge: true }).catch((err) => console.log(err));
  });
}

function incrementMasterSessionField(field) {
  withMasterSessionRef((ref) => {
    ref
      .update(field, firebase.firestore.FieldValue.increment(1))
      .catch((err) => console.log(err));
  });
}

function setSubmitCorrectAnswer(answer) {
  setMasterSessionFields({
    CurrentGuess: "",
    CurrentAnswers: { "/questions/A": ["ABC"] },
  });
}

function setSubmitWrongAnswer() {
  setMasterSessionFields({ CurrentGuess: "" });
  incrementMasterSessionField("CurrentWrongGuesses");
}

function setCurrentContestant(userPath) {
  setMasterSessionFields({
    CurrentContestant: firebase.firestore().doc(userPath),
  });
}
function setCurrentGuess(guess) {
  setMasterSessionFields({ CurrentGuess: guess });
}

function setSessionAcceptingGuess(accepting) {
  setMasterSessionFields({ CurrentlyAcceptingGuess: accepting });
}

function createNewSession() {
  const CurrentQuestion = -1;
  firebase
    .firestore()
    .collection("quizQuestionCollection")
    .limit(1)
    .get()
    .then((collectionQuery) => {
      collectionQuery.forEach((qc) => {
        firebase
          .firestore()
          .collection("quizSessions")
          .doc()
          .set({
            CurrentQuestion: CurrentQuestion,
            QuestionCollection: qc.ref,
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      });
    })
    .catch((err) => console.error(err));
}

function withMasterSessionRef(fn) {
  firebase
    .firestore()
    .doc("quizSessions/Masterlist")
    .get()
    .then((doc) => {
      fn(doc.data().CurrentSession);
    });
}

function setInMasterSession() {
  firebase
    .firestore()
    .doc("quizSessions/Masterlist")
    .get()
    .then(function (doc) {
      doc
        .data()
        .CurrentSession.get()
        .then((currentSession) => {
          const userRef = firebase
            .firestore()
            .doc("quizUsers/" + firebase.auth().currentUser.uid);
          const users = currentSession.data().Users;
          if (!users.map((user) => user.path).includes(userRef.path)) {
            currentSession.ref
              .set({
                ...currentSession.data(),
                Users: [...users, userRef],
              })
              .catch(function (error) {
                console.error("Error adding document: ", error);
              });
          }
        });
    });
}

function ToggleShow(element) {
  SetShowing(
    element,
    document.getElementById(element).style.display === "none"
  );
}
function SetShowing(element, direction) {
  document.getElementById(element).style.display = direction ? "block" : "none";
}
function setText(element, text) {
  document.getElementById(element).innerText = text;
}
function setHTML(element, text) {
  document.getElementById(element).innerHTML = text;
}
