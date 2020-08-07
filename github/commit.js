// this is FTP - pure gold
function commitFile(path,content,message="Adding course via uploader",branch="master",callback =function(step,message){console.log(step+" : "+message)}){ // aaah this was SUCH a pain to code...
    const user = auth.currentUser;
    var docRef = db.collection(`users`).doc(user.uid);
    callback(0, "Grabbing your credentials");
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data().gtoken;
            if (d==null){
                console.log("User is not authorized.");
                callback(-1, "You have not provided any authorization.");
                return;
            }

            var step1 = new XMLHttpRequest();
            step1.open("GET",`https://api.github.com/repos/socrathematics/socrathematics.github.io/git/refs/heads/${branch}`);
            callback(1, `Reading branch '${branch}'`);
            step1.setRequestHeader("Authorization", `token ${d}`);
            step1.onload = function () {
                console.log("===== STEP 1 =====")
                // Parse API data into JSON
                const data = JSON.parse(this.response);
                if (this.status === 404){callback(-1, "You are not authorized to commit this file!"); return;};
                console.log(data);
                const step2sha = data.object.sha;
                const step2url = data.object.url;
                //console.log(step2sha);console.log(step2url);
                var step2 = new XMLHttpRequest();
                callback(2, "Finding your tree");
                step2.open("GET",step2url);
                step2.setRequestHeader("Authorization", `token ${d}`);
                step2.onload = function (){
                    console.log("===== STEP 2 =====")
                    const data = JSON.parse(this.response);
                    console.log(data);
                    const step3commitsha = data.sha;
                    const step3treesha = data.tree.sha;
                    const step3treeurl  = data.tree.url;
                    var step3 = new XMLHttpRequest();
                    callback(3, "Posting your content to Github");
                    step3.open("POST",`https://api.github.com/repos/socrathematics/socrathematics.github.io/git/blobs`);
                    step3.setRequestHeader("Authorization", `token ${d}`);
                    step3.onload = function (){
                        console.log("===== STEP 3 =====")
                        const data = JSON.parse(this.response);
                        console.log(data);
                        const step4sha = data.sha;
                        var step4 = new XMLHttpRequest();
                        callback(4, "Figuring out where to put your file");
                        step4.open("GET",step3treeurl);
                        step4.setRequestHeader("Authorization", `token ${d}`);

                        step4.onload = function (){
                            console.log("===== STEP 4 =====")
                            const data = JSON.parse(this.response);
                            console.log(data);
                            const step5treesha = data.sha;
                            var step5 = new XMLHttpRequest();
                            callback(5, `Writing your file to ${path}`);
                            step5.open("POST","https://api.github.com/repos/socrathematics/socrathematics.github.io/git/trees");
                            step5.setRequestHeader("Authorization", `token ${d}`);

                            step5.onload = function (){
                                console.log("===== STEP 5 =====")
                                const data = JSON.parse(this.response);
                                console.log(data);
                                const step6treesha = data.sha;
                                var step6 = new XMLHttpRequest();
                                callback(6, `Signing the commit`);
                                step6.open("POST","https://api.github.com/repos/socrathematics/socrathematics.github.io/git/commits");
                                step6.setRequestHeader("Authorization", `token ${d}`);
                                step6.onload = function (){
                                    console.log("===== STEP 6 =====")
                                    const data = JSON.parse(this.response);
                                    console.log(data);
                                    const step7treesha = data.sha;
                                    var step7 = new XMLHttpRequest();
                                    callback(7, `Merging your changes`);
                                    step7.open("PATCH","https://api.github.com/repos/socrathematics/socrathematics.github.io/git/refs/heads/"+branch);
                                    step7.setRequestHeader("Authorization", `token ${d}`);
                                    step7.onload = function(){
                                        console.log("===== STEP 7 =====")
                                        const data = JSON.parse(this.response);
                                        console.log(data);
                                        // this is the END
                                        callback(8, `Finished.`);
                                    }
                                    step7.send(JSON.stringify({
                                        sha: step7treesha,
                                        force: false
                                    }))

                                }
                                step6.send(JSON.stringify({
                                    message: message,
                                    tree: step6treesha,
                                    parents: [step3commitsha]
                                }))
                            }
                            step5.send(JSON.stringify({
                                "base_tree": step3commitsha,
                                "tree": [
                                    {
                                        "path": path,
                                        "mode": "100644",
                                        "type": "blob",
                                        "sha": step4sha
                                    }
                                ]
                            }));
                        }
                        step4.send();
                    }
                    step3.send(JSON.stringify({
                        "content": content,
                        "encoding": "utf-8"
                    }));
                }
                step2.send();

            }
            step1.send();


        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");

        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}