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

    const newChapter = {}
    newChapter.title = req.body.title
    if (typeof req.body.authors !== undefined) {
        newChapter.authors = req.body.authors.split(',')
    }
    if (typeof req.body.keyword !== undefined) {
        newChapter.keyword = req.body.keyword.split(',')
    }
    newChapter.description = req.body.description
    newChapter.publicationdate = req.body.publicationdate
    newChapter.book = req.body.book
    newChapter.volume = req.body.volume
    newChapter.pages = req.body.pages
    newChapter.publisher = req.body.publisher
    var date = new Date
    newChapter.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
    User.findById(req.user.id)
    .then((user)=>{
        user.chapter.unshift(newChapter)
        user.save()
        .then((authuser)=>{
           
            for (i = 0; i < authuser.follower.length; i++) {
                User.findOne({
                        username: authuser.follower[i].username
                })
                .then((user) => {
                    const c = {}
                    c.id = authuser.chapter[0]._id
                    c.tag = 'chapter'
                    c.title = authuser.chapter[0].title
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
            t.id = authuser.chapter[0]._id
            t.tag = 'chapter'
            t.title = authuser.chapter[0].title
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

                const editChapter = user.chapter
                    .map(item => item._id)
                    .indexOf(req.body.id)

                res.send({
                    chapter: user.chapter[editChapter]
                })

            })
            .catch((error) => {
                console.log(error)
            })

    })


//edit post chapter
router.post('/edit/post',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.user.username
            })
            .then((user) => {

                const editChapterIndex = user.chapter
                    .map(item => item._id)
                    .indexOf(req.body.id)

                user.chapter[editChapterIndex].title = req.body.title
                if (typeof req.body.authors !== undefined) {
                    user.chapter[editChapterIndex].authors = req.body.authors.split(',')
                }
                if (typeof req.body.keyword !== undefined) {
                    user.chapter[editChapterIndex].keyword = req.body.keyword.split(',')
                }
                user.chapter[editChapterIndex].description = req.body.description
                user.chapter[editChapterIndex].publicationdate = req.body.publicationdate
                user.chapter[editChapterIndex].volume = req.body.volume
                user.chapter[editChapterIndex].book = req.body.book
                user.chapter[editChapterIndex].pages = req.body.pages
                user.chapter[editChapterIndex].publisher = req.body.publisher
                var date = new Date
                user.chapter[editChapterIndex].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()


                const editChapterIndexTimeline = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
                user.timeline[editChapterIndexTimeline].id = req.body.id
                user.timeline[editChapterIndexTimeline].tag = 'chapter'
                user.timeline[editChapterIndexTimeline].title = req.body.title
                user.timeline[editChapterIndexTimeline].username = req.user.username
                user.timeline[editChapterIndexTimeline].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

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

    User.findOne({username:req.body.username})
    .then((user)=>{

        const removeChapter = user.chapter
                    .map(item => item._id)
                    .indexOf(req.body.id)
        user.chapter.splice(removeChapter, 1)
        user.save()
        .then(()=>{
            const removeChapter = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline.splice(removeChapter, 1)
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


//view chapter
router.get('/:username/:id/:title',(req, res)=>{

    User.findOne({username:req.params.username})
    .then((user)=>{
        const chapterIndex = user.chapter
                    .map(item => item._id)
                    .indexOf(req.params.id)
        const chapter = user.chapter[chapterIndex]
        if(chapter){
            res.render('profilecomponent/research/chapter/viewchapter', {
                chapter,
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