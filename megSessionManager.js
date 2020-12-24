"use strict";

class MegSessionManager {
  constructor() {
    this.masterlistHook = null;
    this.initMasterlist();
  }
  processCurrentSessionUsers({ Users, CurrentContestant, CurrentCaptain }) {
    let users = {};
    setHTML("sm_contestantbuttons", "Select Current Contestant:");
    setHTML("sm_captainbuttons", "Select Current Captain:");

    Users?.forEach((userRef) =>
      userRef.get().then((userSnap) => {
        users[userRef.path] = userSnap.data()?.Name || "undefined";
        const values = Object.values(users);
        const buttons = Object.keys(users).map(
          (key) =>
            `<button onclick="util_setCurrentContestant('${key}')" ${
              CurrentContestant?.path === key ? "disabled" : ""
            }>${users[key]}</button>`
        );
        setHTML(
          "sm_contestantbuttons",
          `Select Current Contestant: ${buttons}`
        );
        const captainbuttons = Object.keys(users).map(
          (key) =>
            `<button onclick="util_setCurrentCaptain('${key}')" ${
              CurrentCaptain?.path === key ? "disabled" : ""
            }>${users[key]}</button>`
        );
        setHTML(
          "sm_captainbuttons",
          `Select Current Captain: ${captainbuttons}`
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
    RevealAnswers,
    CurrentAnswers,
  }) {
    setText("sm_currentguess", `Current Guess: ${CurrentGuess}`);
    if (QuestionCollection == null || QuestionCollection.empty) {
      setText("sm_currentquestion", `Question Collection undefined`);
    }
    QuestionCollection.get().then((collection) => {
      const { Questions } = collection.data();
      if (CurrentQuestion < 0 || CurrentQuestion >= Questions.length) {
        setHTML("sm_guessoptions", "");
        setText(
          "sm_currentquestion",
          `Current Question: null (${CurrentQuestion})`
        );
      } else {
        Questions[CurrentQuestion].get().then((question) => {
          const { Question, Answers } = question.data();
          setHTML("sm_guessoptions", "");
          setHTML("sm_revealoptions", "");
          setText("sm_currentquestion", `Current Question: ${Question}`);
          Answers.forEach((answer) => {
            const disabled =
              CurrentAnswers?.includes(answer) ||
              RevealAnswers?.includes(answer)
                ? "disabled"
                : "";
            document.getElementById(
              "sm_revealoptions"
            ).innerHTML += `<button onclick="setRevealAnswer('${answer}')" ${disabled}>${answer}</button>`;
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
        TotalPrize
      } = currentSessionData;
      setText("sm_masterlist", `Current master: ${ref.id}`);
      setText("sm_currentanswers", `Current Answers: ${CurrentAnswers}`);
      setHTML(
        "sm_wrongguesses",
        `Current Wrong Guesses: ${CurrentWrongGuesses}
        <button onclick="setSubmitWrongAnswer()">Wrong Answer</button>`
      );
      setText(
        "sm_acceptingguess",
        `Accepting Guess: ${CurrentlyAcceptingGuess}`
      );
      document.getElementById(
        "sm_masterlist_setmasterlistcurrentsession"
      ).value = ref.path;
      setHTML("sm_total_prize", `Total prize: ${TotalPrize}`);
      setHTML(
        "sm_finish_the_round",
        `
      Finish the round:
      <button onclick="bankTheMoney()">Bank the Money</button>
      <button onclick="playerEliminated()">Player Eliminated</button>
      `
      );
      //
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
