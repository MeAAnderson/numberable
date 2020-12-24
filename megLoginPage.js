"use strict";

class MegLoginPage {
  constructor() {
    document.getElementById("login_root").innerHTML = `
    <div id="whole-screen" class="j joverlay" style="display:none;" >
        <div class="j jmain">
            <p class="j sign" align="center">Numberable</p>
            <div id="set-name-dialog" class="j form1" style="display:none;" >
                <input id="viewerNameInput" class="namey un" type="text" align="center" placeholder="${funnyName}">
                <a class="submit" align="center" onclick="viewerNameInput()">Join</a>
            </div>
            <div id="join-game-dialog" class="j form1" style="display:none;" >
                <p id="joinGameName" class="j namey" type="text" align="center"></p>
                <a class="submit" align="center" onclick="setInMasterSession()">Join</a>
            </div>
            <div id="joined-game-await" class="j form1" style="display:none;" >
              <p class="j namey" type="text" align="center">Waiting for Host</p>
              <div class="lds-ripple"><div></div><div></div></div>
            </div>
            <p class="j forgot" align="center"><a class="j" id="currently_playing" href="#">0 Currently Playing</p>
        </div>
    </div>
    `;
    this.masterlistHook = null;
    this.initMasterlist();
  }

  setUserMissing(setName, joinGame, awaitGame) {
    SetShowing("set-name-dialog", setName);
    SetShowing("join-game-dialog", joinGame);
    SetShowing("joined-game-await", awaitGame);
  }

  updateMasterlistHook(masterlist) {
    const ref = masterlist.data().CurrentSession;
    if (this.masterlistHook != null) {
      this.masterlistHook();
    }

    this.masterlistHook = ref.onSnapshot((currentSessionSnap) => {
      const currentSessionData = currentSessionSnap.data();
      doc("quizUsers/" + firebase.auth().currentUser.uid)
        .get()
        .then((user) => {
          const { Users, CurrentQuestion } = currentSessionData;
          setText(
            "currently_playing",
            `${Users?.length || 0} Currently Playing`
          );
          if (!user.exists) {
            this.setUserMissing(true, false, false);
            SetShowing("whole-screen", true);
          } else {
            if ((Users || []).map((u) => u.id).includes(user.id)) {
              if (CurrentQuestion === -1) {
                this.setUserMissing(false, false, true);
                SetShowing("whole-screen", true);
              } else {
                SetShowing("whole-screen", false);
              }
            } else {
              setText("joinGameName", user.data().Name);
              this.setUserMissing(false, true, false);
              SetShowing("whole-screen", true);
            }
          }
        })
        .catch((err) => {
          console.error(err);
        });
    });
  }
  initMasterlist() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot((masterlist) => this.updateMasterlistHook(masterlist));
  }
}

const adj = [
  "Vivacious",
  "Talented",
  "Ruddy",
  "Ashamed",
  "Uneven",
  "Secret",
  "Pained",
  "Consistent",
  "Tall",
  "Chief",
  "Glamorous",
  "Administrative",
  "Overconfident",
  "Humdrum",
  "Dizzy",
  "Evasive",
  "Workable",
  "Different",
  "Swanky",
  "Drunk",
  "Zippy",
  "Flashy",
  "Cynical",
  "Frequent",
  "Silly",
  "Emotional",
  "Natural",
  "Shivering",
  "Dazzling",
  "Upset",
  "Real",
  "Delicate",
  "Impossible",
  "Tame",
  "Dynamic",
  "Mushy",
  "Statuesque",
  "Naive",
  "Impolite",
  "Abundant",
  "Ludicrous",
  "Gullible",
];

const animals = [
  "Jack",
  "Jenny",
  "Foal",
  "Bear",
  "Boar",
  "Sow",
  "Tom Cat",
  "Queen",
  "Kitten",
  "Cattle",
  "Cow",
  "Calf",
  "Chicken",
  "Rooster",
  "Hen",
  "Deer",
  "Buck",
  "Doe",
  "Fawn",
  "Duck",
  "Drake",
  "Elephant",
  "Bull",
  "Fox",
  "Goose",
  "Gander",
  "Gosling",
  "Horse",
  "Stallion",
  "Mare",
  "Lion",
  "Rabbit",
  "Buck",
  "Bunny",
  "Sheep",
  "Ram",
  "Ewe Lamb",
  "Swan",
  "Cob",
  "Cygnet",
  "Swine",
  "Tiger",
  "Whale",
  "Wolf",
];

const getafunnyname = () => {
  return (
    adj[Math.floor(adj.length * Math.random())] +
    animals[Math.floor(animals.length * Math.random())]
  );
};
const funnyName = getafunnyname();
