"use strict";

class MegSessionManager {
  constructor() {
    this.initMasterlist();
  }
  processCurrentSessionUsers({ Users }) {
    let users = {};
    Users.map((userRef) =>
      userRef.onSnapshot((userSnap) => {
        users[userRef.path] = userSnap.data()?.Name || "Guest";
        const values = Object.values(users);
        const keys = Object.keys(users);
        setText("sm_masterlist_users", `Users: ${values} \n`);

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
      setText(
        "sm_currentcontestant",
        `Current Contestant: ${user.data().Name} (${user.id}) \n`
      );
    });
  }
  processCurrentSessionQuestion({ CurrentQuestion, QuestionCollection }) {
    QuestionCollection.onSnapshot((qc) => {
      if (
        CurrentQuestion === -1 ||
        qc.data().Questions.length <= CurrentQuestion
      ) {
        setText(
          "sm_currentquestion",
          `Current Question: null (${CurrentQuestion})`
        );
      } else {
        qc.data().Questions[CurrentQuestion].onSnapshot((cq) => {
          setText(
            "sm_currentquestion",
            `Current Question: ${cq.data().Question}`
          );
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
          const {
            Name,
            CurrentGuess,
            CurrentlyAcceptingGuess,
          } = currentSessionData;

          setText("sm_masterlist", `Current master: ${ref.id}, Name: ${Name}`);
          setText("sm_currentguess", `Current Guess: ${CurrentGuess}`);
          setText(
            "sm_acceptingguess",
            `Accepting Guess: ${CurrentlyAcceptingGuess}`
          );

          this.processCurrentSessionQuestion(currentSessionData);
          this.processCurrentSessionContestant(currentSessionData);
          this.processCurrentSessionUsers(currentSessionData);
        });
      });
  }
}
