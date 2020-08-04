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
function showTag(){
    const loc = window.getSelection().focusNode.parentNode;
    const tag = loc.tagName;
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

    if (tag[0]=="H"){
        document.querySelector("#headingInd").innerText="Heading "+tag[1];
    } else {
        document.querySelector("#headingInd").innerText="Normal Text"
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
})