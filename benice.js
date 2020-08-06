

var initialName = null;
var docRef;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        // get the query parameters if any, and display an error for invalid param value. If no param, then display an empty document with no name.
        // if doc exists, then import data from it! Also, update initialName to doc name. When user saves document and document exists but is not the same as
        // initialName, display a warning saying they are going to overwrite the doc.
        const urlParams = new URLSearchParams(window.location.search);
        const myParam = urlParams.get('import');
        const isReview = urlParams.get('review');
        if (myParam==null){
            //make a new document
            //document.querySelector('#docnameflat').value = ""
            db.collection(`users/${user.uid}/courses`).add(getComp())
                .then(function(docRef) {
                    //redirect user to ?q=docref.id
                    const params = new URLSearchParams(location.search);
                    params.set("import",docRef.id);
                    document.location  =  "?" + params.toString();

                })
                .catch(function(error) {
                    console.error("Error adding document: ", error);
                });

        }
        else {
            //try to access the document, depending on whether we are reviewing

            if (isReview==null || isReview != 0) {
                docRef = db.collection(`users/${user.uid}/courses`).doc(myParam);
            }
            else{
                docRef = db.collection(`queue/courses/review`).doc(myParam);
            }

            docRef.get().then(function(doc) {
                if (doc.exists) {
                    //import the data!
                    initialName = myParam;
                    //update the field as well - user should see doc name
                    document.querySelector('#docnameflat').value = (doc.data().name=="" ? "Untitled Document": doc.data().name);
                    document.title = doc.data().name;
                    importData(doc.data());
                    //console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    // display an error message, because user entered invalid param. Erase entire page.
                    document.querySelector("#all").innerHTML=`<div class="text-center"><h3>Invalid Document.</h3> <p>Make sure you're signed in.</p></div> `;
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        }
    } else {
        // No user is signed in.
        // do nothing.
    }
});


$('body').on('focus', '[contenteditable]', function() {
    const $this = $(this);
    $this.data('before', $this.html());
}).on('blur keyup paste input', '[contenteditable]', function() {
    const $this = $(this);
    if ($this.data('before') !== $this.html()) {
        $this.data('before', $this.html());
        $this.trigger('change');
    }
});
var n;
function showTag(){
    document.getElementById("uploadButton").innerHTML = "<i class=\"fas fa-cloud-upload-alt\"></i>";
    const loc = window.getSelection().focusNode.parentNode;

    //const tag = loc.tagName;
    const ls = window.getComputedStyle(loc);
    var tcol = ls["color"];
    if (tcol==""){tcol=loc.color};
    //console.log(ls);
    //if (tcol==""||tcol==undefined){tcol=loc.parentNode.color};
    //if (tcol==""||tcol==undefined){tcol=loc.parentNode.parentNode.color};
    if (tcol==""||tcol==undefined||tcol=="rgba(0,0,0,0)"){tcol="var(--text)"};
    document.getElementById("colorInd").style.textDecorationColor = tcol;
    if (tcol[0]=="#"){colorWheel.color.hexString = tcol;}else if (tcol==="var(--text)"){tcol=getComputedStyle(document.body)
        .getPropertyValue('--text');}else{
        colorWheel.color.rgbaString = tcol;};
    //console.log(tcol);
    var hcol = ls["background-color"];

    if (hcol==""||hcol==undefined||hcol[11]==0){hcol="var(--text)"};
    //console.log(hcol);
    document.getElementById("hcolorInd").style.color = hcol;
    if (hcol[0]=="#"){hcolorWheel.color.hexString = hcol;}else if (hcol==="var(--text)"){hcol=getComputedStyle(document.body)
        .getPropertyValue('--text');}else{
    hcolorWheel.color.rgbaString = hcol;};

    if (loc.matches("h1 ,h1")){
        document.querySelector("#headingInd").innerText="Heading 1";
    }
    else if (loc.matches("h2 *,h2")){
        document.querySelector("#headingInd").innerText="Heading 2";
    }
    else if (loc.matches("h3 *,h3")){
        document.querySelector("#headingInd").innerText="Heading 3";
    }
    else if (loc.matches("h4 *,h3")){
        document.querySelector("#headingInd").innerText="Heading 4";
    }
    else if (loc.matches("h5 *,h5")){
        document.querySelector("#headingInd").innerText="Heading 5";
    }
    else if (loc.matches("h6 *,h6")){
        document.querySelector("#headingInd").innerText="Heading 6";
    }else {
        document.querySelector("#headingInd").innerText="Normal Text"
    }


    var cont = $("#mainContent").html();
    cont = cont.replace(/<[^>]*>/g," ");
    cont = cont.replace(/\s+/g, ' ');
    cont = cont.trim();
    n = cont.split(" ").length;

    var al = ls["text-align"];
    if (al=="-moz-right"||al=="right"){
        $("[data-original-title='Right align']").removeClass("btn-light");$("[data-original-title='Right align']").addClass("btn-success");
        $("[data-original-title='Center align']").removeClass("btn-success");$("[data-original-title='Center align']").addClass("btn-light");
        $("[data-original-title='Left align']").removeClass("btn-success");$("[data-original-title='Left align']").addClass("btn-light");
        $("[data-original-title='Justify']").removeClass("btn-success");$("[data-original-title='Justify']").addClass("btn-light");
    }
    else if (al=="-moz-center"||al=="center"){
        $("[data-original-title='Center align']").removeClass("btn-light");$("[data-original-title='Center align']").addClass("btn-success");
        $("[data-original-title='Right align']").removeClass("btn-success");$("[data-original-title='Right align']").addClass("btn-light");
        $("[data-original-title='Left align']").removeClass("btn-success");$("[data-original-title='Left align']").addClass("btn-light");
        $("[data-original-title='Right align']").removeClass("btn-success");$("[data-original-title='Right align']").addClass("btn-light");
        $("[data-original-title='Justify']").removeClass("btn-success");$("[data-original-title='Justify']").addClass("btn-light");
    }
    else if (al=="justify"){
        $("[data-original-title='Justify']").removeClass("btn-light");$("[data-original-title='Justify']").addClass("btn-success");
        $("[data-original-title='Center align']").removeClass("btn-success");$("[data-original-title='Center align']").addClass("btn-light");
        $("[data-original-title='Right align']").removeClass("btn-success");$("[data-original-title='Right align']").addClass("btn-light");
        $("[data-original-title='Left align']").removeClass("btn-success");$("[data-original-title='Left align']").addClass("btn-light");
    }
    else {
        $("[data-original-title='Left align']").removeClass("btn-light");$("[data-original-title='Left align']").addClass("btn-success");
        $("[data-original-title='Center align']").removeClass("btn-success");$("[data-original-title='Center align']").addClass("btn-light");
        $("[data-original-title='Right align']").removeClass("btn-success");$("[data-original-title='Right align']").addClass("btn-light");
        $("[data-original-title='Justify']").removeClass("btn-success");$("[data-original-title='Justify']").addClass("btn-light");
    }


}

