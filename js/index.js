var notesList = [];
var saveAction = 1;

function clearForm(){
    document.getElementById('newNoteModalLabel').innerText = 'New Note'; //this is for modal(the box that pops up when you click on Add button)
    document.getElementById('newNoteTitle').value = ""; //everytime you clock the Add button, it will empty the value of Title box where you fill up
    document.getElementById('newNoteBody').value = ""; //same concept as the above
}

function loadNotes() {
    axios //axios is promise base. I find this cleaner than Jquery.. && 2020 is around the corner, who uses Jquery? lolz!
    .get('/api/notes')
    .then(function(result) {
        // console.log(result); //TIP: comment on the console log and load the app note in the browser and open dev tools to see the Obj data in console.

        //render notes
        listNotes(result.data); //result.data are the data in array you will get in chrome dev tools. This is predefined.
    })
    .catch(function(error){//this is for catching error
        console.log(error);
    });
}

function listNotes(notes) {
    if(!notes || notes.length < 1) //if there are no notes(in JSON and consequently in Front End), we will pass an innerHTML as in text 'Failed to load notes'
        return document.getElementById('notes').innerHTML = 'Note App is empty';

    notesList = notes;//we have to store the notes inside the notesList and keep there. see line 1 above.

    $('#notes').html(""); //call the notes class and replace the html texts to empty. This is to reset our inputs because we are appending. See line 56.
    //To understand the code above, comment it out and add a new note in the browser. Ensure that you refreshed the page before adding a new note.

    notes
    .filter(function(note){
        return !note.isDeleted; //filter is a higher order function that will return an array base on the condition you passed on the return. This line will return isDeleted that has a value of false. Remember that isDelete = true means it is deleted in the front end but still record in notes.json.
    })
    .forEach(function(note) { //this will loop each of the value of the array that is isDelete=true. Think about it like this, say you have 2 notes you can see in the front-end. The html below will be created twice
        var notediv =
        `<div class="col-12 col-md-6">
            <div class="card text-white bg-secondary mb-3 border-dark">
                <div class="card-body">
                    <h3 class="card-title">${note.title}
                        <button type="button" class="close" aria-label="Close" onclick="deleteNote(${note.id})">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </h3>
                    <hr/>

                    <p class="card-text">${note.body}</p>
                    <button type="button" class="btn btn-primary" onclick="editNote(${note.id})">Edit</button>
                </div>
            </div>
        </div>
        `;
      

        $('#notes').append(notediv);//append is a jquery method same as .push in javascript
    });
}

function editNote(id) {
    var note = getNote(id);
    saveAction = 2; //1 = add, 2 = update
    document.getElementById('newNoteModalLabel').innerText = 'Edit Note';
    document.getElementById('noteId').value = id;
    document.getElementById('newNoteTitle').value = note.title;
    document.getElementById('newNoteBody').value = note.body;

    $('#noteNoteModal').modal('show');
}

function deleteNote(id) {
    var note = getNote(id);

    if(note && confirm("Confirm delete ''" + note.title + "'?")) {
        console.log('ID: ', id);
        axios
            .delete('/api/notes?id='+id)
            .then(function(result){
                console.log(result);
                loadNotes();
            });
    }
}

function getNote(id) {
    return notesList.find(function(n) {
        return n.id == id;
    });
}

function saveNote() {

    if(saveAction == 2)
        var id = document.getElementById('noteId').value;

    const data = {
        'title': document.getElementById('newNoteTitle').value.trim(), //.trim() is to remove the whitespace
        'body': document.getElementById('newNoteBody').value.trim()
    };

    if(data.title == '' || data.body == "") {
        return alert("invalid inputs.");
    }

    const options = { //google what you pass to .json({}) to fully understand the below. You will pass this as an argument to your axios.
        method: saveAction==1? 'POST' : 'PUT', //ternary operator, if saveAction is equal to 1, the method will be POST if false it will be PUT
        headers: { 'content-type': 'application/json' },
        data: JSON.stringify(data),
        url: saveAction==1? '/api/notes': '/api/notes?id='+id,
    };

    axios(options)
        .then(function(response){
            loadNotes();
            $('#noteNoteModal').modal('hide');
        })
        .finally(function(){
            saveAction = 1;
            document.getElementById('newNoteModalLabel').innerText = 'New Note';
        });
}



//Check this link to know when do you need axios https://dev.to/fleepgeek/when-do-you-need-axios-d