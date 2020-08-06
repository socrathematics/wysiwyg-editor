
//need to add support in wysiwyg editor for "review" param. When this is set,
function createPreview(c,k){
    return `<div class="card no-def" style="min-width:18rem;min-height:14rem">

            <div class="card-body" id="${k}-card" >
                <div class="dropright">
                    <a class="px-2  cursor-pointer float-right"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v cursor-pointer"></i>
                    </a>
                    <div class="dropdown-menu cursor-pointer" style="min-width: 0px">
                        <a class="dropdown-item" onclick="window.open('../?import=${k}&review=0','_blank')" ><i class="fas fa-external-link-alt mr-2"></i> Open</a>
                    <a class="dropdown-item" onclick="returnCourse('${k}')" ><i class="fas fa-reply mr-2"></i> Return</a>
                    <a class="dropdown-item" onclick="acceptCourse('${k}')" ><i class="fas fa-check mr-2"></i> Accept</a>
                    </div>
                </div>
                <h4 class="text-success card-title"><a href="../?import=${k}&review=0" class="link">${c.name}</a></h4>
                <h6 class="card-subtitle text-muted"><img class="rounded-circle mr-2" height="20rem" src="${c.author.photoURL}"/>${c.author.displayName}</h6>
                <hr/>
                <h5 class="card-title">${c.titleHTML}</h5>
              
                <p class="card-text">${c.prevText}</p>
                <a href="../?import=${k}&review=0"  class=" btn btn-success text-light">Open</a>
            </div>
        </div>`
}
cardHolder =document.getElementById("cardHolder");
cardHolder.innerHTML ="";

        db.collection(`queue/courses/review`)
            .onSnapshot(function(col) {
                cardHolder.innerHTML ="";
                col.docs.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    if (doc.data().status === "pending"){
                    cardHolder.innerHTML += createPreview(doc.data(),doc.id);}
                    //console.log(doc);
                });
            });


function removeDoc(dn){
    const user = auth.currentUser;
    db.doc(`users/${user.uid}/courses/${dn}`).delete().then(function() {
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

//s means submitted for review. r means reviewed. c means committed.
function returnCourse(dn){
    db.doc(`queue/courses/review/${dn}`).get().then(function(doc) {
        if (doc.exists) {
            let dat = doc.data();
            const dest = dat.author.uid;
            dat.purpose = "review";
            dat.qsrc=doc.id;
            db.doc(`users/${dest}/courses/${dn}`).update(dat); //putting it right where it came from, with a new status
            //this will automatically show up in the user's feed.
            db.doc(`queue/courses/review/${dn}`).update({status:"returned"});
        }
        else{
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}

function acceptCourse(dn){
    db.doc(`queue/courses/review/${dn}`).get().then(function(doc) {
        if (doc.exists) {
            let dat = doc.data();
            const dest = dat.author.uid;
            dat.purpose = "accept"; //mark it as accepted
            dat.qsrc=doc.id; //mark where it came from so user can resubmit.
            db.doc(`users/${dest}/courses/${dn}`).update(dat);//put it where it came from, might overwrite some stuff
            //this will automatically show up in the user's feed.
            db.doc(`queue/courses/review/${dn}`).update({status:"accepted"});
        }
        else{
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
}