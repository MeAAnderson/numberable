"use strict";

class MegSessionManager {
  constructor() {
    this.initMasterlist();
  }
  initMasterlist() {
    firebase
      .firestore()
      .doc("quizSessions/Masterlist")
      .onSnapshot(function (doc) {
        const ref = doc.data().CurrentSession;
        ref.onSnapshot((masterSnap) => {
          const masterData = masterSnap.data();
          document.getElementById(
            "sm_masterlist"
          ).innerText = `Current master: ${ref.id}, Name: ${masterData.Name}`;

          let users = {};
          masterData.Users.map((user) =>
            user.onSnapshot((userSnap) => {
              users[userSnap.id] = userSnap.data().Name;
              const values = Object.values(users);
              document.getElementById(
                "sm_masterlist_users"
              ).innerText = `Users: ${values} \n`;
            })
          );
        });
      });
  }
}
