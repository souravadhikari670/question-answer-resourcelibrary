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
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        const newJournal = {}
        newJournal.title = req.body.title
        if (typeof req.body.authors !== undefined) {
            newJournal.authors = req.body.authors.split(',')
        }
        if (typeof req.body.keyword !== undefined) {
            newJournal.keyword = req.body.keyword.split(',')
        }
        newJournal.description = req.body.description
        newJournal.publicationdate = req.body.publicationdate
        newJournal.journal = req.body.journal
        newJournal.volume = req.body.volume
        newJournal.issue = req.body.issue
        newJournal.pages = req.body.pages
        newJournal.publisher = req.body.publisher
        var date = new Date
        newJournal.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        User.findById(req.user.id)
            .then((user) => {
                user.journal.unshift(newJournal)
                user.save()
                    .then((authuser) => {

                        for (i = 0; i < authuser.follower.length; i++) {
                            User.findOne({
                                    username: authuser.follower[i].username
                                })
                                .then((user) => {
                                    const j = {}
                                    j.id = authuser.journal[0]._id
                                    j.tag = 'journal'
                                    j.title = authuser.journal[0].title
                                    j.username = authuser.username
                                    j.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                                    user.researchnotification.unshift(j)
                                    user.timeline.unshift(j)
                                    user.save()
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                        const t = {}
                        t.id = authuser.journal[0]._id
                        t.tag = 'journal'
                        t.title = authuser.journal[0].title
                        t.username = authuser.username
                        t.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                        authuser.timeline.unshift(t)
                        authuser.save()
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
            .catch((error) => {
                console.log(error)
            })

    })

//delete journal
router.post('/delete',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.body.username
            })
            .then((user) => {

                const removeJournal = user.journal
                    .map(item => item._id)
                    .indexOf(req.body.id)
                user.journal.splice(removeJournal, 1)
                user.save()
                    .then(() => {
                        const removeJournal = user.timeline
                            .map(item => item.id)
                            .indexOf(req.body.id)
                        user.timeline.splice(removeJournal, 1)
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
            .catch((error) => {
                console.log(error)
            })

    })

//edit journal
router.post('/edit',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.body.username
            })
            .then((user) => {

                const editJournal = user.journal
                    .map(item => item._id)
                    .indexOf(req.body.id)
                 res.send({journal:user.journal[editJournal]})   

            })
            .catch((error) => {
                console.log(error)
            })

    })

//edit post journal
router.post('/edit/post',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.user.username
            })
            .then((user) => {

                const editJournalIndex = user.journal
                    .map(item => item._id)
                    .indexOf(req.body.id)
                
            user.journal[editJournalIndex].title = req.body.title
            if (typeof req.body.authors !== undefined) {
                user.journal[editJournalIndex].authors = req.body.authors.split(',')
            }
            if (typeof req.body.keyword !== undefined) {
                user.journal[editJournalIndex].keyword = req.body.keyword.split(',')
            }
            user.journal[editJournalIndex].description = req.body.description
            user.journal[editJournalIndex].publicationdate = req.body.publicationdate
            user.journal[editJournalIndex].journal = req.body.journal
            user.journal[editJournalIndex].volume = req.body.volume
            user.journal[editJournalIndex].issue = req.body.issue
            user.journal[editJournalIndex].pages = req.body.pages
            user.journal[editJournalIndex].publisher = req.body.publisher
            var date = new Date
            user.journal[editJournalIndex].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
            

            const editJournalIndexTimeline = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
            user.timeline[editJournalIndexTimeline].id = req.body.id
            user.timeline[editJournalIndexTimeline].tag = 'journal'
            user.timeline[editJournalIndexTimeline].title = req.body.title
            user.timeline[editJournalIndexTimeline].username = req.user.username
            user.timeline[editJournalIndexTimeline].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

            user.save()
            .then(()=>{

                res.send({success:true})

            })
            .catch((error)=>{
                console.log(error)
            })

            })
            .catch((error) => {
                console.log(error)
            })

    })


//view journal
router.get('/:username/:id/:title', (req, res) => {

    User.findOne({
            username: req.params.username
        })
        .then((user) => {
            const journalIndex = user.journal
                .map(item => item._id)
                .indexOf(req.params.id)
            const journal = user.journal[journalIndex]
            if (journal) {
                res.render('profilecomponent/research/journal/viewjournal', {
                    journal,
                    user,
                    account: false,
                    auth: false
                })
            } else {
                res.end('journal no longer exists')
            }
        })
        .catch((error) => {
            console.log(error)
        })

})


module.exports = router