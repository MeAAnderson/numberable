"use strict";

function doc(document) {
  return firebase.firestore().doc(document);
}

function viewerNameInput() {
  let Name = document.getElementById("viewerNameInput")?.value || "";
  if (Name === "") {
    Name = funnyName;
  }
  doc("quizUsers/" + firebase.auth().currentUser.uid)
    .set(
      {
        Name,
      },
      { merge: true }
    )
    .then(setInMasterSession)
    .catch(function (error) {
      console.error("Error setting username. ", error);
    });
}

function viewerLogOut() {
  firebase.auth().signOut();
}

function setSessionPreviousQuestion() {
  incrementMasterSessionField("CurrentQuestion", -1);
  resetCurrentValuesInMasterSesssion();
}

function setSessionNextQuestion() {
  incrementMasterSessionField("CurrentQuestion", 1);
  resetCurrentValuesInMasterSesssion();
}

function setMasterlistCurrentSession() {
  setMasterlist(
    doc(
      document.getElementById("sm_masterlist_setmasterlistcurrentsession").value
    ),
    () => {}
  );
}

function setMasterlist(masterRef, thenFn) {
  doc("quizSessions/Masterlist")
    .set(
      {
        CurrentSession: masterRef,
      },
      { merge: true }
    )
    .then(thenFn)
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function setMasterSessionFields(fields) {
  withMasterSessionRef((ref) => {
    ref.set(fields, { merge: true }).catch((err) => console.log(err));
  });
}

function incrementMasterSessionField(field, value) {
  withMasterSessionRef((ref) => {
    ref
      .update(field, firebase.firestore.FieldValue.increment(value))
      .catch((err) => console.log(err));
  });
}
function arrayUnionMasterSessionField(field, value) {
  withMasterSessionRef((ref) => {
    ref
      .update(field, firebase.firestore.FieldValue.arrayUnion(value))
      .catch((err) => console.log(err));
  });
}

function setSubmitCorrectAnswer(answer) {
  setMasterSessionFields({ CurrentGuess: "", CurrentlyAcceptingGuess: false });
  arrayUnionMasterSessionField("CurrentAnswers", answer);
  incrementMasterSessionField("CurrentCorrectGuesses", 1);
}

function setSubmitWrongAnswer() {
  setMasterSessionFields({ CurrentGuess: "", CurrentlyAcceptingGuess: false });
  incrementMasterSessionField("CurrentWrongGuesses", 1);
}

function util_setCurrentContestant(userPath) {
  setMasterSessionFields({
    CurrentContestant: doc(userPath),
  });
}
function setCurrentGuess(guess) {
  setMasterSessionFields({ CurrentGuess: guess });
}

function setSessionAcceptingGuess(accepting) {
  setMasterSessionFields({ CurrentlyAcceptingGuess: accepting });
}

function resetCurrentValuesInMasterSesssion() {
  setMasterSessionFields({
    CurrentAnswers: [],
    //CurrentContestant:
    CurrentCorrectGuesses: 0,
    CurrentGuess: "",
    //CurrentQuestion: -1,
    CurrentWrongGuesses: 0,
    CurrentlyAcceptingGuess: false,
    //QuestionCollection:
    //Users:
  });
}

function createNewSession() {
  firebase
    .firestore()
    .collection("quizQuestionCollection")
    .limit(1)
    .get()
    .then((collectionQuery) => {
      collectionQuery.forEach((qc) => {
        var newMaster = firebase.firestore().collection("quizSessions").doc();
        newMaster
          .set({
            QuestionCollection: qc.ref,
            CurrentQuestion: -1,
          })
          .then(() => {
            setMasterlist(newMaster, resetCurrentValuesInMasterSesssion);
          })
          .catch(function (error) {
            console.error("Error adding document: ", error);
          });
      });
    })
    .catch((err) => console.error(err));
}

function withMasterSessionRef(fn) {
  doc("quizSessions/Masterlist")
    .get()
    .then((doc) => {
      fn(doc.data().CurrentSession);
    });
}

function setInMasterSession() {
  arrayUnionMasterSessionField(
    "Users",
    doc("quizUsers/" + firebase.auth().currentUser.uid)
  );
}

function ToggleShow(elem) {
  SetShowing(elem, document.getElementById(elem).style.display === "none");
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
