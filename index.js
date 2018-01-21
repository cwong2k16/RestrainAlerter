var express = require('express');
const admin = require('firebase-admin');
var body_parser = require('body-parser');
var serviceAccount = require("./keys/serviceAccountKey.json");
var fs = require('fs');
var obj = {};
var obj2 = {};

var app = express();
app.set('view engine', 'ejs');
app.use(body_parser.urlencoded( { extended: false}));
app.use(express.static('./public/assets'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

var db = admin.firestore();

app.get('/', (req, res)=>{
    res.render('./index');
});

app.post('/', (req, res)=>{
    if(req.body.Type === 'Victim' || req.body.Type === 'Abuser'){
        var Name = (req.body.firstName + ' ' + req.body.lastName);  
        var docRef = db.collection('users').doc(req.body.ID);
        var setPerson = docRef.set({
            distance: req.body.Distance,
            name: Name,
            other: req.body.Other,
            type: req.body.Type,
            summary: req.body.Summary,
        });
        res.send(Name + ' of id: ' + req.body.ID +  ' has been added to the database.');
    }
    else{
        res.send('Please enter a valid Type. Choices are: victim/abuser');
    } 
});

app.get('/victims', (req, res)=>{
    renderDisplay('Victim', req, res);
    res.render('person', {data: obj, title: 'Victims'});
});

app.get('/abusers', (req, res)=>{
    renderDisplay('Abuser', req, res);
    res.render('person', {data: obj2, title: 'Abusers'});
});

function renderDisplay(type, req, res){
    var usersRef = db.collection('users');
    var query = citiesRef.where('capital', '==', true).get()
        .then(snapshot => {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
}

app.listen(3001);
