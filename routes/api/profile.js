const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const mySecretKey = require('../../key/databse').secret
const sendmail = require('@sendgrid/mail')
const randomString = require('randomstring')
const sessionStorage = require('sessionstorage')
const multer = require('multer')
const User = require('../../modal/User')

//upload profilepic
// configuration multer
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './routes/public/profile/profilepic')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname)
    }
})

var upload = multer({
    storage: storage
})


router.get('/', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {
    User.findById(req.user.id)
        .then((user) => {
            const auth = true
            const account = true
            const flag = ''
            res.render('profile', {
                auth,
                account,
                flag,
                user,
            })
        })
        .catch((error) => {
            console.log(error)
        })
})

//getting user profile based on username 
//this roue is public or private
router.get('/find/users/:username', (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/api/profile/find/user/' + req.params.username,
        successRedirect: '/api/profile/find/user/auth/' + req.params.username
    })(req, res, next);
})


//getting user profile based on username 
//this roue is public
router.get('/find/user/:username',
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {
                if (user) {
                    const account = false
                    const flag = ''
                    res.render('profile', {
                        user,
                        auth: false,
                        account,
                        flag
                    })
                } else {

                    User.findOne({email:req.params.username})
                    .then((user)=>{
                        if(user){
                            const account = false
                            const flag = ''
                            res.render('profile', {
                                user,
                                auth: false,
                                account,
                                flag
                            })
                        }else{
                            res.json({
                                "profile": "profile not found"
                            })
                        }
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })

    })


//getting user profile based on username 
//this roue is private
router.get('/find/user/auth/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    if (req.user.username === req.params.username) {
        res.redirect('/api/profile')
    } else {
        User.findOne({
                username: req.params.username
            })
            .then((user) => {
                if (user) {
                    const account = false
                    for (i = 0; i < user.follower.length; i++) {
                        if (user.follower[i].username == req.user.username) {
                            res.render('profile', {
                                user,
                                flag: "yes",
                                account,
                                auth: true
                            })
                            break
                        }
                    }
                    res.render('profile', {
                        user,
                        flag: "no",
                        account,
                        auth: true
                    })

                } else {
                    User.findOne({email:req.params.username})
                    .then((user)=>{
                        if(user){
                            const account = false
                            for (i = 0; i < user.follower.length; i++) {
                                if (user.follower[i].username == req.user.username) {
                                    res.render('profile', {
                                        user,
                                        flag: "yes",
                                        account,
                                        auth: true
                                    })
                                    break
                                }
                            }
                            res.render('profile', {
                                user,
                                flag: "no",
                                account,
                                auth: true
                            })
                        }else{
                            res.json({
                                "profile": "profile not found"
                            })
                        }
                    })
                    .catch((error)=>{
                        console.log(error)
                    })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
})



//follow user
//this is private route
router.post('/find/user/auth/follow/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    User.findOne({
            username: req.params.username
        })
        .then((user) => {

            var newFollower = ({
                uid: req.user.id,
                name: req.user.name,
                username: req.user.username
            })
            user.follower.push(newFollower)
            user.save()
                .then(() => {
                    User.findById(req.user.id)
                        .then((authuser) => {
                            var newFollowing = ({
                                uid: user._id,
                                name: user.name,
                                username: req.params.username
                            })
                            authuser.following.push(newFollowing)
                            authuser.save()
                                .then(() => {
                                    res.send({
                                        "success": true
                                    })
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })
})
//follow user
//this is private route
router.post('/find/user/auth/unfollow/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    User.findOne({
            username: req.params.username
        })
        .then((user) => {

            const removefollower = user.follower
                .map(item => item.username)
                .indexOf(req.user.username)
            user.follower.splice(removefollower, 1)
            user.save()
                .then(() => {
                    User.findById(req.user.id)
                        .then((authuser) => {
                            const removefollowing = authuser.following
                                .map(item => item.username)
                                .indexOf(req.params.username)
                            authuser.following.splice(removefollowing, 1)
                            authuser.save()
                                .then(() => {
                                    res.send({
                                        "success": true
                                    })
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        })
                        .catch((error) => {
                            console.log(error)
                        })
                })
                .catch((error) => {
                    console.log(error)
                })

        })
        .catch((error) => {
            console.log(error)
        })

})


//delete user
//this is private route
router.post('/deleteaccount', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    User.findById(req.user.id)
        .then((user) => {

            bcrypt.compare(req.body.password, user.password)
                .then((authuser) => {
                    if (authuser) {

                        User.findByIdAndRemove(
                                req.user.id
                            )
                            .then(() => {
                                res.send("success")
                            })
                            .catch((error) => {
                                console.log(error)
                            })

                    } else {
                        res.send("incorrectpassword")
                    }
                })
                .catch((error) => console.log(error))
        })
        .catch((error) => {
            console.log(error)
        })

})


router.get('/find/users', (req, res) => {

    User.find()
        .then((users) => {
            res.send({
                users: users
            })
        })
        .catch((error) => {
            console.log(error)
        })

})

//send message
//this is private route
router.post('/sendmessage',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }),
    (req, res) => {

        sendmail.setApiKey(api key);
        const msg = {
            to: req.body.to,
            from: req.user.email,
            subject: 'personal message form ' + req.user.username + ' with SchoLife',
            html: `<p style="font-size:22px">${req.body.message}</p>`
        };
        sendmail.send(msg)
            .then(() => {
                User.findOne({
                        email: req.body.to
                    })
                    .then((user) => {
                        let date = new Date
                        const message = {}
                        message.from = req.user.username
                        message.message = req.body.message,
                        message.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                        user.message.unshift(message)
                        user.save()
                            .then(() => {
                                res.send({
                                    success: true
                                })
                            })
                            .catch((error) => {
                                console.log(error)
                            })
                    })
                    .catch(error => console.log(error))

            })
            .catch((error) => {
                console.log(error)
            })
    })

//read full message
//this is private route
router.post('/message/readmore'
,passport.authenticate('jwt',{session:false, failureRedirect:"/sessionexpire"})
,(req, res)=>{

    User.findOne({username:req.body.username})
    .then((user)=>{
        user.message[req.body.index].view = true
        user.save()
        .then(()=>{
            User.findOne({username:user.message[req.body.index].from})
            .then((u)=>{
    
                res.send({message:user.message[req.body.index], profilepic:u.profilepic})
            })
            .catch((error)=>{
                console.log(error)
            })
        })
        .catch((error)=>{
            console.log(error)
        })
    })
    .catch((error)=>{
        console.log(error)
    })

})


//upload profilepic
router.post('/profilepic',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }),
    upload.single('uploadprofilepic'), (req, res) => {

        User.findByIdAndUpdate(req.user.id, {
                profilepic: req.file.filename
            }, {
                new: true
            })
            .then(() => {
                res.send({
                    success: true
                })
            })
            .catch((error) => {
                console.log(error)
            })

    })
