// Docs: https://firebase.google.com/docs/auth/web/google-signin#web_3

const appendUserInfo = ({ avatar_url, name }) => {
  document.querySelector("#name").innerHTML = name;
  document.querySelector("#profile-img").src = avatar_url;
};

const appendContactInfo = ({ name }) => {
  document.querySelector("#contact-name").innerHTML = name;
};

const googleLoginWithPopUp = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credential = result.credential;
      const token = credential.accessToken; // Access token for Google API
      const user = result.user;
      const profile = result.additionalUserInfo.profile;

      // npm package js-cookie
      // Store the token in a secure cookie
      Cookies.set("googleAccessToken", token, {
        expires: 1, // Cookie expires in 1 day
        secure: false, // Set to true if production, Only sent over HTTPS
        sameSite: "Strict", // Helps prevent CSRF attacks
      });

      // // Use the token to access Google Contacts API
      fetchGoogleContacts(token);

      // Append user info to the UI
      appendUserInfo({ avatar_url: profile.picture, name: profile.name });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
      console.error("Error during sign-in:", errorCode, errorMessage);
    });
};

// Function to fetch Google Contacts using the access token
const fetchGoogleContacts = (token) => {
  const url = "https://people.googleapis.com/v1/people/me?personFields=names"; // Correct Google People API endpoint

  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log("Contacts:", data);

      appendContactInfo({ name: data.names[0].givenName });
      // Process the contacts data as needed
    })
    .catch((error) => {
      console.error("Error fetching contacts:", error);
    });
};

// Function to retrieve the token from the cookie
const getTokenFromCookie = () => {
  return Cookies.get("googleAccessToken");
};

// Example usage of retrieving the token
const token = getTokenFromCookie();
if (token) {
  console.log("Retrieved token from cookie:", token);
  // You can now use this token to make API requests
}

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
