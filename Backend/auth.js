var firebase = require("firebase");
var firebaseui = require('firebaseui');
 // Initialize Firebase
var config = {
    apiKey: "AIzaSyAbzFxOWJE6zAgiU5P_MixKrTiC1ozOdko",
    authDomain: "pennapps2018-1536377765567.firebaseapp.com",
    databaseURL: "https://pennapps2018-1536377765567.firebaseio.com",
    projectId: "pennapps2018-1536377765567",
    storageBucket: "",
    messagingSenderId: "496957306701"
};
firebase.initializeApp(config);

var uiConfig = {
    signInSuccessUrl: 'index.html',
    'signInFlow': 'popup',
    signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    // tosUrl and privacyPolicyUrl accept either url string or a callback
    // function.
    // Terms of service url/callback.
    tosUrl: '<your-tos-url>',
    // Privacy policy url/callback.
    privacyPolicyUrl: function() {
        window.location.assign('<your-privacy-policy-url>');
    }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());
// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);