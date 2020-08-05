var gurlParams = new URLSearchParams(window.location.search);
var gcode = gurlParams.get('code');
var xhr = new XMLHttpRequest();
var token;


const url = `https://github.com/login/oauth/access_token?client_id=85d8cc1b1bc263ac7a3e&client_secret=c630ac643ae0079359632674ea723cac877759e6&code=${gcode}`;

// Open a new connection, using a GET request via URL endpoint
// Providing 3 arguments (GET/POST, The URL, Async True/False)
xhr.open('POST', url, true);
xhr.setRequestHeader("Accept", "application/json");
//xhr.setRequestHeader("Access-Control-Allow-Origin", "*")

xhr.onload = function () {

    // Parse API data into JSON
    const data = JSON.parse(this.response);
    token = data.access_token
    user = auth.currentUser;
    db.doc(`users/${user.uid}/meta/github`).set({token:token}).then((e)=>{console.log("added token")})



}

xhr.send()