"use strict";

class MegSessionManager {
  constructor() {
    this.initMasterlist();
  }
  processCurrentSessionUsers({ Users }) {
    let users = {};
    setHTML("sm_contestantbuttons", "Select Current Contestant:");
    Users?.forEach((userRef) =>
      userRef.get().then((userSnap) => {
        users[userRef.path] = userSnap.data()?.Name || "undefined";
        const values = Object.values(users);
        const buttons = Object.keys(users).map(
          (key) =>
            `<button onclick="setCurrentContestant('${key}')">${users[key]}</button>`
        );
        setHTML(
          "sm_contestantbuttons",
          `Select Current Contestant: ${buttons}`
        );
      })
    );
  }
  processCurrentSessionContestant({ CurrentContestant }) {
    CurrentContestant?.get().then((user) => {
      setText(
        "sm_currentcontestant",
        `Current Contestant: ${user.data().Name} (${user.id}) \n`
      );
    });
  }
  processCurrentSessionQuestion({ CurrentQuestion, QuestionCollection }) {
    document.getElementById(
      "sm_guessoptions"
    ).innerHTML = `<button onclick="setSubmitWrongAnswer()">Wrong Answer</button>`;
    if (QuestionCollection == null || QuestionCollection.empty) {
      setText("sm_currentquestion", `Question Collection undefined`);
    }
    QuestionCollection.get().then((snap) => {
      if (
        CurrentQuestion < 0 ||
        CurrentQuestion >= snap.data().Questions.length
      ) {
        setText(
          "sm_currentquestion",
          `Current Question: null (${CurrentQuestion})`
        );
      } else {
        snap
          .data()
          .Questions[CurrentQuestion].get()
          .then((question) => {
            question.data().Answers.forEach((answer) => {
              document.getElementById(
                "sm_guessoptions"
              ).innerHTML += `<button onclick="setSubmitCorrectAnswer('${answer}')">${answer}</button>`;
            });
          });
        snap
          .data()
          .Questions[CurrentQuestion].get()
          .then((cq) => {
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
      .collection("quizSessions")
      .onSnapshot((sessions) => {
        firebase
          .firestore()
          .doc("quizSessions/Masterlist")
          .get()
          .then((masterSnap) => {
            const masterSession = masterSnap.data().CurrentSession;
            const elem = "sm_masterlist_setmasterlistcurrentsession";
            document.getElementById(elem).innerHTML = "";
            sessions.forEach(({ id, ref: { path } }) => {
              if (id !== "Masterlist") {
                document.getElementById(
                  elem
                ).innerHTML += `<option value="${path}">${id}</option>`;
              }
            });
            document.getElementById(elem).value = masterSession.path;
          });
      });
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot((doc) => {
        const ref = doc.data().CurrentSession;
        ref.onSnapshot((currentSessionSnap) => {
          const currentSessionData = currentSessionSnap.data();
          if (currentSessionData == null) {
            return;
          }
          const { CurrentGuess, CurrentlyAcceptingGuess } = currentSessionData;
          setText("sm_masterlist", `Current master: ${ref.id}`);
          setText("sm_currentguess", `Current Guess: ${CurrentGuess}`);
          setText(
            "sm_acceptingguess",
            `Accepting Guess: ${CurrentlyAcceptingGuess}`
          );
          document.getElementById(
            "sm_masterlist_setmasterlistcurrentsession"
          ).value = ref.path;
          this.processCurrentSessionQuestion(currentSessionData);
          this.processCurrentSessionContestant(currentSessionData);
          this.processCurrentSessionUsers(currentSessionData);
        });
      });
  }
}
