

function createPreview(c,k){
    return `<div class="card no-def" style="max-width:18rem;min-height:14rem">

            <div class="card-body" id="${k}-card" >
                <div class="dropdown">
                    <a class="  cursor-pointer float-right"  data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <i class="fas fa-ellipsis-v text-muted cursor-pointer"></i>
                    </a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" onclick="window.open('../?import=${k}','_blank')" ><i class="fas fa-external-link-alt mr-2"></i> Open</a>
                        <a class="dropdown-item" onclick="removeDoc('${k}')" ><i class="fas fa-trash-alt mr-2"></i> Delete</a>
                    <!--<a class="dropdown-item" ><i class="fas fa-download mr-2"></i> Download</a>-->
                    </div>
                </div>
                <h4 class="text-success card-title"><a href="../?import=${k}" class="link">${c.name}</a></h4>
                <h5 class="card-title">${c.titleHTML}</h5>
                <p class="card-text">${c.prevText}</p>
                <a href="../?import=${k}"  class=" btn btn-success text-light">Open</a>
            </div>
        </div>`
}
cardHolder =document.getElementById("cardHolder");
cardHolder.innerHTML ="";
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        /*db.collection(`users/${user.uid}/courses`).get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                // doc.data() is never undefined for query doc snapshots
                cardHolder.innerHTML += createPreview(doc.data(),doc.id);
                //console.log(doc);
            });
        });*/
        db.collection(`users/${user.uid}/courses`)
            .onSnapshot(function(col) {
                cardHolder.innerHTML ="";
                col.docs.forEach(function(doc) {
                    // doc.data() is never undefined for query doc snapshots
                    cardHolder.innerHTML += createPreview(doc.data(),doc.id);
                    //console.log(doc);
                });
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




