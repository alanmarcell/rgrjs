import express from 'express';


var app = express();

app.get('/', (req, res) => res.send('hello World!!!'));

app.listen(3000);