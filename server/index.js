const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkAuth = require('./middleware/auth');

const { User } = require('./models/user');
const config = require('./config/key')


mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => {
    console.log('DB connected');
})
    .catch((err) => {
        console.log(err);
    });
mongoose.set("useCreateIndex", true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});


app.get("/auth", checkAuth, (req, res) => {
    res.status(200).json({
        _id: req.userData.userId,
        isAdmin: req.userData.role === 0 ? false : true,
        isAuth: true,
        email: req.userData.email,
        name: req.userData.name,
        lastname: req.userData.lastname,
        role: req.userData.role,
    });
});

app.post('/api/user/register', (req, res) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (user.length >= 1) {
                res.status(409).json({
                    message: 'Mail exsists'
                })
            }
            else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(200).json({
                            error: err
                        });
                    }
                    else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            email: req.body.email,
                            name: req.body.name,
                            lastname: req.body.lastname,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                return res.status(201).json({
                                    message: 'User Created'
                                });
                            })
                            .catch(err => {
                                return res.status(500).json({
                                    error: err
                                });

                            })

                    }
                })
            }
        });
})


app.post('/api/user/login', (req, res, next) => {
    console.log('req.body', req.body)
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user.length < 1) {
                return res.status(401).json({
                    message: 'Auth Failed'
                })
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, result) => {
                    if (err) {
                        return res.status(401).json({
                            message: 'Auth Failed'
                        })
                    }
                    if (result) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                userId: user._id,
                                password: user.password,
                                role: user.role,
                                lastname: user.lastname
                            }, 'secret',
                            {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(401).json({
                            message: 'Auth Successful',
                            token: token
                        })
                    }
                    return res.status(401).json({
                        message: 'Auth Failed'
                    })

                });
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
});
const port = process.env.PORT || 5000

app.listen(port, () => {
  console.log(`Server Listening on ${port}`)
});