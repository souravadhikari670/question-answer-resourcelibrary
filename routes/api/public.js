const express = require('express')
const router = express.Router()
const passport = require('passport')
const sessionStorage = require('sessionstorage')

router.get('/',
passport.authenticate('jwt',{session:false, successRedirect:'/api/profile',failureRedirect:'/home'})
,(req, res)=>{

})

router.get('/home',(req, res)=>{
    const auth = false
    res.render('home',{auth})
})


router.post('/logout',(req, res)=>{
    res.clearCookie('token')
    sessionStorage.clear('email')
    res.redirect('/')
})

module.exports = router