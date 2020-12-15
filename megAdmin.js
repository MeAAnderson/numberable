"use strict";

class MegAdmin {
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
    this.initQuestions();
    this.initMasterlist();
    this.initSessions();
    this.initUsers();
    this.initViewer();
    window.sessionmanager = new MegSessionManager();
  };
  initViewer() {
    firebase
      .firestore()
      .collection("quizUsers")
      .doc("" + firebase.auth().currentUser.uid)
      .onSnapshot(function (doc) {
        const data = doc.data();
        document.getElementById(
          "firestore_viewer"
        ).innerText = `Viewer: ${doc.ref.path} \n`;
      });
  }
  initUsers() {
    firebase
      .firestore()
      .collection("quizUsers")
      .onSnapshot(function (snapshot) {
        const element = document.getElementById("firestore_users");
        element.innerText = "";
        snapshot.forEach((doc) => {
          const data = doc.data();
          element.innerText += `User: ${doc.ref.path} \n ${data.Name} \n\n`;
        });
      });
  }
  initMasterlist() {
    firebase
      .firestore()
      .collection("quizSessions")
      .doc("Masterlist")
      .onSnapshot(function (doc) {
        const ref = doc.data().CurrentSession;
        document.getElementById(
          "firestore_masterlist"
        ).innerText = `Master: ${doc.ref.path} is currently: ${ref.path}\n`;
        /*ref.onSnapshot(snap => {
          element.innerText += `Snap: ${snap.data().Questions} \n`;
        });*/
      });
  }
  initSessions() {
    const element = document.getElementById("firestore_sessions");
    firebase
      .firestore()
      .collection("quizSessions")
      .onSnapshot(function (snapshot) {
        element.innerText = "";
        snapshot.forEach((doc) => {
          if (doc.id === "Masterlist") {
            return;
          }
          const {QuestionCollection} = doc.data();
          element.innerText += `Session: ${
            doc.ref.path
          } \n QuestionCollection: ${QuestionCollection.id} \n\n`;
        });
      });
  }
  initQuestions() {
    firebase
      .firestore()
      .collection("quizQuestions")
      .onSnapshot(function (snapshot) {
        const element = document.getElementById("firestore_questions");
        element.innerText = "";
        snapshot.forEach((doc) => {
          const data = doc.data();
          element.innerText += `Question: ${doc.ref.path} \n ${data.Question} \n Answers: ${data.Answers} \n\n`;
        });
      });
  }
}

window.onload = function () {
  window.admin = new MegAdmin();
};
