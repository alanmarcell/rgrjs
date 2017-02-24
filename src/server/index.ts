import express from 'express';
import { MongoClient } from 'mongodb';

var app = express();

console.log('starting server');

app.use(express.static('dist/public'));

const MONGO_URL = 'mongodb://alan:alan@ds161029.mlab.com:61029/amorgrjs',
    PORT = 3000;

var db;
MongoClient.connect(MONGO_URL, (err, database) => {
    if (err) throw err;

    db = database;
    app.listen(PORT, () => console.log('liste on port ', PORT));
})

app.get("/data/links", (req, res) => {
    db.collection("links").find({}).toArray((err, links) => {
        if (err) throw err;

        res.json(links);
    });
});
