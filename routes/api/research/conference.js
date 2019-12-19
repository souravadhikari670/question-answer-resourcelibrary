const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const sendmail = require('@sendgrid/mail')

// modal
const User = require('../../../modal/User')

//post journals
//this is private route
router.post('/',
passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'})
,(req,res)=>{

    const newConference = {}
    newConference.title = req.body.title
    if (typeof req.body.authors !== undefined) {
        newConference.authors = req.body.authors.split(',')
    }
    if (typeof req.body.keyword !== undefined) {
        newConference.keyword = req.body.keyword.split(',')
    }
    newConference.description = req.body.description
    newConference.publicationdate = req.body.publicationdate
    newConference.conference = req.body.conference
    newConference.volume = req.body.volume
    newConference.issue = req.body.issue
    newConference.pages = req.body.pages
    newConference.publisher = req.body.publisher
    var date = new Date
    newConference.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    User.findById(req.user.id)
    .then((user)=>{
        user.conference.unshift(newConference)
        user.save()
        .then((authuser)=>{
           
            for (i = 0; i < authuser.follower.length; i++) {
                User.findOne({
                        username: authuser.follower[i].username
                })
                .then((user) => {
                    const c = {}
                    c.id = authuser.conference[0]._id
                    c.tag = 'conference'
                    c.title = authuser.conference[0].title
                    c.username = authuser.username
                    c.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                    user.researchnotification.unshift(c)
                    user.timeline.unshift(c)
                    user.save()
                })
                .catch((error) => {
                    console.log(error)
                })
            }
            const t = {}
            t.id = authuser.conference[0]._id
            t.tag = 'conference'
            t.title = authuser.conference[0].title
            t.username = authuser.username
            t.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
            authuser.timeline.unshift(t)
            authuser.save()
            .then(()=>{
                res.send({
                    success: true
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
    .catch((error)=>{
        console.log(error)
    })

})




//edit chapter
router.post('/edit',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.body.username
            })
            .then((user) => {

                const editConference = user.conference
                    .map(item => item._id)
                    .indexOf(req.body.id)

                res.send({
                    conference: user.conference[editConference]
                })

            })
            .catch((error) => {
                console.log(error)
            })

    })


//edit post conference
router.post('/edit/post',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.user.username
            })
            .then((user) => {

                const editConferenceIndex = user.conference
                    .map(item => item._id)
                    .indexOf(req.body.id)

                user.conference[editConferenceIndex].title = req.body.title
                if (typeof req.body.authors !== undefined) {
                    user.conference[editConferenceIndex].authors = req.body.authors.split(',')
                }
                if (typeof req.body.keyword !== undefined) {
                    user.conference[editConferenceIndex].keyword = req.body.keyword.split(',')
                }
                user.conference[editConferenceIndex].description = req.body.description
                user.conference[editConferenceIndex].publicationdate = req.body.publicationdate
                user.conference[editConferenceIndex].volume = req.body.volume
                user.conference[editConferenceIndex].conference = req.body.conference
                user.conference[editConferenceIndex].issue = req.body.issue
                user.conference[editConferenceIndex].pages = req.body.pages
                user.conference[editConferenceIndex].publisher = req.body.publisher
                var date = new Date
                user.conference[editConferenceIndex].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()


                const editConferenceIndexTimeline = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
                user.timeline[editConferenceIndexTimeline].id = req.body.id
                user.timeline[editConferenceIndexTimeline].tag = 'conference'
                user.timeline[editConferenceIndexTimeline].title = req.body.title
                user.timeline[editConferenceIndexTimeline].username = req.user.username
                user.timeline[editConferenceIndexTimeline].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

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
            .catch((error) => {
                console.log(error)
            })

    })





//delete conference
router.post('/delete',
passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'})
,(req,res)=>{

    User.findOne({username:req.body.username})
    .then((user)=>{

        const removeConference = user.conference
                    .map(item => item._id)
                    .indexOf(req.body.id)
        user.conference.splice(removeConference, 1)
        user.save()
        .then(()=>{
            const removeConference = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline.splice(removeConference, 1)
            user.save()
            .then(()=>{
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
    .catch((error)=>{
        console.log(error)
    })

})


//view journal
router.get('/:username/:id/:title',(req, res)=>{

    User.findOne({username:req.params.username})
    .then((user)=>{
        const conferenceIndex = user.conference
                    .map(item => item._id)
                    .indexOf(req.params.id)
        const conference = user.conference[conferenceIndex]
        if(conference){
            res.render('profilecomponent/research/conference/viewconference', {
                conference,
                user,
                account: false,
                auth: false
            })  
        }else{
            res.end('conference no longer exists')
        }  
    })
    .catch((error)=>{
        console.log(error)
    })

})


module.exports = router