var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var loginSchema = new Schema({email: String, password: Buffer});
var resourceSchema = new Schema({link: String, annotationsPending: Number, annotations: [String]});
var datasetSchema = new Schema({tier: String, options: [String], type: String, resources: [resourceSchema]});
// create a schema
var clientSchema = new Schema({
    coname: String,
    logins: [loginSchema],
    datasets: [datasetSchema]
}, {
    collection: "clients"
});

var Clients = mongoose.model('Clients', clientSchema);

module.exports = Clients;