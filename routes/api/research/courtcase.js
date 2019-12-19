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

    const newCourtcase = {}
    if (typeof req.body.keyword !== undefined) {
        newCourtcase.keyword = req.body.keyword.split(',')
    }
    newCourtcase.title = req.body.title
    newCourtcase.description = req.body.description
    newCourtcase.court = req.body.court
    newCourtcase.decideddate = req.body.decideddate
    newCourtcase.reporter = req.body.reporter
    newCourtcase.docketid = req.body.docketid
    var date = new Date
    newCourtcase.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    User.findById(req.user.id)
    .then((user)=>{
        user.courtcase.unshift(newCourtcase)
        user.save()
        .then((authuser)=>{
           
            for (i = 0; i < authuser.follower.length; i++) {
                User.findOne({
                        username: authuser.follower[i].username
                })
                .then((user) => {
                    const c = {}
                    c.id = authuser.courtcase[0]._id
                    c.tag = 'courtcase'
                    c.title = authuser.courtcase[0].title
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
            t.id = authuser.courtcase[0]._id
            t.tag = 'courtcase'
            t.title = authuser.courtcase[0].title
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

                const editCourtcase = user.courtcase
                    .map(item => item._id)
                    .indexOf(req.body.id)

                res.send({
                    courtcase: user.courtcase[editCourtcase]
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

                const editCourtcaseIndex = user.courtcase
                    .map(item => item._id)
                    .indexOf(req.body.id)

                user.courtcase[editCourtcaseIndex].title = req.body.title
            
                if (typeof req.body.keyword !== undefined) {
                    user.courtcase[editCourtcaseIndex].keyword = req.body.keyword.split(',')
                }
                user.courtcase[editCourtcaseIndex].description = req.body.description
                user.courtcase[editCourtcaseIndex].decideddate = req.body.decideddate
                user.courtcase[editCourtcaseIndex].court = req.body.court
                user.courtcase[editCourtcaseIndex].reporter = req.body.reporter
                user.courtcase[editCourtcaseIndex].docketid = req.body.docketid
                var date = new Date
                user.courtcase[editCourtcaseIndex].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()


                const editCourtcaseIndexTimeline = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
                user.timeline[editCourtcaseIndexTimeline].id = req.body.id
                user.timeline[editCourtcaseIndexTimeline].tag = 'courtcase'
                user.timeline[editCourtcaseIndexTimeline].title = req.body.title
                user.timeline[editCourtcaseIndexTimeline].username = req.user.username
                user.timeline[editCourtcaseIndexTimeline].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

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





//delete journal
router.post('/delete',
passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'})
,(req,res)=>{
console.log('ok')
    User.findOne({username:req.body.username})
    .then((user)=>{

        const removeCourtcase = user.courtcase
                    .map(item => item._id)
                    .indexOf(req.body.id)
        user.courtcase.splice(removeCourtcase, 1)
        user.save()
        .then(()=>{
            const removeCourtcase = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline.splice(removeCourtcase, 1)
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
        const courtcaseIndex = user.courtcase
                    .map(item => item._id)
                    .indexOf(req.params.id)
        const courtcase = user.courtcase[courtcaseIndex]
        if(courtcase){
            res.render('profilecomponent/research/courtcase/viewcourtcase', {
                courtcase,
                user,
                account: false,
                auth: false
            })  
        }else{
            res.end('courtcase no longer exists')
        }  
    })
    .catch((error)=>{
        console.log(error)
    })

})


module.exports = router