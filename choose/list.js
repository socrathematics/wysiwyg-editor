

function createPreview(c,k,norev=true,acc=false,dis=false){
    return `<div class="card no-def" style="max-width:20rem;min-height:14rem">

            <div class="card-body" id="${k}-card" >
            ${!dis? `
                <div class="dropright">
                    <a class="px-2  cursor-pointer float-right"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v cursor-pointer"></i>
                    </a>
                    <div class="dropdown-menu cursor-pointer" style="min-width: 0px">
                        ${dis? ``:`<a class="dropdown-item" onclick="window.open('../?import=${k}','_blank')" ><i class="fas fa-external-link-alt mr-2"></i> Open</a>`}
                        ${norev||acc? `<a class="dropdown-item" onclick="removeDoc('${k}')" ><i class="fas fa-trash-alt mr-2"></i> Delete</a>` : ``}
                        ${!acc? `<a class="dropdown-item" onclick="sendForReview('${k}')"><i class="fas fa-paper-plane mr-2"></i> ${norev? `Submit`: `Resubmit`}</a>`: ``}
                    ${acc? `<a class="dropdown-item" onclick="startCommit('${k}')"><i class="fas fa-check mr-2"></i> Publish</a>` : ``}
                    </div>
                </div>` : ``}
                <h4 class="text-success card-title"><a ${!dis? `href="../?import=${k}"` : ``} class="link">${c.name}</a></h4>
                <h5 class="card-title">${c.titleHTML}</h5>
                <p class="card-text">${c.prevText}</p>
                <a href="../?import=${k}"  class="${dis? "disabled":""} btn btn-success text-light">Open</a>
            </div>
        </div>`
}
cardHolder =document.getElementById("cardHolder");
rCardHolder =document.getElementById("rCardHolder");
aCardHolder =document.getElementById("aCardHolder");
sCardHolder =document.getElementById("sCardHolder");

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        db.collection(`users/${user.uid}/courses`)
            .onSnapshot(function(col) {
                cardHolder.innerHTML ="";
                rCardHolder.innerHTML="";
                aCardHolder.innerHTML ="";
            sCardHolder.innerHTML ="";
                col.docs.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().purpose==="review") {
                        rCardHolder.innerHTML += createPreview(doc.data(), doc.id, false);
                    }
                    else if (doc.data().purpose==="accept") {
                        aCardHolder.innerHTML += createPreview(doc.data(), doc.id, false,true);
                    }
                    else if (doc.data().purpose==="sent") {
                        sCardHolder.innerHTML += createPreview(doc.data(), doc.id, true,false,true);
                    }
                    else {
                        cardHolder.innerHTML += createPreview(doc.data(), doc.id);
                    }
                    //console.log(doc);
                });
                if(rCardHolder.innerHTML===""){rCardHolder.innerHTML=`<div class="text-center">
                <p class="h5 text-main">Nothing yet!</p></div>
        </div>`}
                if(aCardHolder.innerHTML===""){aCardHolder.innerHTML=`<div class="text-center">
                <p class="h5 text-main">Nothing yet!</p></div>
        </div>`}
                if(sCardHolder.innerHTML===""){sCardHolder.innerHTML=`<div class="text-center">
                <p class="h5 text-main">Nothing yet!</p></div>
        </div>`}
            
            });
    } else {
        document.location = "../";
    }
});

function removeDoc(dn){
    const user = auth.currentUser;
    db.doc(`users/${user.uid}/courses/${dn}`).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}


