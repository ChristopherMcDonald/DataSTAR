module.exports = (app, scrypt) => {
    
    var Client = require('../objects/Client.js');
    var scryptParameters = scrypt.paramsSync(0.1);

    app.post('/clientLogin', (req, res) => {
        console.log(req);
        Client.findOne({"logins.email": req.fields.email.toLowerCase()}).then(client => {
            if(client) {
                var loginInfo = client.logins.filter(login => login.email === req.fields.email.toLowerCase())[0];
                if(scrypt.verifyKdfSync(loginInfo.password, req.fields.password)) {
                    res.status(202).send({res: "valid", id: loginInfo._id});
                } else res.status(401).send({description: "bad credentials"});
            }
            else res.status(401).send({description: "bad credentials"});
        }).catch(err => {
            console.log(err);
            res.status(500).json("internal error");
        });
    });
    
    app.get('/client', (req, res) => {
        Client.findOne({id: req.params.id}).then(client => {
            if(client) {
                res.status(200).json({res: "valid", client: client});
            } else {
                res.status(401).json({description: "bad credentials"});
            }
        }).catch((err) => { // no user of that email
            console.log(err);
            res.status(500).json("internal error");
        });
    });
    
    app.post('/client', (req, res) => {
        var client = new Client({
            coname: req.fields.name,
            logins: [{email: req.fields.email.toLowerCase(), password: scrypt.kdfSync(req.fields.password, scryptParameters)}],
            datasets: []
        });
        
        client.save().then((client) => {
                console.log("Client made with id: " + client.id);
                res.status(200).send({id: client.id});

            }).catch((err) => {
                console.log(err);
                res.status(500).send("internal error");
            });
    });
    
    app.post('/client/addLogin', (req, res) => {    
        Client.findOne({id: req.fields.id}).then(client => {
            if(client) {
                client.logins.push({email: req.fields.email, password: scrypt.kdfSync(req.fields.password, scryptParameters)});
                client.save((err) => {
                    if(err) {
                        res.status(500).json("internal error");
                    } else {
                        res.status(202).send({res: "valid"});
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
    
    app.post('client-add', (req, res) => {
        console.log("dddddd");
        console.log(req);
        Client.findOne({id: req.fields.id}).then(client => {
            if(client) {
                var toAdd = {};
                toAdd.type = req.fields.type; // string
                toAdd.options = req.fields.options; // [string]
                toAdd.tier = req.fields.tier; // number
                toAdd.resources = [];
                req.files.forEach(file => {
                    resources.push({link: file, annotationsPending: toAdd.tier, annotations: []});
                });
                client.datasets.push(toAdd);
                client.save((err) => {
                    if(err) {
                        res.status(500).json("internal error");
                    } else {
                        res.status(202).send({res: "valid"});
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
    
    app.get("test", (req, res) => {
        res.status(200).send("you good.");
    });
}
