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
