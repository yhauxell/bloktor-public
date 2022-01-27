import firebase from 'firebase/app';
import 'firebase/auth';

// Docs: https://source.corp.google.com/piper///depot/google3/third_party/devsite/firebase/en/docs/auth/web/google-signin.md

function getGoogleProvider() {
  const provider = new firebase.auth.GoogleAuthProvider();

  //provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

  /*provider.setCustomParameters({
    login_hint: 'user@example.com',
  });
*/
  return provider;
}

function loginWithGoogleSignInPopup(provider) {
  return firebase
    .auth()
    .signInWithPopup(provider)
    .then(({ user }) => {
      /** @type {firebase.auth.OAuthCredential} */
      //const credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      //const token = credential.accessToken;
      // The signed-in user info.
      return user;
      // ...
    });
}

function googleSignInRedirectResult() {
  firebase
    .auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential;

        // This gives you a Google Access Token. You can use it to access the Google API.
        //const token = credential.accessToken;
        // ...
      }
      // The signed-in user info.
      //const user = result.user;
    })
    .catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //const credential = error.credential;
      // ...
    });
}

function googleBuildAndSignIn(id_token) {
  // Build Firebase credential with the Google ID token.
  const credential = firebase.auth.GoogleAuthProvider.credential(id_token);

  // Sign in with credential from the Google user.
  firebase
    .auth()
    .signInWithCredential(credential)
    .catch((error) => {
      // Handle Errors here.
      //const errorCode = error.code;
      //const errorMessage = error.message;
      // The email of the user's account used.
      //const email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      //const credential = error.credential;
      // ...
    });
}

function onSignIn(googleUser, onSuccess, onError) {
  // We need to register an Observer on Firebase Auth to make sure auth is initialized.
  const unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
    unsubscribe();
    // Check if we are already signed-in Firebase with the correct user.
    if (!isUserEqual(googleUser, firebaseUser)) {
      // Build Firebase credential with the Google ID token.
      const credential = firebase.auth.GoogleAuthProvider.credential(
        googleUser.getAuthResponse().id_token
      );

      // Sign in with credential from the Google user.

      firebase
        .auth()
        .signInWithCredential(credential)
        .catch(onError);
    } else {
      onSuccess(googleUser);
    }
  });
}

async function logout(onLogout) {
  await firebase.auth().signOut();
  return onLogout();
}

function isUserEqual(googleUser, firebaseUser) {
  if (firebaseUser) {
    const providerData = firebaseUser.providerData;
    for (let i = 0; i < providerData.length; i++) {
      if (
        providerData[i].providerId ===
          firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
        providerData[i].uid === googleUser.providerData[i].uid
      ) {
        // We don't need to reauth the Firebase connection.
        return true;
      }
    }
  }
  return false;
}

export default {
  async login(onSuccess, onError) {
    const provider = getGoogleProvider();
    const user = await loginWithGoogleSignInPopup(provider);
    return onSignIn(user, onSuccess, onError);
  },
  logout,
};
