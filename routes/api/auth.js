const express = require('express')
const router = express.Router()
const fetch = require('node-fetch');
const bcrypt = require('bcryptjs')
const jsonwt = require('jsonwebtoken')
const passport = require('passport')
const mySecretKey = require('../../key/databse').secret
const sendmail = require('@sendgrid/mail')
const randomString = require('randomstring')
const sessionStorage = require('sessionstorage')

//modals
const User = require('../../modal/User')

router.post('/registration', (req, res) => {

    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                res.send({
                    email: 'exist'
                })
            } else {
                User.findOne({
                        username: req.body.username
                    })
                    .then((user) => {
                        if (user) {
                            res.send({
                                username: 'exist'
                            })
                        } else {

                            //random code generator
                            var code = randomString.generate(8)
                            //send mail
                            sendmail.setApiKey(api key);
                            const msg = {
                                to: req.body.email,
                                from: 'email',
                                subject: 'ScholLife Activation Code',
                                html: '<h1>Thanks for choosing schoLife...</h1> <br><br>Activation code : ' + code,
                            };
                            sendmail.send(msg)
                                .then(() => {

                                    const newUser = new User({
                                        accountType: req.body.accountType,
                                        name: req.body.name,
                                        username: req.body.username,
                                        email: req.body.email,
                                        password: req.body.password,
                                        affiliation: req.body.affiliation,
                                        country: req.body.country,
                                        activation_code: code,
                                    })
                                    //encrypt password
                                    bcrypt.genSalt(10, function (err, salt) {
                                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                                            if (err) throw err
                                            newUser.password = hash
                                            newUser.save()
                                                .then((user) => {
                                                    if (user) {
                                                        sessionStorage.setItem('email', user.email)
                                                        res.send({
                                                            success: true
                                                        })
                                                    }
                                                })
                                                .catch((error) => {
                                                    console.log(error)
                                                })
                                        });
                                    });
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
})
router.post('/registration/organization', (req, res) => {
                if (result.status == 1) {

    User.findOne({
            email: req.body.email
        })
        .then((user) => {
            if (user) {
                res.send({
                    email: 'exist'
                })
            } else {
                User.findOne({
                        username: req.body.username
                    })
                    .then((user) => {
                        if (user) {
                            res.send({
                                username: 'exist'
                            })
                        } else {

                            //random code generator
                            var code = randomString.generate(8)
                            //send mail
                            sendmail.setApiKey(api key);
                            const msg = {
                                to: req.body.email,
                                from: 'email',
                                subject: 'ScholLife Activation Code',
                                html: '<h1>Thanks for choosing schoLife...</h1> <br><br>Activation code : ' + code,
                            };
                            sendmail.send(msg)
                                .then(() => {

                                    if (req.body.category == "Journal") {

                                        let newUser = new User({
                                            accountType: req.body.accountType,
                                            name: req.body.name,
                                            username: req.body.username,
                                            email: req.body.email,
                                            password: req.body.password,
                                            affiliation: req.body.affiliation,
                                            country: req.body.country,
                                            type: req.body.type,
                                            impactFactor: req.body.impactfactor,
                                            hIndex: req.body.hindex,
                                            category: req.body.category,
                                            jCategory : req.body.jCategory.split(','),
                                            activation_code: code,
                                           
                                        })
                                        // if (typeof req.body.jCategory !== undefined) {
                                        //     newUser.jCategory = req.body.jCategory.split(',')
                                        // }
                                        //encrypt password
                                        bcrypt.genSalt(10, function (err, salt) {
                                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                                if (err) throw err
                                                newUser.password = hash
                                                newUser.save()
                                                    .then((user) => {
                                                        if (user) {
                                                            sessionStorage.setItem('email', user.email)
                                                            res.send({
                                                                success: true
                                                            })
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log(error)
                                                    })
                                            });
                                        });
                                    } else {

                                        let newUser = new User({
                                            accountType: req.body.accountType,
                                            name: req.body.name,
                                            username: req.body.username,
                                            email: req.body.email,
                                            password: req.body.password,
                                            affiliation: req.body.affiliation,
                                            country: req.body.country,
                                            type: req.body.type,
                                            category: req.body.category,
                                            activation_code: code,
                                        })
                                       
                                        //encrypt password
                                        bcrypt.genSalt(10, function (err, salt) {
                                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                                if (err) throw err
                                                newUser.password = hash
                                                newUser.save()
                                                    .then((user) => {
                                                        if (user) {
                                                            sessionStorage.setItem('email', user.email)
                                                            res.send({
                                                                success: true
                                                            })
                                                        }
                                                    })
                                                    .catch((error) => {
                                                        console.log(error)
                                                    })
                                            });
                                        });
                                    }


                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
})


//route for ligin
router.post('/login', (req, res) => {

    const email = req.body.email
    const password = req.body.password

    User.findOne({
            email
        })
        .then((user) => {
            if (!user) {
                res.send({
                    emailEerror: "emailIncorrect"
                })
            } else {
                bcrypt.compare(password, user.password)
                    .then((authUser) => {
                        if (authUser) {
                            if (user.status == "pending") {
                                sessionStorage.setItem('email', email)
                                res.send({
                                    status: "pending",
                                })
                            } else {
                                const data = {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email,
                                    username: user.username,
                                    accountType: user.accountType,
                                    profilepic: user.profilepic,
                                    question: user.question,
                                    follower: user.follower,
                                    following: user.following,
                                }
                                jsonwt.sign(
                                    data,
                                    mySecretKey, {
                                        expiresIn: 86400
                                    },
                                    (error, token) => {
                                        res.cookie("token", token)
                                        res.send({
                                            success: true,
                                        })
                                    }
                                )
                            }

                        } else {
                            res.send({
                                passwordError: 'passwordIncorrect'
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })


})

//registration activation
router.get('/activeaccount1', (req, res) => {
    res.render('accountactivator')
})

//register activator
//this route is private
router.post('/accountactivate', (req, res) => {

    User.findOne({
            email: sessionStorage.getItem('email')
        })
        .then((user) => {
            if (user) {
                if (req.body.code == user.activation_code) {
                    User.findOneAndUpdate({
                            email: sessionStorage.getItem('email')
                        }, {
                            status: "active"
                        }, {
                            new: true
                        })
                        .then((user) => {
                            const data = {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                username: user.username,
                                accountType: user.accountType,
                                profilepic: user.profilepic,
                                follower: user.follower,
                                following: user.following,

                            }
                            jsonwt.sign(
                                data,
                                mySecretKey, {
                                    expiresIn: 86400
                                },
                                (error, token) => {

                                    sessionStorage.clear('email')
                                    res.cookie("token", token)
                                    res.send({
                                        success: true,

                                    })
                                }
                            )
                        })
                } else {
                    res.send({
                        code: 'notmatch'
                    })
                }
            }
        })
        .catch((error) => {
            console.log(error)
        })
})


//resend activation key
router.post('/resendcode', (req, res) => {

    User.findOne({
            email: sessionStorage.getItem('email')
        })
        .then((user) => {
            if (user) {
                const recode = user.activation_code
                const email = user.email
                //send mail
                sendmail.setApiKey(api key);
                const msg = {
                    to: email,
                    from: 'email',
                    subject: 'ScholLife Activation Code',
                    html: '<strong>Thanks for choosing schollife...</strong> <br><br>Activation code : ' + recode,
                };
                sendmail.send(msg)
                    .then(() => {
                        res.send({
                            success: true
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
})

module.exports = router
