//This is where you define the content of your notes.json files.
//Body is provided using postman body raw
//id is declared on postman url
//IMPORTANT: use basic authentication to postman to show 200 OK instead of 401 Unauthorized in status


class Note {

    constructor(title, body) {
        this.id;
        this.title = title;
        this.body = body;
        this.isDeleted;
    }
}


module.exports = Note;