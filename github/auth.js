firebase.auth().onAuthStateChanged(function(user) {
    if (user) {


        var token;


        var req = new XMLHttpRequest();
        req.open('POST',
            'https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token',
            true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');


        req.onload = function () {

            // Parse API data into JSON
            const data = JSON.parse(this.response);
            console.log(data);
            token = data.access_token;
            user = auth.currentUser;
            db.doc(`users/${user.uid}/meta/github`).set({token: token}).then((e) => {
                console.log("added token")
            })


        }
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('code');
        req.send('code=' + encodeURIComponent(myParam) +
            '&client_id=85d8cc1b1bc263ac7a3e' +
            '&client_secret=c630ac643ae0079359632674ea723cac877759e6');
    }
    else {}});