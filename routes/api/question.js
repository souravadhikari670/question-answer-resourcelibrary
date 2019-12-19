const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')
const sendmail = require('@sendgrid/mail')

// modal
const User = require('../../modal/User')


//post questions
//this is private route
router.post('/postquestion',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }),
    (req, res) => {

        const newQuestion = {}
        if (req.body.text) newQuestion.text = req.body.text
        if (req.body.code) newQuestion.code = req.body.code
        if (typeof req.body.tag !== undefined) {
            newQuestion.tag = req.body.tag.split(',')
        }
        var date = new Date
        newQuestion.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()

        User.findById(req.user.id)
            .then((authuser) => {
                authuser.question.unshift(newQuestion)
                authuser.save()
                    .then((user) => {
                        const question = user.question[0]
                        for (i = 0; i < authuser.follower.length; i++) {
                            User.findOne({
                                    username: authuser.follower[i].username
                                })
                                .then((user) => {
                                    const q = {}
                                    q.username = authuser.username
                                    q.title = question.text
                                    q.tag = "question"
                                    q.id = question._id
                                    q.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                                    user.questionnotification.unshift(q)
                                    user.timeline.unshift(q)
                                    user.save()
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        }
                        const q = {}
                        q.username = authuser.username
                        q.title = question.text
                        q.tag = "question"
                        q.id = question._id
                        q.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                        user.timeline.unshift(q)
                        user.save()
                        .then(()=>{
                            res.send({
                                success: true
                            })
                        })
                        .catch((error)=>{
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


router.get('/:username/questions', (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/api/questions/' + req.params.username + '/viewquestions',
        successRedirect: '/api/questions/' + req.params.username + '/allquestions'
    })(req, res, next);
})

router.get('/:username/allquestions',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }),
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {

                if (req.user.username == req.params.username) {
                    res.render('profilecomponent/question/viewquestion', {
                        user,
                        account: true,
                        auth: true,
                        sort: false
                    })
                } else {
                    res.render('profilecomponent/question/viewquestion', {
                        user,
                        account: false,
                        auth: true,
                        sort: false
                    })
                }

            })
            .catch((error) => {
                console.log(error)
            })
    })

router.get('/:username/viewquestions',
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {

                res.render('profilecomponent/question/viewquestion', {
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



//delete question
//this is a private route
router.post('/deletequestion/:qid/:username',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }), (req, res) => {

        User.findById(req.user.id)
            .then((user) => {
                const removeQuestion = user.question
                    .map(item => item._id)
                    .indexOf(req.params.qid)
                user.question.splice(removeQuestion, 1)
                user.save()
                    .then((user) => {
                        res.redirect('/api/questions/' + req.params.username + '/allquestions')
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            })
            .catch((error) => {
                console.log(error)
            })
    })

router.get('/:qid/:username/:q/', (req, res, next) => {
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/api/questions/' + req.params.username + '/viewquestions/' + req.params.qid + '/' + req.params.q,
        successRedirect: '/api/questions/' + req.params.username + '/allquestions/' + req.params.qid + '/' + req.params.q
    })(req, res, next);
})

//view question
//this is public route
router.get('/:username/allquestions/:qid/:q',
    passport.authenticate('jwt', {
        session: false,
        failureRedirect: '/sessionexpire'
    }),
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {

                const questionIndex = user.question
                    .map(item => item._id)
                    .indexOf(req.params.qid)
                const question = user.question[questionIndex]

                if (req.params.username == req.user.username) {
                    if(user.question[questionIndex].followquestion.filter(q => q.id.toString() === req.user.id.toString()).length > 0)
                    {
                    res.render('profilecomponent/question/aboutquestion', {
                        question,
                        user,
                        account: true,
                        auth: true,
                        follow:''
                    })
                } else{
                    res.render('profilecomponent/question/aboutquestion', {
                        question,
                        user,
                        account: true,
                        auth: true,
                        follow:''
                    })
                }
                }else {
                    if(user.question[questionIndex].followquestion.filter(q => q.id.toString() === req.user.id.toString()).length > 0)
                    {
                        res.render('profilecomponent/question/aboutquestion', {
                            question,
                            user,
                            account: false,
                            auth: true,
                            follow:true
                        })
                    }else{
                        res.render('profilecomponent/question/aboutquestion', {
                            question,
                            user,
                            account: false,
                            auth: true,
                            follow:false
                        }) 
                    }
                }

            })
            .catch((error) => {
                console.log(error)
            })
    })
//view question
//this is public route
router.get('/:username/viewquestions/:qid/:q',
    (req, res) => {

        User.findOne({
                username: req.params.username
            })
            .then((user) => {

                const questionIndex = user.question
                    .map(item => item._id)
                    .indexOf(req.params.qid)
                const question = user.question[questionIndex]
                if(question){
                res.render('profilecomponent/question/aboutquestion', {
                    question,
                    user,
                    account: false,
                    auth: false
                })
            }else{
                res.end('question is no longer exists')
            }

            })
            .catch((error) => {
                console.log(error)
            })
    })

//post answer
//this is a private route
router.post('/answers/:qid/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    if (!req.user.id) {
        res.redirect('/logout')
    }
    User.findOne({
            username: req.params.username
        })
        .then((user) => {
            var date = new Date
            const newAnswer = {
                user: req.user.id,
                name: req.user.name,
                username: req.user.username,
                anstext: req.body.anstext,
                anscode: req.body.anscode,
                date: date.toLocaleDateString() + " " + date.toLocaleTimeString()
            }
            const questionIndex = user.question
                .map(item => item._id)
                .indexOf(req.params.qid)

            user.question[questionIndex].answers.push(newAnswer)
                const a = {}
                a.username = req.params.username
                a.postusername = req.user.username
                a.id = req.params.qid
                a.tag = 'newanswer'
                a.title = user.question[questionIndex].text
                a.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                user.timeline.unshift(a)
            user.save()
                .then(() => {
                    
                    let date = new Date
                    for(i=0;i<user.question[questionIndex].followquestion.length;i++){
                        User.findById({_id:user.question[questionIndex].followquestion[i].id})
                        .then((fuser)=>{
                         
                            const a = {}
                            a.username = req.params.username
                            a.postusername = req.user.username
                            a.id = req.params.qid
                            a.tag = 'newanswer'
                            a.title = user.question[questionIndex].text
                            a.date = date.toLocaleDateString() + " " + date.toLocaleTimeString()
                            fuser.timeline.unshift(a)
                            fuser.save()
                        })
                    }
                    res.send({
                        newAnswer
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




//upvote for the question route
//this is private route
router.post('/upvote/:qid/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {
    User.findOne({
            username: req.params.username
        })
        .then((user) => {

            const questionIndex = user.question.map(item => item._id).indexOf(req.params.qid)
            if (user.username == req.user.username) {
                res.send({
                    user: "error"
                })
            } else if (user.question[questionIndex].upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                const removeVote = user.question[questionIndex].upvotes
                    .map(item => item.user)
                    .indexOf(req.user.id)
                user.question[questionIndex].upvotes.splice(removeVote, 1)
                user.save()
                    .then((question) => {
                        const sizeupvote = user.question[questionIndex].upvotes.length
                        const quesid = req.params.qid
                        res.send({
                            noupvote: 'withdraw vote',
                            sizeupvote,
                            quesid
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                user.question[questionIndex].upvotes.push({
                    user: req.user.id
                })
                user.save()
                    .then((question) => {

                        if (user.question[questionIndex].downvotes.filter(downvotes => downvotes.user.toString() === req.user.id.toString()).length > 0) {
                            const removeVote = user.question[questionIndex].downvotes
                                .map(item => item.user)
                                .indexOf(req.user.id)
                            user.question[questionIndex].downvotes.splice(removeVote, 1)
                            user.save()
                                .then((question) => {
                                    const sizeupvote = user.question[questionIndex].upvotes.length
                                    const sizedownvote = user.question[questionIndex].downvotes.length
                                    const quesid = req.params.qid
                                    res.send({
                                        upvote: 'ok',
                                        sizeupvote,
                                        sizedownvote,
                                        quesid
                                    })
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        } else {
                            const sizeupvote = user.question[questionIndex].upvotes.length
                            const sizedownvote = user.question[questionIndex].downvotes.length
                            const quesid = req.params.qid
                            res.send({
                                upvote: 'ok',
                                sizeupvote,
                                sizedownvote,
                                quesid
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })

})





//downvote for the question route
//this is private route
router.post('/downvote/:qid/:username', passport.authenticate('jwt', {
    session: false,
    failureRedirect: '/sessionexpire'
}), (req, res) => {

    User.findOne({username:req.params.username})
        .then((user) => {
            const questionIndex = user.question.map(item => item._id).indexOf(req.params.qid)
            if (user.username == req.user.username) {
                res.send({
                    user: "error"
                })
            } else if (user.question[questionIndex].downvotes.filter(downvotes => downvotes.user.toString() === req.user.id.toString()).length > 0) {

                const removeVote = user.question[questionIndex].downvotes
                    .map(item => item.user)
                    .indexOf(req.user.id)
                user.question[questionIndex].downvotes.splice(removeVote, 1)
                user.save()
                    .then((question) => {
                        const sizeupvote = user.question[questionIndex].upvotes.length
                        const quesid = req.params.qid
                        res.send({
                            nodownvote: 'withdraw vote',
                            sizeupvote,
                            quesid
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            } else {
                user.question[questionIndex].downvotes.push({
                    user: req.user.id
                })
                user.save()
                    .then((question) => {
                        if (user.question[questionIndex].upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0) {
                            const removeVote = user.question[questionIndex].upvotes
                                .map(item => item.user)
                                .indexOf(req.user.id)
                            user.question[questionIndex].upvotes.splice(removeVote, 1)
                            user.save()
                                .then((question) => {
                                    const sizeupvote = user.question[questionIndex].upvotes.length
                                    const sizedownvote = user.question[questionIndex].downvotes.length
                                    const quesid = req.params.qid
                                    res.send({
                                        downvote: 'ok',
                                        sizeupvote,
                                        sizedownvote,
                                        quesid
                                    })
                                })
                                .catch((error) => {
                                    console.log(error)
                                })
                        } else {
                            const sizeupvote = user.question[questionIndex].upvotes.length
                            const sizedownvote = user.question[questionIndex].downvotes.length
                            const quesid = req.params.qid
                            res.send({
                                downvote: 'ok',
                                sizeupvote,
                                sizedownvote,
                                quesid
                            })
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            }
        })
        .catch((error) => {
            console.log(error)
        })
})



//upvote for the answer route
//this is private route
router.post('/answers/upvote/:qid/:aid/:username', passport.authenticate('jwt',{session:false, failureRedirect: '/sessionexpire'}),(req, res)=>{
 
    
        User.findOne({username:req.params.username})
        .then((user)=>{
            const questionIndex = user.question.map(item => item._id).indexOf(req.params.qid)
            const answerIndex = user.question[questionIndex].answers.map(item => item._id).indexOf(req.params.aid)

            if(user.question[questionIndex].answers[answerIndex].user == req.user.id){
                res.send({user: "error"})
            }
            else if(user.question[questionIndex].answers[answerIndex].upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0){
                
                const removeVote = user.question[questionIndex].answers[answerIndex].upvotes
                    .map(item => item.user)
                    .indexOf(req.user.id)
                    user.question[questionIndex].answers[answerIndex].upvotes.splice(removeVote, 1)
                    user.save()
                    .then((question)=>{
                        const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                        const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                        const ansid = req.params.aid
                        res.send({upvote:"withdraw vote",sizeupvote, sizedownvote, ansid})
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
            else{
                user.question[questionIndex].answers[answerIndex].upvotes.push({user:req.user.id})
                user.save()
                .then((question)=>{
                    // res.json(question)
                    if(user.question[questionIndex].answers[answerIndex].downvotes.filter(downvote => downvote.user.toString() === req.user.id.toString()).length > 0){

                        const removeVote = user.question[questionIndex].answers[answerIndex].downvotes
                        .map(item => item.user)
                        .indexOf(req.user.id)
                        user.question[questionIndex].answers[answerIndex].downvotes.splice(removeVote, 1)
                        user.save()
                        .then((question)=>{
                            const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                            const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                            const ansid = req.params.aid
                            res.send({upvote: 'ok',sizeupvote, sizedownvote, ansid})
                        })
                        .catch((error)=>{
                            console.log(error)
                        })

                    }else{
                    
                        const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                        const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                        const ansid = req.params.aid
                        res.send({upvote: 'ok',sizeupvote, sizedownvote, ansid})
                    }
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })

})


//downvote for the answer route
//this is private route
router.post('/answers/downvote/:qid/:aid/:username', passport.authenticate('jwt',{session:false, failureRedirect: '/sessionexpire'}),(req, res)=>{
   
    
        User.findOne({username:req.params.username})
        .then((user)=>{
            const questionIndex = user.question.map(item => item._id).indexOf(req.params.qid)
            const answerIndex = user.question[questionIndex].answers.map(item => item._id).indexOf(req.params.aid)

            if(user.question[questionIndex].answers[answerIndex].user == req.user.id){
                res.send({user: "error"})
            }
            else if(user.question[questionIndex].answers[answerIndex].downvotes.filter(downvote => downvote.user.toString() === req.user.id.toString()).length > 0){

                const removeVote = user.question[questionIndex].answers[answerIndex].downvotes
                .map(item => item.user)
                .indexOf(req.user.id)
                user.question[questionIndex].answers[answerIndex].downvotes.splice(removeVote, 1)
                user.save()
                .then((question)=>{

                    const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                    const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                    const ansid = req.params.aid
                    res.send({downvote:"withdraw vote",sizeupvote, sizedownvote, ansid})
            })
            .catch((error)=>{
                console.log(error)
            })
            }
            else{
                user.question[questionIndex].answers[answerIndex].downvotes.push({user:req.user.id})
                user.save()
                .then((question)=>{
                  
                    if(user.question[questionIndex].answers[answerIndex].upvotes.filter(upvote => upvote.user.toString() === req.user.id.toString()).length > 0){

                        const removeVote = user.question[questionIndex].answers[answerIndex].upvotes
                            .map(item => item.user)
                            .indexOf(req.user.id)
                            user.question[questionIndex].answers[answerIndex].upvotes.splice(removeVote, 1)
                            user.save()
                            .then((question)=>{

                                const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                                const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                                const ansid = req.params.aid
                                res.send({downvote:"ok",sizeupvote, sizedownvote, ansid})
                        })
                        .catch((error)=>{
                            console.log(error)
                        })

                    }else{
                        const sizeupvote = user.question[questionIndex].answers[answerIndex].upvotes.length
                        const sizedownvote = user.question[questionIndex].answers[answerIndex].downvotes.length
                        const ansid = req.params.aid
                        res.send({downvote: 'ok',sizeupvote, sizedownvote, ansid})
                    }
                })
                .catch((error)=>{
                    console.log(error)
                })
            }
        })
        .catch((error)=>{
            console.log(error)
        })
    })


    router.post('/followquestion'
    ,passport.authenticate('jwt',{session:false,failureRedirect:'/sessionexpire'})
    ,(req, res)=>{
        User.findOne({username:req.body.username})
        .then((user)=>{
            const questionIndex = user.question.map(item => item._id).indexOf(req.body.id)
            if (req.body.username == req.user.username) {
                res.send({
                    user: "error"
                })
            } else if (user.question[questionIndex].followquestion.filter(q => q.id.toString() === req.user.id.toString()).length > 0) {

                const removeVote = user.question[questionIndex].followquestion
                    .map(item => item.id)
                    .indexOf(req.user.id)
                user.question[questionIndex].followquestion.splice(removeVote, 1)
                user.save()
                .then(()=>{
                    User.findById(req.user.id)
                    .then((authuser)=>{

                        const removeVote = authuser.followquestion
                        .map(item => item.id)
                        .indexOf(req.body.id)
                        authuser.followquestion.splice(removeVote, 1)
                        authuser.save()
                        .then(()=>{
                            res.send({success:true, data:"unfollow"})
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

            }else{
                const fuser = {}
                fuser.id = req.user.id
                user.question[questionIndex].followquestion.unshift(fuser)
                user.save()
                .then(()=>{
                    User.findById(req.user.id)
                    .then((authuser)=>{
                        const q = {}
                        q.id = user.question[questionIndex]._id
                        q.title = user.question[questionIndex].text
                        q.username = user.username

                        authuser.followquestion.unshift(q)
                        authuser.save()
                        .then(()=>{
                            res.send({success:true, data:"follow"})
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
            }
         

        })
    })


module.exports = router