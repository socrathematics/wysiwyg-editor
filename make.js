var pnum = 1;
function initfield(num,numname,answers){
    //number num
    var answerSpan = document.getElementById('answer'+num);// get the box

    var answerMathField = MQ.MathField(answerSpan, {
        handlers: {
            edit: function() {
                var enteredMath = answerMathField.latex(); // Get entered math in LaTeX format
                correct = checka(enteredMath,num,answers); //display green check if correct
            }
        }
    });
    return answerMathField;
}
//to check the answers!
function checka(l,n, answers){
    if (answers.includes(l)){
        document.getElementById("answer"+n).style.color="var(--success)";
        document.getElementById("tu"+n).style.display="inline";
        return true
    }
    else{document.getElementById("answer"+n).style.color="var(--dark)";
        document.getElementById("tu"+n).style.display="none";
        return false
    }
}
const copyht = new ClipboardJS('#copyAll',{
    text: function(trigger) {
       const  n= compile()
    return "<html><head>"+n[0]+"</head><body>"+n[1]+"</body>";
    }
});
copyht.on('success', function(e) {
    $('#copyAll').tooltip('show');
    setTimeout(function() {
        $('#copyAll').tooltip('hide');
    }, 800);
});

function preview(){
    const data = compile(false);
    localStorage.setItem("head",data[0].replace(`<script src="/menu.js"></script>`,""));
    localStorage.setItem("body",data[1]);
    var ref = window.open("preview.html", "prev_window");
}

function save(){
    const dump = compile();
    var blob = new Blob([dump], {type: "text/html"});
    saveAs(blob, `${document.getElementById("ctitle").innerText}.html`);
}

function addProb() {
document.execCommand("insertHTML",false,`<li class="card card-body no-def my-3 pop">

    <p>$\\displaystyle{ x = }$ ## latex of answer here ## </p>
            <!--Hints--><details><summary class="btn btn-outline-success btn-sm mt-2">Hint</summary> <p>Hint one</p></details>
            <details><summary class="btn btn-outline-success btn-sm mt-2">Hint</summary><p>Hint two</p></details>
            <!--Solution--><details><summary class="btn btn-sm btn-outline-success mt-2">Show/Hide Solution</summary>
                <p>Solution</p>
        </details>
        </li>
        <p>`); //pnum+=1;
}
//Download data as json
function getComp(){
    RemoveMJ()
    const c =  {
        name: document.getElementById("docnameflat").value,
        titleText: document.getElementById("ctitle").innerText,
        navHTML: document.querySelector("#main .col-sm-3").innerHTML,
        titleHTML: document.getElementById("ctitle").innerHTML,
        bnavHTML: document.getElementById("bottomNav").innerHTML,
        mainHTML: document.getElementById("mainContent").innerHTML,
        prevText: document.getElementById("mainContent").textContent.substring(0,50)+"..."
    };
    ToggleMJ();
    return c
}
//this works!
function importData(c) {
    document.querySelector("#main .col-sm-3").innerHTML = c.navHTML;
    document.getElementById("ctitle").innerHTML = c.titleHTML;
    document.getElementById("bottomNav").innerHTML = c.bnavHTML;
    document.getElementById("mainContent").innerHTML = c.mainHTML;
    isTypeset=false;
    ToggleMJ();
}
//get document id from user. do this while modal is still open to give errors. show document id above toolbar.
function upload(){
    const user = auth.currentUser;
    const c = getComp();
    docRef.update(c).then(function() {
        console.log("Document successfully written!");
        document.getElementById("uploadButton").innerHTML = "<i class=\"fas text-success fa-check-circle\"></i>";
    })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });

}

function incPnum(){
    pnum++;
    return pnum;
}


//compile data - if none is given, get from document. this works.
function compile(comp= {},fire=true){
    RemoveMJ();
    const titleText = comp.titleText||document.getElementById("ctitle").innerText;
    const navHTML = comp.navHTML||document.querySelector("#main .col-sm-3").innerHTML;
    const titleHTML = comp.titleHTML ||document.getElementById("ctitle").innerHTML;
    const bnavHTML = comp.bnavHTML ||document.getElementById("bottomNav").innerHTML;
    const mainHTML = comp.mainHTML || document.getElementById("mainContent").innerHTML;
    ToggleMJ();
    return [`
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
<script src="https://kit.fontawesome.com/30a0cbcf71.js" crossorigin="anonymous"></script>   
<link rel="icon" href="/favicon.png">
<link rel="stylesheet" href="/mathquill-0.10.1/mathquill.css"/>
    <script src="/mathquill-0.10.1/mathquill.js"></script>
    <script src="/check.js"></script>
    <link rel="stylesheet" href="/fonts.css">
    <link rel="stylesheet" href="/header.css">
    <link rel="stylesheet" href="/style.css">
    <script>
        var MQ = MathQuill.getInterface(2);

    </script>
              <!--mathjax-->
  <script>
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\\\(', '\\\\)']]
  }
};
</script>
<script src="/menu.js"></script>
  <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"> </script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"> </script>
`,`
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PF58PDC"
                  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->


<div class="container" style="margin-top:30px">
    <div class="row" id="main">
    <div  class="col-sm-3">${navHTML.replaceAll(`contenteditable=""`,"")}</div>
        

        <div class="col-sm-8" id="bod2" >

            <div>
                <h2>${titleHTML}</h2>
                ${mainHTML.replace( /##(((?!##).)*)##/sg, `<span id=\"answer${incPnum()}\" class=\"form-control-sm or answerb\"></span><svg id=\"tu${pnum}\" class=\"bi bi-hand-thumbs-up\" width=\"2em\" height=\"2em\" style=\"display:none\" viewBox=\"0 0 16 16\" fill=\"var(--success)\" xmlns=\"http://www.w3.org/2000/svg\"><path fill-rule="evenodd"
        d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg><script>initfield(${pnum},"", ["$1"])</script>`)}

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
`];
}