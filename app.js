const path = require('path'); //to use path.join(__dirname,'folder name')
const express = require('express'); // to use express
const app = express(); // to assign express to a constant so it is easier to reuse

const noteRoutes = require('./routes/note.routes'); //to assign the exported declaration from the file note.routes
//const userRoutes = require('./routes/user.routes');
const basicAuth = require('express-basic-auth'); //to use express basic authentication basicAuth({*the objects here are predefined except validateAuth}).
const validateAuth = require('./auth');

app.use(basicAuth({
    authorizer: validateAuth,
    challenge: true, 
    realm: 'Notes App',
 }));

app.set('views', path.join(__dirname, 'views')); //app.set is mainly used to store and retrieve variables.
app.set('view engine', 'hbs'); //to use handlebar.. if you want to use pug(formerly jade), type in app.use('view engine', 'pug');

app.use('/js', express.static(path.join(__dirname, 'js'))); // hbs is static.

app.use(express.json()); //for post and put requests to access the body of a json file. If you will not use this you will receive an error when trying to access the body. This also includes body-parser.
app.use('/api/notes', noteRoutes); //api as in RESTful API. You may use versioning as in api/v1/notes. --> this line of code will give you the json 
//app.use('/users', userRoutes);

app.get('/', function(req, res){ //this is an assurance to redirect a url from 127.0.0.1:3000/ to 127.0.0.1:3000/notes. same like wikipedia.com. Example: wikipedia.com will be redirected to wikipedia.org
    res.redirect('/notes');//the whole code will work without this but a good thing to have
});

app.get('/notes', function(req, res){ //this will get from the server the html in the form of hbs.
    res.render('index', { title: "Notes App" });
});//also, res.render tells the view engine(line 17) to look for a file called index inside views folder(line 16)

const port = 3000; // declaring the port as in 127.0.0.1:3000 or localhost:3000
app.listen(port, () => console.log(`Note app listening on port ${port}!`)) //this is to load the server on port 3000. Use nodemon app.js.. ensure that you have nodemon npm installed.