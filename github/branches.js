function getBranches(callback = function(data){}){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onload = function(){
        const data = JSON.parse(this.response);
        //console.log(data);
        callback(data);
    };
    xmlHttp.open("GET", "https://api.github.com/repos/socrathematics/socrathematics.github.io/branches", true); // true for asynchronous
    xmlHttp.send(null);
}

function createPull(title,from, to, body, draft=false, callback=function(step,message){console.log(`${step} : ${message}`)}){
    const user = auth.currentUser;
    callback(0, "Grabbing your credentials")
    var docRef = db.collection(`users`).doc(user.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data().gtoken;
            if (d == null) {
                console.log("User is not authorized.");
                callback(-1, "You have not provided any authorization.");
                return;
            }
            callback(1, "Sending your request to Github")

            const xhr = new XMLHttpRequest();
            xhr.open("POST","https://api.github.com/repos/socrathematics/socrathematics.github.io/pulls");
            xhr.setRequestHeader("Authorization", `token ${d}`);
            xhr.onload = function(){
                callback(2, "Finished");
            }
            xhr.send(JSON.stringify(
                {
                    title: title,
                    head: from,
                    base: to,
                    body: body,
                    draft: draft,
                    maintainer_can_modify: true
                }
            ))

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}


function createBranch(branch, from="master",callback=function(step, message){console.log(step+":"+message)}){
    const user = auth.currentUser;
    //callback(0, "Grabbing your credentials")
    var docRef = db.collection(`users`).doc(user.uid);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data().gtoken;
            if (d == null) {
                console.log("User is not authorized.");
                callback(-1, "You have not provided any authorization.");
                return;
            }
            var xhr = new XMLHttpRequest();
            xhr.open("GET","https://api.github.com/repos/socrathematics/socrathematics.github.io/git/refs/heads");
            xhr.setRequestHeader("Authorization", `token ${d}`);
            xhr.setRequestHeader("Accept","application/vnd.github.v3+json");
            xhr.onload=function(){
                const data = JSON.parse(this.response);
                const masterhash = data.find(item => item.ref==="refs/heads/master").object.sha;
                var xhr2 = new XMLHttpRequest();
                xhr2.open("POST","https://api.github.com/repos/socrathematics/socrathematics.github.io/git/refs");
                xhr2.setRequestHeader("Authorization", `token ${d}`);
                xhr2.setRequestHeader("Accept","application/vnd.github.v3+json");
                xhr2.onload = function(){
                    callback(1,"Created branch.");
                }
                xhr2.send(JSON.stringify({
                    ref: "refs/heads/"+branch,
                    sha: masterhash
                }))

            }
            xhr.send();

        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

