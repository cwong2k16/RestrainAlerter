var express = require('express');
const admin = require('firebase-admin');
var body_parser = require('body-parser');
var serviceAccount = require("./keys/serviceAccountKey.json");
var fs = require('fs');
var arr = [];
var arr2 = [];

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
    if(req.body.Type.toLowerCase() === 'victim' || req.body.Type.toLowerCase() === 'abuser'){
        var Name = (req.body.firstName + ' ' + req.body.lastName);  
        var docRef = db.collection('users').doc(req.body.ID);
        var setPerson = docRef.set({
            distance: req.body.Distance,
            name: Name,
            other: req.body.Other,
            type: req.body.Type.toLowerCase(),
            summary: req.body.Summary,
        });
        res.send(Name + ' of id: ' + req.body.ID +  ' has been added to the database.');
    }
    else{
        res.send('Please enter a valid Type. Choices are: victim/abuser');
    } 
});

app.get('/victims', (req, res)=>{
    renderDisplay('victim', req, res);
    res.render('people', {data: arr, title: 'Victims'});
    arr = [];
});

app.get('/abusers', (req, res)=>{
    renderDisplay('abuser', req, res);
    res.render('people', {data: arr2, title: 'Abusers'});
    arr2 = [];
});

function renderDisplay(type, req, res){
    var usersRef = db.collection('users');
    var query = usersRef.where('type', '==', type).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            // console.log(doc.id, '=>', doc.data());
            if(type === 'victim'){
                var obj = {};
                obj[doc.id] = doc.data();
                arr.push(obj);
            }
            else{
                var obj2 = {};
                obj2[doc.id] = doc.data();
                arr2.push(obj2);
            }
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}

app.listen(3001);