document.querySelector("#mainContent").addEventListener("click",(e)=>{
    showTag()
});
document.querySelector("#mainContent").addEventListener("keyup",(e)=>{
    showTag()
});
document.querySelector("#ctitle").addEventListener("keydown",(e)=>{
    showTag()
});
document.querySelector("#ctitle").addEventListener("click",(e)=>{
    showTag()
});


$('#tcolordiv button').on('click', function (event) {
    $(this).parent().toggleClass('show');
    $('#tcolordiv .dropdown-menu').toggleClass("show");

});

$('body').on('click', function (e) {
    if (!$('#tcolordiv').is(e.target)
        && $('#tcolordiv').has(e.target).length === 0
        && $('.show').has(e.target).length === 0
    ) {
        $('#tcolordiv').removeClass('show');
        $('#tcolordiv .dropdown-menu').removeClass("show");

    }
});

$('#hcolordiv button').on('click', function (event) {
    $(this).parent().toggleClass('show');
    $('#hcolordiv .dropdown-menu').toggleClass("show");

});

$('body').on('click', function (e) {
    if (!$('#hcolordiv').is(e.target)
        && $('#hcolordiv').has(e.target).length === 0
        && $('.show').has(e.target).length === 0
    ) {
        $('#hcolordiv').removeClass('show');
        $('#hcolordiv .dropdown-menu').removeClass("show");

    }
});

var colorWheel = new iro.ColorPicker("#colorWheel", {
    width: 150,
    color: '#000',
    id: "tcolorpicker",
    layoutDirection: "vertical",
    borderWidth: 0,
    borderColor: '#fff',

    // space between handles
    padding: 4,

    // radius of handles
    handleRadius: 5,

    // Custom handle SVG
    //handleSvg: null,

    // custom handle props
    handleProps: {
        x: 0,
        y: 0
    },
    // fade to black when the lightness decreases
    wheelLightness: true,
    // starting angle
    wheelAngle: 0,
    // clockwise/anticlockwise
    wheelDirection: 'anticlockwise',

    sliderMargin: 12
});


var c;
colorWheel.on('input:end', function(color){
    // when the user has finished interacting with the color picker, the callback gets passed the color object
    c = color.hexString;
    //console.log(c);
    const loc = window.getSelection().focusNode.parentNode;
    if (document.querySelector("#bod2").contains(loc)){
        document.execCommand("forecolor", false, c);
        document.getElementById("colorInd").style.textDecorationColor = c;
    }
})


var hcolorWheel = new iro.ColorPicker("#hcolorWheel", {
    width: 150,
    color: '#000',
    id: "hcolorpicker",
    layoutDirection: "vertical",
    borderWidth: 0,
    borderColor: '#fff',

    // space between handles
    padding: 4,

    // radius of handles
    handleRadius: 5,

    // Custom handle SVG
    //handleSvg: null,

    // custom handle props
    handleProps: {
        x: 0,
        y: 0
    },
    // fade to black when the lightness decreases
    wheelLightness: true,
    // starting angle
    wheelAngle: 0,
    // clockwise/anticlockwise
    wheelDirection: 'anticlockwise',

    sliderMargin: 12
});

var hc;
hcolorWheel.on('input:end', function(color){
    // when the user has finished interacting with the color picker, the callback gets passed the color object
    hc = color.hexString;
    //console.log(c);
    const loc = window.getSelection().focusNode.parentNode;
    if (document.querySelector("#bod2").contains(loc)){
        document.execCommand("hiliteColor", false, hc);
        document.getElementById("hcolorInd").style.color = hc;
    }
});

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

const protips = ["Copy and paste content directly from another course or website!",
    "Use the link tool to fully customize your navigation bar, right from the editor!",
    "Use the code editor for extra customization - the possibilities are endless!",
    "Hit the <i class='fas fa-eye'></i> button for a live preview of your course!"
];

//document.querySelector(".toast-body").innerHTML = protips[getRndInteger(0,protips.length)]