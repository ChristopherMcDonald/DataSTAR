const express = require('express');
const app = express();

// var bodyParser = require('body-parser');
// app.use(bodyParser.json());
var formidable = require('express-formidable');
app.use(formidable({
    encoding: 'utf-8',
    uploadDir: '/upload/',
    multiples: true
}));

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

var path = require('path');
var scrypt = require("scrypt");
var scryptParameters = scrypt.paramsSync(0.1);

require(path.resolve( __dirname, 'routes/User.js'))(app, scrypt);
require(path.resolve( __dirname, 'routes/Client.js'))(app, scrypt);

// set mongoose connection
var db = 'mongodb://localhost:27017/datasense';
mongoose.connect(db, {
    useMongoClient: true
}).then(() => {
    console.log("Connected to MongoDB using Mongoose on " + db);
}).catch((err) => {
    console.log("Mongoose Connection Error...");
    console.log(err);
});

app.listen(3000, () => console.log('Example app listening on port 3000!'));