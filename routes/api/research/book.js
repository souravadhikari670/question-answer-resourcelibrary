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

        const newBook = {}
        newBook.title = req.body.title
        if (typeof req.body.authors !== undefined) {
            newBook.authors = req.body.authors.split(',')
        }
        if (typeof req.body.keyword !== undefined) {
            newBook.keyword = req.body.keyword.split(',')
        }
        newBook.description = req.body.description
        newBook.publicationdate = req.body.publicationdate
        newBook.volume = req.body.volume
        newBook.issue = req.body.issue
        newBook.pages = req.body.pages
        newBook.publisher = req.body.publisher
        var date = new Date
        newBook.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
        User.findById(req.user.id)
            .then((user) => {
                user.book.unshift(newBook)
                user.save()
                    .then((authuser) => {

                        for (i = 0; i < authuser.follower.length; i++) {
                            User.findOne({
                                    username: authuser.follower[i].username
                                })
                                .then((user) => {
                                    const c = {}
                                    c.id = authuser.book[0]._id
                                    c.tag = 'book'
                                    c.title = authuser.book[0].title
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
                        t.id = authuser.book[0]._id
                        t.tag = 'book'
                        t.title = authuser.book[0].title
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

                const removeBook = user.book
                    .map(item => item._id)
                    .indexOf(req.body.id)
                user.book.splice(removeBook, 1)
                user.save()
                    .then(() => {
                        const removeBook = user.timeline
                            .map(item => item.id)
                            .indexOf(req.body.id)
                        user.timeline.splice(removeBook, 1)
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

//edit book
router.post('/edit',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.body.username
            })
            .then((user) => {

                const editBook = user.book
                    .map(item => item._id)
                    .indexOf(req.body.id)

                res.send({
                    book: user.book[editBook]
                })

            })
            .catch((error) => {
                console.log(error)
            })

    })


//edit post book
router.post('/edit/post',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findOne({
                username: req.user.username
            })
            .then((user) => {

                const editBookIndex = user.book
                    .map(item => item._id)
                    .indexOf(req.body.id)

                user.book[editBookIndex].title = req.body.title
                if (typeof req.body.authors !== undefined) {
                    user.book[editBookIndex].authors = req.body.authors.split(',')
                }
                if (typeof req.body.keyword !== undefined) {
                    user.book[editBookIndex].keyword = req.body.keyword.split(',')
                }
                user.book[editBookIndex].description = req.body.description
                user.book[editBookIndex].publicationdate = req.body.publicationdate
                user.book[editBookIndex].volume = req.body.volume
                user.book[editBookIndex].pages = req.body.pages
                user.book[editBookIndex].publisher = req.body.publisher
                var date = new Date
                user.book[editBookIndex].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()


                const editBookIndexTimeline = user.timeline
                    .map(item => item.id)
                    .indexOf(req.body.id)
                user.timeline[editBookIndexTimeline].id = req.body.id
                user.timeline[editBookIndexTimeline].tag = 'book'
                user.timeline[editBookIndexTimeline].title = req.body.title
                user.timeline[editBookIndexTimeline].username = req.user.username
                user.timeline[editBookIndexTimeline].date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

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



//view journal
router.get('/:username/:id/:title', (req, res) => {

    User.findOne({
            username: req.params.username
        })
        .then((user) => {
            const bookIndex = user.book
                .map(item => item._id)
                .indexOf(req.params.id)
            const book = user.book[bookIndex]
            if (book) {
                res.render('profilecomponent/research/book/viewbook', {
                    book,
                    user,
                    account: false,
                    auth: false
                })
            } else {
                res.end('book no longer exists')
            }
        })
        .catch((error) => {
            console.log(error)
        })

})


module.exports = router