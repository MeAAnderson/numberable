"use strict";

class MegSessionManager {
  constructor() {
    this.initMasterlist();
  }
  processCurrentSessionUsers({ Users }) {
    let users = {};
    Users.map((user) =>
      user.onSnapshot((userSnap) => {
        users[userSnap.id] = userSnap.data().Name;
        const values = Object.values(users);
        document.getElementById(
          "sm_masterlist_users"
        ).innerText = `Users: ${values} \n`;
      })
    );
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
          this.processCurrentSessionUsers(currentSessionData);
        });
      });
  }
}
