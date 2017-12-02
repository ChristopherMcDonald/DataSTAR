var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var usersSchema = new Schema({
    name: String,
    email: {type: String, unique: true},
    password: Buffer,
    cash: Number
}, {
    collection: "users"
});

var Users = mongoose.model('Users', usersSchema);

module.exports = Users;