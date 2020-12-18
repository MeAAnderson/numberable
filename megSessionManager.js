"use strict";

class MegSessionManager {
  constructor() {
    this.masterlistHook = null;
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
    setText("sm_currentcontestant", `Current Contestant:`);
    CurrentContestant?.get().then((user) => {
      setText(
        "sm_currentcontestant",
        `Current Contestant: ${user.data().Name} (${user.id}) \n`
      );
    });
  }
  processCurrentSessionQuestion({
    CurrentQuestion,
    QuestionCollection,
    CurrentGuess,
    CurrentAnswers,
  }) {
    setText("sm_currentguess", `Current Guess: ${CurrentGuess}`);
    const wrongAns = `<button onclick="setSubmitWrongAnswer()">Wrong Answer</button>`;
    if (QuestionCollection == null || QuestionCollection.empty) {
      setText("sm_currentquestion", `Question Collection undefined`);
    }
    QuestionCollection.get().then((collection) => {
      const { Questions } = collection.data();
      if (CurrentQuestion < 0 || CurrentQuestion >= Questions.length) {
        setHTML("sm_guessoptions", wrongAns);
        setText(
          "sm_currentquestion",
          `Current Question: null (${CurrentQuestion})`
        );
      } else {
        Questions[CurrentQuestion].get().then((question) => {
          const { Question, Answers } = question.data();
          setHTML("sm_guessoptions", wrongAns);
          setText("sm_currentquestion", `Current Question: ${Question}`);
          Answers.forEach((answer) => {
            const disabled = CurrentAnswers.includes(answer) ? "disabled" : "";
            document.getElementById(
              "sm_guessoptions"
            ).innerHTML += `<button onclick="setSubmitCorrectAnswer('${answer}')" ${disabled}>${answer}</button>`;
          });
        });
      }
    });
  }
  updateMasterlistHook(masterlist) {
    const ref = masterlist.data().CurrentSession;
    if (this.masterlistHook != null) {
      this.masterlistHook();
    }
    this.masterlistHook = ref.onSnapshot((currentSessionSnap) => {
      const currentSessionData = currentSessionSnap.data();
      if (currentSessionData == null) {
        return;
      }
      const {
        CurrentlyAcceptingGuess,
        CurrentWrongGuesses,
        CurrentAnswers,
      } = currentSessionData;
      setText("sm_masterlist", `Current master: ${ref.id}`);
      setText("sm_currentanswers", `Current Answers: ${CurrentAnswers}`);
      setText(
        "sm_wrongguesses",
        `Current Wrong Guesses: ${CurrentWrongGuesses}`
      );
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
      .onSnapshot((masterlist) => this.updateMasterlistHook(masterlist));
  }
}
