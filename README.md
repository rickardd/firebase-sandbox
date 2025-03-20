## Setup with Github and Firebase hosting

To start a new project from scratch with github CI, build commands etc with firebase hosting.

1. Set up a gitHub repo
2. install firebase cli tools `npm install firebase-tools -g` or use npx
3. `firebase login`
4. `firebase init hosting`
5. `firebase serve` to run and test the app locally
6. `firebase deploy` to run and test the deployment

- Deploys with a ssl certificate so we get https out of the box
- It will use CDN and cashing for the file storage for good performance

- If it's hard to find a unique project name it might be easier to login to the website and create one there.

# Setup with self hosting

## Adding functionality

- `public/index.html` is the index point for our app
  - `<script defer src="/__/firebase/11.4.0/firebase-auth-compat.js"></script>` we can remove all scripts we don't need eg this if we don't need login features. defer ensures we load the scripts after the DOM is loaded.

## Authenticate

Example: Login with a google SSO popup

```js
const googleLoginWithPopUp = () => {
  const provider = new firebase.auth.GoogleAuthProvider();

  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      const credential = result.credential;
      const user = result.user;
      const profile = result.additionalUserInfo.profile;
      const token = credential.accessToken;

      // npm js-cookies package
      Cookies.set("googleAccessToken", token, {
        expires: 1, // Cookie expires in 1 day
        secure: true, // Only sent over HTTPS
        sameSite: "Strict", // Helps prevent CSRF attacks
      });

      // Do something with the data.
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.email;
      const credential = error.credential;
    });
};
```

### Handle the Token

**Store the Token Securely:** Secure cookies is the most way of storing the token.
**Use the Token for API Requests:** Use it to make authorized requests to the Google API or any other service that requires authentication.
**Handle Token Expiration:** Tokens typically have a limited lifespan. You should implement a mechanism to refresh the token or prompt the user to log in again when the token expires.

### GitHub login

```js
function loginWithGithub(provider) {
  // GitHub provider
  var provider = new firebase.auth.GithubAuthProvider();

  // GitHub scope
  provider.addScope("repo");

  // Probably not gitHub unique
  provider.setCustomParameters({
    allow_signup: "false",
  });

  // The rest is tha same as for the google example
  // firebase.auth().signInWithPopup(provider).then((result) => {...}
}
```
