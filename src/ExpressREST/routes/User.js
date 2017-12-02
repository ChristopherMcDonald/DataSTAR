module.exports = (app, scrypt) => {
    
    var User = require('../objects/User.js');
    var scryptParameters = scrypt.paramsSync(0.1);

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
    
    // TODO increase cash balance
}
