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
        // var docRef = db.collection('users').add({
        //     distance: req.body.Distance,
        //     name: Name,
        //     other: req.body.ID,
        //     summary: req.body.Summary,
        //     type: req.body.Type
        // }).then(ref=>{
        //     console.log("Added document with ID: ", ref.id);
        // });
        var docRef = db.collection(req.body.Type).doc(req.body.ID);
        var setPerson = docRef.set({
            distance: req.body.Distance,
            name: Name,
            other: req.body.ID,
            type: req.body.Type,
            summary: req.body.Summary,
            ID: chunk
        });
        res.send(Name + ' of id: ' +  +  ' has been added to the database.');
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
    db.collection(type).get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            if(type === 'Victim')
            obj[doc.id] = doc.data();
            if(type === 'Abuser')
            obj2[doc.id] = doc.data();
        });
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
}

app.listen(3001);
