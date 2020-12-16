"use strict";

function viewerNameInput() {
  const name = document.getElementById("viewerNameInput").value;
  firebase
    .firestore()
    .collection("quizUsers")
    .doc(firebase.auth().currentUser.uid)
    .set({
      Name: name,
    })
    .then(function () {})
    .catch(function (error) {
      console.error("Error adding document: ", error);
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
  onMasterSessionRef((ref) => {
    ref.get({ source: "server" }).then((snap) =>
      ref
        .set({
          ...snap.data(),
          CurrentQuestion: snap.data().CurrentQuestion + move,
        })
        .catch((err) => console.log(err))
    );
  });
}

function setSessionCurrentContestant(userPath) {
  const userRef = firebase.firestore().doc(userPath);
  onMasterSessionRef((ref) => {
    ref.get({ source: "server" }).then((snap) =>
      ref
        .set({
          ...snap.data(),
          CurrentContestant: userRef,
        })
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
    .set({
      CurrentSession,
    })
    .catch(function (error) {
      console.error("Error adding document: ", error);
    });
}

function onMasterSessionRef(fn) {
  firebase
    .firestore()
    .doc("quizSessions/Masterlist")
    .onSnapshot((doc) => {
      fn(doc.data().CurrentSession);
    });
}

function setInMasterSession() {
  firebase
    .firestore()
    .doc("quizSessions/Masterlist")
    .onSnapshot(function (doc) {
      doc.data().CurrentSession.onSnapshot((currentSession) => {
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

function ToggleShow (element) {
  if (document.getElementById(element).style.display !== "none") {
    document.getElementById(element).style.display = "none";
  } else {
    document.getElementById(element).style.display = "block";
  }
}
function SetShowing (element, direction) {
  if (direction) {
    document.getElementById(element).style.display = "block";
  } else {
    document.getElementById(element).style.display = "none";
  }
}