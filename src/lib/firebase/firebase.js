import "firebase/auth";
import "firebase/firestore";
import firebase from "firebase/app";
import { config } from "util/config";
import { auth } from "lib/firebase/auth";

export const init = () => {
  const env = "develop";
  firebase.initializeApp(config.firebase[env]);

  const db = firebase.firestore();

  db.enablePersistence().catch(function (err) {
    if (err.code === "failed-precondition") {
      console.log("More tabs opened. Offline support won't work.");
    } else if (err.code === "unimplemented") {
      console.log("Offline mode not supported.");
    }
  });

  return { db, firebase, auth: auth(firebase) };
};
