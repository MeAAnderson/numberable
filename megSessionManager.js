"use strict";

class MegSessionManager {
  constructor() {
    this.initMasterlist();
  }
  processCurrentSessionUsers({ Users }) {
    let users = {};
    Users.map((userRef) =>
      userRef.onSnapshot((userSnap) => {
        users[userRef.path] = userSnap.data().Name;
        const values = Object.values(users);
        const keys = Object.keys(users);
        document.getElementById(
          "sm_masterlist_users"
        ).innerText = `Users: ${values} \n`;

        document.getElementById("sm_contestantbuttons").innerHTML =
          "Select Current Contestant:";
          keys.map((path) => {
          document.getElementById(
            "sm_contestantbuttons"
          ).innerHTML += `<button onclick="setSessionCurrentContestant('${path}')">${users[path]}</button>`;
        });
      })
    );
  }
  processCurrentSessionContestant({ CurrentContestant }) {
    CurrentContestant.onSnapshot((user) => {
      document.getElementById(
        "sm_currentcontestant"
      ).innerText = `Current Contestant: ${user.data().Name} (${user.id}) \n`;
    });
  }
  processCurrentSessionQuestion({ CurrentQuestion, QuestionCollection }) {
    QuestionCollection.onSnapshot((qc) => {
      if (CurrentQuestion === -1) {
        document.getElementById(
          "sm_currentquestion"
        ).innerText = `Current Question: null (-1) \n`;
      } else {
        qc.data().Questions[CurrentQuestion].onSnapshot((cq) => {
          document.getElementById(
            "sm_currentquestion"
          ).innerText = `Current Question: ${cq.data().Question} \n`;
        });
      }
    });
  }
  initMasterlist() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot((doc) => {
        const ref = doc.data().CurrentSession;
        ref.onSnapshot((currentSessionSnap) => {
          const currentSessionData = currentSessionSnap.data();
          document.getElementById(
            "sm_masterlist"
          ).innerText = `Current master: ${ref.id}, Name: ${currentSessionData.Name}`;
          this.processCurrentSessionQuestion(currentSessionData);
          this.processCurrentSessionContestant(currentSessionData);
          this.processCurrentSessionUsers(currentSessionData);
        });
      });
  }
}
