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