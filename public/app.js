// Docs: https://firebase.google.com/docs/auth/web/google-signin#web_3

const appendUserInfo = ({ avatar_url, name }) => {
  document.querySelector("#name").innerHTML = name;
  document.querySelector("#profile-img").src = avatar_url;
};

const googleLoginWithPopUp = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  // Note, both brave and firefox does not permit popups by default.
  // Having that said the redirect option is not necessarily better, more consideration is needed.
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credential = result.credential;

      // This gives you a Google Access Token. You can use it to access the Google API.
      // Maybe store this in a session-cookie or similar
      const token = credential.accessToken;

      const user = result.user;
      console.log(user);

      const profile = result.additionalUserInfo.profile;

      appendUserInfo({ avatar_url: profile.picture, name: profile.name });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

// Google redirect

// Redirect might not be a good option if the browser blocks third-party cookies.
// https://firebase.google.com/docs/auth/web/redirect-best-practices
const googleLoginWithRedirect = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);

  firebase
    .auth()
    .getRedirectResult()
    .then((result) => {
      if (result.credential) {
        const credential = result.credential;

        const token = credential.accessToken;
      }
      const user = result.user;

      const profile = result.additionalUserInfo.profile;
      console.log(profile);

      appendUserInfo({ avatar_url: profile.picture, name: profile.name });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};

// GitHub

function loginWithGithub(provider) {
  var provider = new firebase.auth.GithubAuthProvider();

  provider.addScope("repo");

  provider.setCustomParameters({
    allow_signup: "false",
  });

  debugger;

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      var credential = result.credential;

      // This gives you a GitHub Access Token. You can use it to access the GitHub API.
      var token = credential.accessToken;

      var user = result.user;

      const profile = result.additionalUserInfo.profile;

      appendUserInfo({ avatar_url: profile.avatar_url, name: profile.name });
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });
}
