const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const sendmail = require('@sendgrid/mail')

const User = require('../../../modal/User')

router.get('/:username/allresearch', (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/api/research/' + req.params.username + '/viewresearch',
        successRedirect: '/api/research/' + req.params.username + '/myresearch'
    })(req, res, next);
})


router.get('/:username/myresearch',
passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'}),  (req, res)=>{

    User.findOne({username:req.params.username})
    .then((user)=>{
        
        if (req.user.username == req.params.username) {
            res.render('profilecomponent/research/viewresearch', {
                user,
                account: true,
                auth: true,
                sort: false
            })
        } else {
            res.render('profilecomponent/research/viewresearch', {
                user,
                account: false,
                auth: true,
                sort: false
            })
        }
    })
    .catch((error)=>{
        console.log(error)
    })

})


router.get('/:username/viewresearch',
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {

                res.render('profilecomponent/research/viewresearch', {
                    user,
                    account: false,
                    auth: false,
                    sort: false
                })

            })
            .catch((error) => {
                console.log(error)
            })
    })


module.exports = router