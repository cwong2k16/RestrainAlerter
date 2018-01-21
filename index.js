var express = require('express');
const admin = require('firebase-admin');
var body_parser = require('body-parser');
var serviceAccount = require("./keys/serviceAccountKey.json");
var fs = require('fs');

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
        var readStream = fs.createReadStream(__dirname + '/id.txt', 'binary');
        readStream.on('data', function(chunk){  
            chunk = parseInt(chunk)+1;
            chunk = chunk.toString();
            var docRef = db.collection(req.body.Type).doc(chunk);
            var setPerson = docRef.set({
                name: req.body.Name,
                type: req.body.Type,
                summary: req.body.Summary,
                ID: chunk
            });
            res.send(req.body.Name + ' of id: ' + chunk +  ' has been added to the database.');
            var writeStream = fs.createWriteStream(__dirname + '/id.txt');
            writeStream.write(chunk);
         });
    }
    else{
        res.send('Please enter a valid Type. Choices are: victim/abuser');
    } 
});

app.get('/victims', (req, res)=>{
    var obj = {};
    db.collection('victim').get()
    .then((snapshot) => {
        snapshot.forEach((doc) => {
            // console.log(doc.id, '=>', doc.data());
            obj[doc.id] = doc.data();
        });
        res.render('victims', {data: obj});
    })
    .catch((err) => {
        console.log('Error getting documents', err);
    });
});

app.get('/abusers', (req, res)=>{

});

app.listen(3001);
