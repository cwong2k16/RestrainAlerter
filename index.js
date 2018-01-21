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
    if(req.body.Type === 'victim' || req.body.Type === 'abuser'){
        console.log(req.body);
        var docRef = db.collection(req.body.Type).doc(req.body.Name);
        var setPerson = docRef.set({
            name: req.body.Name,
            type: req.body.Type,
            summary: req.body.Summary,
            ID: req.body.ID
        });
        res.send(req.body.Name + ' has been added to the database');
    }
    else{
        res.send('error');
    } 
});

app.listen(3001);
