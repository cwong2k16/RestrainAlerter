var express = require('express');
const admin = require('firebase-admin');
var body_parser = require('body-parser');
var serviceAccount = require("./keys/serviceAccountKey.json");

var app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded( { extended: false}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.get('/', (req, res)=>{
    res.render('./index');
});

app.post('/', (req, res)=>{
    if(req.body.Type === 'victim'){
        console.log(req.body);
        var docRef = db.collection('victim').doc(req.body.Name);
        var setPerson = docRef.set({
            name: req.body.Name,
            type: req.body.Type,
            summary: req.body.Summary,
            ID: req.body.ID
        });
    }
    else if(req.body.Type === 'abuser') {
        var docRef = db.collection('abuser').doc(req.body.Name);
        var setPerson = docRef.set({
            name: req.body.Name,
            type: req.body.Type,
            summary: req.body.Summary,
            ID: req.body.ID
        });
    } 
});

app.listen(3001);
