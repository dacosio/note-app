var express = require('express');
var router = express.Router();
const Note = require('../models/note');
const NoteService = require('../services/note.service');

const noteService = new NoteService(); // to use the class declared in notes.services (Add,Edit,Delete,List,SaveChanges)

router.get('/', function (req, res) { //this will show all the saved lists of notes on 127.0.0.1:3000/ or 127.0.0.1 (remember .redirect on app.js line 26)
    res.json(noteService.List());
});

// router.get('/:id', function(req, res) {

//     var id = req.params.id

//     if(!id)
//         throw new Error("invalid id");

//     var note = noteService.Get(id);

//     if(!note)
//         res.status(404).end();
//     else
//         res.json(note);
// });

router.post('/', function (req, res) { //post is for ADDING a note. 

    var obj = req.body; //this will capture the body that you want to pass to the JSON file (title: and body:). Refer to notes.js

    if(!obj) //add(note) will throw an error if title and body were left blank
        throw new Error("invalid data");

    var note = new Note(obj.title, obj.body); //this creates a new instance of class Note from note.js passing the new obj.title and obj.body we passed into postman

    noteService.Add(note); //this will call the service Add(note). noteService is declared on line 6. Ensure that you require note.service  

    res.status(201).end(); //201 status is created (while 404 is not found and 200 is Ok)
});

router.put('/', function(req, res) { //put is for EDITING a note.
    var id = req.query.id; // we have declared in notes.js to have a this.id parameter, which means every note we have has an id. req.query.id is the id on the url we have passed either in browser or postman
    var obj = req.body; // same concept as above but req.body is the json data(ex. {title: "sample", body:"sample body"}) that we pass to postman. make sure that your method here is PUT not GET nor POST.

    if(!id) //if the id cannot be found, it will throw an error. You can test this error in postman but not in browser.
        throw new Error('invalid id');
    else if(!obj) //this is a redundance of above. The code will work without this but better to have an extra gate to prevent errors.
        throw new Error('invalid note');
 

    if(noteService.Edit(id, obj)){ //this is another if statement so this will not be bypassed if the condition above is true
        res.status(200).end(); //we pass the id and body as a condition. This will be true if the id and body is not empty. and pass in a status of 200 to the header meaning success. Use .end() to finish as a good practice. Although, the code will still work without this
    }
    else {
        res.status(404).end();
    }

});

router.delete('/', function(req, res){// this is for DELETE note
    var id = req.query.id; // we need to find the id of the note to delete

    if(!id)
        throw new Error('invalid id');

    if(noteService.Delete(id)){ //calling .Delete from note.service with the id passed as a parameter. REMEMBER: this will only delete the note in front end but will keep it on json file.
        res.status(200).end();
    }
    else {
        res.status(404).end();//if the id is not existing it will throw an error. Again, this can only be tested in postman
    }


});

module.exports = router;