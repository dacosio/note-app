const fs = require('fs'); //require core module fs to use writeFile and readFileSync
const path = require('path');


class NoteService {

    constructor() {
        this.notesJSON = path.join(__dirname,'../notes.json'); //this is simply the path of our JSON file
        
        // console.log("loading JSON file in: ", this.notesJSON);
        this.notes = JSON.parse(fs.readFileSync(this.notesJSON)); //this will a JSON string into a Javascript object
    }

    Add(note) { //the argument here is note = new Note(obj.title, obj.body) as declared from note.route line 26. Remember that the argument input changes depending on what you declared within its scope.
        var max = 0; // initially max is equal to zero.
        if(this.notes.length > 0) //if there is a JSON object. .map will put the IDs into an array and math.max will take the highest number
            var max = Math.max(...this.notes.map((n)=> n.id)); // whether the condition is true or false, the code below will run

        note.id = 1 + max; //this will create a new id inside the JSON object
        note.isDeleted = false; // this will create a new isDeleted = false inside JSON object
        this.notes.push(note); // this will push the note that you passed into the browser
        this.SaveChanges(); //this will save the notes you passed to json file. Without this, whatever note you add will show in the front end but will not be written in backend json. You won't be able to delete the note in the front end without this too.
    }

    Edit(id, note) { //id is req.query.id while note is req.body passed into the url in postman. see line 42 in notes.routes
        var obj = this.Get(id); //the note with the id you passed will be stored in obj

        if(obj) { //if a note was successfully stored, the codes below will take effect
            obj.title = note.title; //this will overwrite the title of the note
            obj.body = note.body; // this will overwrite the body/description of the note
            obj.isDeleted = note.isDeleted || false; //this will be kept as false
            this.SaveChanges(); //call SaveChanges so that the changes will be saved in json file overwriting what you have edited
            return true; //we have to return true so the router will return a 200 status as router's response'
        }
        else {
            return false; //this will trigger 404 error. see note.router line 53.
        }
    }

    Delete(id) {
        var obj = this.Get(id); //the note with the id you passed will be stored in obj

        if(obj) { //if obj is not empty the codes below will trigger
            obj.isDeleted = true; //isDeleted value will become true on json file once it is deleted in the front end. This is soft deleting hence the note object will be kept in the json file
            this.SaveChanges(); //SaveChanges will overwrite the isDeleted value
            return true; //return true to have a status 200 OK in postman
        }
        else {
            return false;
        }
    }

    Get(id) { // this will find the note base on the id that you have passed into the url. .find() is a js higher order function that will return once it found the condition unlike filter that will go through all the indexes
        return this.notes.find((n) => n.id == id);
    }

    List() { // this will list
        return this.notes;
    }

    SaveChanges() {
        fs.writeFile(this.notesJSON, JSON.stringify(this.notes), () => console.log("successfully updated ", this.notesJSON));
    }
}

module.exports = NoteService;