module.exports = (app, scrypt) => {
    
    var User = require('../objects/User.js');
    var Client = require('../objects/Client.js');
    var scryptParameters = scrypt.paramsSync(0.1);
    var net = require('net');
    
    app.get('/test', (req, res) => {
        res.status(200).send({res: "yo"});
    });

    app.post('/login', (req, res) => {
        User.findOne({email: req.body.email.toLowerCase()}).then(user => {
            if(user && scrypt.verifyKdfSync(user.password, req.body.password)) {
                res.status(200).json({res: "valid", user: user.id});
                
                var client = net.connect(8080, 'localhost');
                client.write(user.id + ",0,0");
                client.end();
                
            } else {
                res.status(401).json({description: "bad credentials"});
            }
        }).catch((err) => { // no user of that email
            console.log(err);
            res.status(500).json("internal error");
        });
    });
    
    app.get('/user', (req, res) => {
        User.findOne({id: req.params.id}).then(user => {
            if(user) {
                res.status(200).json({res: "valid", user: user.name});
            } else {
                res.status(401).json({description: "bad credentials"});
            }
        }).catch((err) => { // no user of that email
            console.log(err);
            res.status(500).json("internal error");
        });
    });
    
    app.post('/user', (req, res) => {
        console.log(JSON.stringify(req.body));
        var user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: scrypt.kdfSync(req.body.password, scryptParameters),
            cash: 0
        });
        
        user.save().then((user) => {
                console.log("User made with id: " + user.id);
                res.status(200).send({id: user.id});

            }).catch((err) => {
                console.log(err);
                res.status(500).send("internal error");
            });
    });
    
    app.get('/user/cashout', (req,res) => {
        User.findOne({id: req.params.id}).then(user => {
            if(user) {
                // TODO give the user cash === user.cash
                user.cash = 0;
                user.update((err, res) => {
                    if(err) {
                        res.status(500).json("internal error");
                    } else {
                        res.status(200).json({res: "valid"}); // TODO what to return?
                    }
                });
            } else {
                res.status(401).json({description: "bad credentials"});
            }
        }).catch((err) => { // no user of that email
            console.log(err);
            res.status(500).json("internal error");
        });
    });
    
    app.get('/next', (req, res) => {
        // takes in userID
        var server = net.createServer((socket) => {
            console.log("made server");
            socket.on('data', (data) => {
                console.log("got ticket");
                var tokens = data.toString('utf8').trim('\n').split(',');
                Client.find({"datasets._id": tokens[0]}, (err, client) => {
                    if(client) {
                        client[0].datasets.forEach(dataset => {
                            if(dataset.id === tokens[0]) {
                                res.status(200).send({res: "valid", ticket: {link: tokens[1], data: tokens[0], options: dataset.options}}); // add datasetID, resourcename
                            } else {
                                res.status(500).send("internal error");
                            }
                        });
                    } else {
                        console.error("NOT VALID DATASET ID " + data.datasetId);
                    }
                    socket.destroy();
                    server.close();
                });
            });

        }).listen(8081, 'localhost');
        console.log("going to listen to server");
        var client = net.connect(8080, 'localhost');
        client.write(req.query.userId);
        client.end();
        console.log("all done");
    });
    
    app.post('/annotate', (req, res) => {
        // take in a userID, datasetID, resourceID and confirm
        User.findOne({"_id" : req.body.userId}, (err, user) => {
            if(!user) res.status(404).send({res: "invalid", reason: "not found"});
            else {
                Client.find({"dataset._id": req.body.datasetID}, (err, client) => {
                    console.log(JSON.stringify(client[0].datasets));
                    // TODO fix below assumption
                    // assume only one set is returned
                    var type = client[0].datasets[0].type;
                    if(type === "image") {
                        user.cash += 0.003;
                    } else if(type === "video") {
                        user.cash += 0.006;
                    } else if(type === "text") {
                        user.cash += 0.0045;
                    } else if(type === "audio") {
                        user.cash += 0.006; // TODO make relative to length of video/audio
                    }
                    
                    user.save((err,user) => {
                        if(err) res.status(500).send("unhandled error");
                        else res.status(200).send({res: "valid"});
                    });
                    
                    client[0].datasets[0].resources.every(resource => {
                        if(resource.link === req.body.resourceName) {
                            resource.annotations.push(req.body.label);
                            return false;
                        }
                        return true;
                    });
                    client[0].save((err,client) => {
                        if(err) console.error("Annotations have failed to be added to the client.");
                    });
                });
            }
        });
        var client = net.connect(8080, 'localhost');
        client.write(req.body.userId + "," + req.body.resourceName + "," + req.body.datasetID + "," + req.body.label);
        client.end();
    });
}
