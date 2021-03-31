export const auth = (firebase) => {
  const provider = new firebase.auth.GoogleAuthProvider();

  return {
    loginByPopup: () => {
      new Promise(async (resolve, reject) => {
        try {
          await firebase.auth().signInWithPopup(provider);
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    },
    observe: (cb) => {
      firebase.auth().onAuthStateChanged(cb);
    },
  };
};

export const observer = () => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      var uid = user.uid;
      // ...
    } else {
      // User is signed out
      // ...
    }
  });
};