function sendForReview(dn){
    const user = auth.currentUser;
    var docRef = db.doc(`users/${user.uid}/courses/${dn}`);

    docRef.get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data();

            d.author = {photoURL:user.photoURL, displayName: user.displayName, uid: user.uid};
            d.time = new Date();
            d.status = "pending";
            db.doc(`queue/courses/review/${dn}`).set(d);
            db.doc(`users/${user.uid}/courses/${dn}`).update({purpose:"sent"});
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function startCommit(dn){
    document.getElementById("commit-button").onclick= function(){commitCourse(dn)};
    getBranches(function(data){
        const cont = document.querySelector("#blist");
        cont.innerHTML = "";
        for (var k in Object.keys(data)){
            let n =document.createElement("OPTION");
            cont.appendChild(n);
            n.innerText  = data[k].name;
            n.value = data[k].name;

        }
        cont.value="master"
    })
    $("#commitModal").modal("show");


}

function commitCourse(dn){
    // verify that the path is given
    const path = document.getElementById("commit-path").value.trim().replaceAll(" ","-");
    const message = document.getElementById("commit-ms").value.trim();
    const branch = document.getElementById("commit-branch").value;
    if (message===""){
        document.getElementById("cm-e").innerText = "You must provide a commit message."
        return;
    }
    if (path==="") {
        // if not, display error and return.
        document.getElementById("cm-e").innerText = "You must specify a path for the file."
        return;
    }
    else if (path.substring(path.length-5)!==".html") {
        // if not, display error and return.
        document.getElementById("cm-e").innerHTML = "Your path must end in '.html'. <br> For example, for a course to show up at calculus/limits, type 'calculus/limits/index.html'."
        return;
    }
    else if (path.substring(0,1)==="/") {
        // if not, display error and return.
        document.getElementById("cm-e").innerHTML = "Do not begin your paths with a /. All paths are absolute by default."
        return;
    } else {
        // if it is, close the modal.
        document.getElementById("commitProgress").style.width = "0%";
        document.getElementById("commitStatus").innerHTML = "";
        const pbar = $("#commitProgress");
        pbar.removeClass("bg-danger");
        pbar.addClass("bg-success");
        $("#cstatModal").modal("show");
        $("#commitModal").modal("hide");
        console.log(dn);

    }
    // get the data from the file
    const user = auth.currentUser;
    var docRef = db.doc(`users/${user.uid}/courses/${dn}`);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            var d = doc.data();
            // compile it
            //console.log(d);
            const ht = compileHTML(d, true); //make sure to use firebase

            var branchExists=false;
            getBranches(function (data) {
                for (k in Object.keys(data)){
                    if (k.name===branch){
                        branchExists=true;
                    }
                }
            })
            if (!branchExists){
                createBranch(branch, undefined,function () {
                    commitFile(path, ht, message, branch, function(step, message){

                        document.getElementById("commitProgress").style.width = step/7 * 100 + "%";
                        document.getElementById("commitStatus").innerHTML = message + "...";
                        if (step === 8){
                            $("#cstatModal").modal("hide");
                            if (branch !== "master"){
                                //ask user if they want a pull request by bringing up the modal for it, and adding the onclick.
                                // define the onclick elsewhere.
                                document.querySelector("#pullModal .btn-success").onclick = function(){startPull(branch)} //if they say yes, then you open the optioons
                                $("#pullModal").modal("show");
                            }
                        }
                        if (step === -1){
                            const pbar = $("#commitProgress");
                            pbar.removeClass("bg-success");
                            pbar.addClass("bg-danger");
                        }
                    });
                })
            }
        else{
                commitFile(path, ht, message, branch, function(step, message){

                    document.getElementById("commitProgress").style.width = step/7 * 100 + "%";
                    document.getElementById("commitStatus").innerHTML = message + "...";
                    if (step === 8){
                        $("#cstatModal").modal("hide");
                        if (branch !== "master"){
                            //ask user if they want a pull request by bringing up the modal for it, and adding the onclick.
                            // define the onclick elsewhere.
                            document.querySelector("#pullModal .btn-success").onclick = function(){startPull(branch)} //if they say yes, then you open the optioons
                            $("#pullModal").modal("show");
                        }
                    }
                    if (step === -1){
                        const pbar = $("#commitProgress");
                        pbar.removeClass("bg-success");
                        pbar.addClass("bg-danger");
                    }
                });
            }
            // commit it.

            /*
            * */
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

}

function startPull(br){
    //if the user says yes, (they did)
//add the onclick to the publish button, and show the modal with the form.
    document.querySelector("#cPullModal .btn-success").onclick = function(){pullCourse(br)};
    $("#pullModal").modal("hide");
    $("#cPullModal").modal("show");
}

function pullCourse(br){
//get all the info, if anything is wrong display a message and return. else, close modal, open new, and open the pull request.
    document.getElementById("cpull-e").innerHTML = "";
    const t = document.getElementById("c-pull-title").value.trim();
    const b = document.getElementById("c-pull-body").value.trim();
    const d = document.getElementById("cpull-draft").checked;
    if (t===""){
        document.getElementById("cpull-e").innerHTML = "You must specify a title."
    }


    document.getElementById("commitProgress").style.width = "0%";
    document.getElementById("commitStatus").innerHTML = "";
    const pbar = $("#commitProgress");
    pbar.removeClass("bg-danger");
    pbar.addClass("bg-success");
    $("#cPullModal").modal("hide");
    $("#cstatModal").modal("show");
    createPull(t,br,"master",b,d,function (step,message) {
        document.getElementById("commitProgress").style.width = step/7 * 100 + "%";
        document.getElementById("commitStatus").innerHTML = message + "...";
        if (step === -1){
            const pbar = $("#commitProgress");
            pbar.removeClass("bg-success");
            pbar.addClass("bg-danger");
        }
        if (step===2){
            $("#cstatModal").modal("hide");
        }
    })
}

function compileHTML(comp,fire=true){
    const titleText = comp.titleText;
    const navHTML = comp.navHTML;
    const titleHTML = comp.titleHTML;
    const bnavHTML = comp.bnavHTML;
    const mainHTML = comp.mainHTML;
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-163408633-2"/>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());

        gtag('config', 'UA-163408633-2');
    </script>
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-PF58PDC');</script>
    <!-- End Google Tag Manager -->
    <title>${titleText}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="apple-mobile-web-app-title" content="SOCRATHEMATICS">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="#28a745">
     <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" integrity="sha384-9aIt2nRpC12Uk9gS9baDl411NQApFmC26EwAOH8WgZl5MYYxFfc+NcPb1dKGj7Sk" crossorigin="anonymous"/>
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
<script src="https://kit.fontawesome.com/30a0cbcf71.js" crossorigin="anonymous"></script> <link rel="icon" href="/favicon.png"/>
    <link rel="stylesheet" href="/fonts.css"/>
    <link rel="stylesheet" href="/header.css"/>
    <link rel="stylesheet" href="/style.css"/>
              <!--mathjax-->
  <script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]
  }
};
</script>

  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"> </script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"> </script>
