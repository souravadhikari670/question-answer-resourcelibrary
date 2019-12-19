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

    const newThesis = {}
    newThesis.title = req.body.title
    if (typeof req.body.authors !== undefined) {
        newThesis.authors = req.body.authors.split(',')
    }
    if (typeof req.body.keyword !== undefined) {
        newThesis.keyword = req.body.keyword.split(',')
    }
    newThesis.description = req.body.description
    newThesis.publicationdate = req.body.publicationdate
    newThesis.institution = req.body.institution
    var date = new Date
    newThesis.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    User.findById(req.user.id)
    .then((user)=>{
        user.thesis.unshift(newThesis)
        user.save()
        .then((authuser)=>{
           
            for (i = 0; i < authuser.follower.length; i++) {
                User.findOne({
                        username: authuser.follower[i].username
                })
                .then((user) => {
                    const c = {}
                    c.id = authuser.thesis[0]._id
                    c.tag = 'thesis'
                    c.title = authuser.thesis[0].title
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
            t.id = authuser.thesis[0]._id
            t.tag = 'thesis'
            t.title = authuser.thesis[0].title
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

        const removeThesis = user.thesis
                    .map(item => item._id)
                    .indexOf(req.body.id)
        user.thesis.splice(removeThesis, 1)
        user.save()
        .then(()=>{
            const removeThesis = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline.splice(removeThesis, 1)
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
        const thesisIndex = user.thesis
                    .map(item => item._id)
                    .indexOf(req.params.id)
        const thesis = user.thesis[thesisIndex]
        if(thesis){
            res.render('profilecomponent/research/thesis/viewthesis', {
                thesis,
                user,
                account: false,
                auth: false
            })  
        }else{
            res.end('thesis no longer exists')
        }  
    })
    .catch((error)=>{
        console.log(error)
    })

})


module.exports = router