//add bio
router.post('/addbio',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findByIdAndUpdate(req.user.id, {
                bio: req.body.bio
            }, {
                new: true
            })
            .then(() => {
                res.send({
                    success: true
                })
            })
            .catch((error) => {
                console.log(error)
            })

    })



//get follower
router.post('/getfollower', (req, res) => {
    User.findOne({
            username: req.body.username
        })
        .then((user) => {

            User.find()
                .then((users) => {
                    res.send({
                        user: user,
                        users: users
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })

})
//get following
router.post('/getfollowing', (req, res) => {
    User.findOne({
            username: req.body.username
        })
        .then((user) => {

            User.find()
                .then((users) => {
                    res.send({
                        user: user,
                        users: users
                    })
                })
                .catch((error) => {
                    console.log(error)
                })
        })
        .catch((error) => {
            console.log(error)
        })

})


//post simple message
router.post('/postsimplemessage',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.body.username
            })
            .then((user) => {
                var date = new Date
                const newMessage = {}
                newMessage.title = req.body.title
                newMessage.tag = req.body.tag
                newMessage.username = req.body.username
                newMessage.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                user.timeline.unshift(newMessage)
                user.save()
                    .then((authuser) => {

                        const newMessage = {}
                        newMessage.title = req.body.title
                        newMessage.tag = req.body.tag
                        newMessage.username = req.body.username
                        newMessage.id = authuser.timeline[0]._id
                        newMessage.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

                        for (i = 0; i < authuser.follower.length; i++) {
                            User.findOne({
                                    username: authuser.follower[i].username
                                })
                                .then((user) => {
                                    user.timeline.unshift(newMessage)
                                    user.save()
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }

                        res.send({success:true})
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            })
            .catch((error) => {
                console.log(error)
            })

    })


//delete simple message
router.post('/deletesimplemessage',
passport.authenticate('jwt',{session:false, failureRedirect:'/sessionexpire'})
,(req, res)=>{

    User.findOne({username:req.body.username})
    .then((user)=>{

        const removeMessageIndex = user.timeline
        .map(item => item._id)
        .indexOf(req.body.id)
        user.timeline.splice(removeMessageIndex, 1)
        user.save()
        .then((authuser)=>{
           
           for (i = 0; i < authuser.follower.length; i++) {

            User.findOne({username:authuser.follower[i].username})
            .then((fuser)=>{
                const removeMessageIndex = fuser.timeline
                .map(item => item.id)
                .indexOf(req.body.id)
                fuser.timeline.splice(removeMessageIndex, 1)
                fuser.save()
            })
            .catch((error)=>{
                console.log(error)
            })

            }
            res.send({success:true})
        })
        .catch((error)=>{
            console.log(error)
        })

    })
    .catch((error)=>{
        console.log(error)
    })

})


module.exports = router