</head><body>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PF58PDC"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
<script src="/menu.js"></script>

<div class="container" style="margin-top:30px">
    <div class="row" id="main">
    <div  class="col-sm-3">${navHTML.replaceAll(`contenteditable=""`,"")}</div>
        

        <div class="col-sm-8" id="bod2" >

            <div>
                <h2>${titleHTML}</h2>
                ${mainHTML}

<div style="height:7vh"></div>
<nav>${bnavHTML.replaceAll(`contenteditable=""`,"")}</nav>
                
            </div>
        </div>
    </div>
</div>
${fire? `
<!-- The core Firebase JS SDK is always required and must be listed first -->
<script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script>

<!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->

<script  src="https://www.gstatic.com/firebasejs/7.15.1/firebase-analytics.js"></script>
<script  src="https://www.gstatic.com/firebasejs/7.15.0/firebase-auth.js"></script>
<script  src="https://www.gstatic.com/firebasejs/7.15.0/firebase-firestore.js"></script>

<script>
    // Your web app's Firebase configuration
    var firebaseConfig = {
        apiKey: "AIzaSyA6bA3PlHiFGHB1CIWobuBUsEa9IQ7AL3I",
        authDomain: "socrathematics.firebaseapp.com",
        databaseURL: "https://socrathematics.firebaseio.com",
        projectId: "socrathematics",
        appId: "1:809638401187:web:9608adf73f25ced6d45b16",
        measurementId: "G-2QEQZPCEZR"

    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();

    const auth=firebase.auth();
    const db = firebase.firestore();
</script>
<script src="/auth/auth.js"></script>`: ''}

</body>
</html>
`;
}


