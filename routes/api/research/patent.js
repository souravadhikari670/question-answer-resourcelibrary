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

    const newPatent = {}
    newPatent.title = req.body.title
    if (typeof req.body.inventors !== undefined) {
        newPatent.inventors = req.body.inventors.split(',')
    }
    if (typeof req.body.keyword !== undefined) {
        newPatent.keyword = req.body.keyword.split(',')
    }
    newPatent.description = req.body.description
    newPatent.publicationdate = req.body.publicationdate
    newPatent.patentoffice = req.body.patentoffice
    newPatent.patentnumber = req.body.patentnumber
    newPatent.applicationnumber = req.body.applicationnumber
    var date = new Date
    newPatent.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    User.findById(req.user.id)
    .then((user)=>{
        user.patent.unshift(newPatent)
        user.save()
        .then((authuser)=>{
           
            for (i = 0; i < authuser.follower.length; i++) {
                User.findOne({
                        username: authuser.follower[i].username
                })
                .then((user) => {
                    const c = {}
                    c.id = authuser.patent[0]._id
                    c.tag = 'patent'
                    c.title = authuser.patent[0].title
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
            t.id = authuser.patent[0]._id
            t.tag = 'patent'
            t.title = authuser.patent[0].title
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

        const removePatent = user.patent
                    .map(item => item._id)
                    .indexOf(req.body.id)
        user.patent.splice(removePatent, 1)
        user.save()
        .then(()=>{
            const removePatent = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline.splice(removePatent, 1)
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
        const patentIndex = user.patent
                    .map(item => item._id)
                    .indexOf(req.params.id)
        const patent = user.patent[patentIndex]
        if(patent){
            res.render('profilecomponent/research/patent/viewpatent', {
                patent,
                user,
                account: false,
                auth: false
            })  
        }else{
            res.end('patent no longer exists')
        }  
    })
    .catch((error)=>{
        console.log(error)
    })

})


module.exports = router