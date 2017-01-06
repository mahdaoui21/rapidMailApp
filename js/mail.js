// Ajouter l'événement click au bouton


/**
 * Ajoute une ligne à la fin du tbody de la table
 */
function ajouterLigne(){



    var object= document.getElementById('object').value;
    var message= document.getElementById('message').value;
    var etat=document.getElementsByName('entree');
    if(etat[0].checked) etat = "Urgent";
    else etat = "Normal";
    if(object != "" && message != "")
    addTODB(object, message, etat);

    else alert("Veillez Remplir tout les champs")

}

/**
 * Crée un élément tr (ligne du tableau)
 * @param  object string : L'objet du message à extraire de la zone de texte
 * @param  message string : le message à extraire de la zone de texte
 * @param etat string : Normal ou Urgent
 * @return HTMLTableRowElement : Elément de type tr prêt à être inséré dans le tableau.
 */
function creerLigne(key,object, message, etat){
    var row = document.createElement('tr');
    var td= document.createElement('td');
    row.setAttribute('id',key);
    var tdcheckbox = td.cloneNode(true);
    var checkbox = document.createElement('input');
    checkbox.setAttribute('type','checkbox');
    checkbox.setAttribute('id','rowSelect');
    tdcheckbox.appendChild(checkbox.cloneNode(true));
    var tdobejct = td.cloneNode(true);
    var tdmsg = td.cloneNode(true);
    var tdetat= td.cloneNode(true);
    var p= document.createElement('p');
    var pobject = document.createTextNode(object);
    var pmessage= document.createTextNode(message);
    var petat=document.createTextNode(etat);
    tdobejct.appendChild(p.cloneNode(true).appendChild(pobject));
    tdmsg.appendChild(p.cloneNode(true).appendChild(pmessage));
    tdetat.appendChild(p.cloneNode(true).appendChild(petat));
    var supprBtn = document.createElement('button');
    supprBtn.classList = "btn btn-danger ";
    supprBtn.setAttribute('style','margin : 5px;align:right');
    supprBtn.setAttribute('id','suppr');
    supprBtn.appendChild(document.createTextNode("Supprimer"))
    supprBtn.addEventListener('click',function(){

        supprimerLigne(this.parentNode.parentNode);
    });

    tdetat.appendChild(supprBtn);
    row.appendChild(tdcheckbox);
    row.appendChild(tdobejct);
    row.appendChild(tdmsg);
    row.appendChild(tdetat);

    return row;
}

/**
 * Supprime une ligne
 * @param tr HTMLTableRowElement : La ligne qu'on veut supprimer
 */
function supprimerLigne(tr){


    defaultDatabase.ref('messages/'+tr.id).remove();
}

/**
 * Supprime toutes les lignes sélectionnées
 */
function supprimerLesLignesSelectionnees(){
    var selectedCheckbox = document.querySelectorAll('#rowSelect');
    for(var i = 0;i<selectedCheckbox.length;i++){
        if(selectedCheckbox[i].checked)
            supprimerLigne(selectedCheckbox[i].parentNode.parentNode);
    }
}

var button = document.querySelector('#add');
button.addEventListener('click',function(){
        ajouterLigne();
    });
var selectAll =  document.querySelector('#selectAll');
selectAll.addEventListener('click',function(){
    var rowSelect = document.querySelectorAll('#rowSelect');
    for (var i =0; i < rowSelect.length;i++){
        if(rowSelect[i].checked==false)
        rowSelect[i].checked=true;
        else rowSelect[i].checked=false;
    }
});
var deleteSelection = document.querySelector('#deleteSelection');
deleteSelection.addEventListener('click',function(){
    supprimerLesLignesSelectionnees();
});
var defaultDatabase = fb.database();
function addTODB(object, message, etat){

    defaultDatabase.ref('messages/').push({
        objet : object,
        msg : message,
        etat : etat
    })
}
defaultDatabase.ref('messages').on('child_added',function(snap){//console.log('Child Added',snap.val(),snap.key)
    var msg = snap.val();
    var row=creerLigne(snap.key,msg.objet,msg.msg,msg.etat);
    var tbody =  document.querySelector('tbody');
    tbody.append(row);
})
defaultDatabase.ref('messages').on('child_removed',function(snap){
    var msg= snap.val();
    document.querySelector('#'+snap.key).remove();
})