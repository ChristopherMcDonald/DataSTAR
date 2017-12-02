module.exports = (app, scrypt) => {
    
    var User = require('../objects/User.js');
    var Client = require('../objects/Client.js');
    var scryptParameters = scrypt.paramsSync(0.1);
    var net = require('net');

    app.post('/login', (req, res) => {
        User.findOne({email: req.body.email.toLowerCase()}).then(user => {
            if(user && scrypt.verifyKdfSync(user.password, req.body.password)) {
                res.status(200).json({res: "valid", user: user.id});
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
        var client = net.connect(8080, 'localhost');
        client.write(req.body.userId);
        client.on('data', (data) => {
            Client.find({"datasets.id": data.datasetId}, (err, client) => {
                if(client) {
                    client.datasets.forEach(dataset => {
                        if(dataset.id === data.datasetId) {
                            res.status(200).send({res: "valid", ticket: data}); // add datasetID, resourcename
                        } else {
                            res.status(500).send("internal error");
                        }
                    });
                } else {
                    console.error("NOT VALID DATASET ID " + data.datasetId);
                }
                
            });
            
            client.end();
        });
    });
    
    app.post('/annotate', (req, res) => {
        // take in a userID, datasetID, resourceID and confirm
        var client = net.connect(8080, 'localhost');
        client.write(req.body.userId + "," + req.body.resourceName + "," + req.body.datasetID + "," + req.body.label);
        client.end();
    });
    
    // TODO increase cash balance
}
