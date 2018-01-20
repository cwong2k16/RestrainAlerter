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

app.get('/', (req, res)=>{
    res.render('./index');
});

app.post('/', (req, res)=>{
    res.json(req.body);
});

var db = admin.firestore();

app.listen(3000);
