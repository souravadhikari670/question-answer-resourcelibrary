
//upvote of answers
function faUpAns(event,username, qid, aid) {
    event.preventDefault()
    if (document.cookie) {
        $.ajax({
            method: "POST",
            url: "/api/questions/answers/upvote/" + qid + "/" + aid + "/" + username,
            headers: {
                "my-first-header": "first value",
                "my-second-header": "second value"
            },
            beforeSend: function () {
                document.getElementById('ansVoteup'+aid).classList.add('d-none')
                document.getElementById("loaderAnsVoteup" + aid).classList.remove('d-none')
            },
            success: function (responce) {
                document.getElementById('ansVoteup'+aid).classList.remove('d-none')
                document.getElementById("loaderAnsVoteup" + aid).classList.add('d-none')
                if (responce.upvote == 'withdraw vote') {
                    Swal.fire({
                        type: 'success',
                        html: 'removed from like'
                    })
                    document.getElementById('ansVoteup'+responce.ansid).innerHTML = responce.sizeupvote
                }
                if (responce.user == "error") {
                    Swal.fire({
                        type: 'warning',
                        html: 'You cannot give vote to your own posted answer'
                    })
                }if(responce.upvote == "ok"){
                    Swal.fire({
                        type: 'success',
                        html: 'added to like'
                    })
                    document.getElementById('ansVoteup'+responce.ansid).innerHTML = responce.sizeupvote
                    document.getElementById('ansVotedown'+responce.ansid).innerHTML = responce.sizedownvote
                }
            }
        })
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please Login or Register first'
        })
    }
}
//downvote of answers
function faDownAns(event,username, qid, aid) {

    event.preventDefault()
    if (document.cookie) {
        $.ajax({
            method: "POST",
            url: "/api/questions/answers/downvote/" + qid + "/" + aid + "/" + username,
            headers: {
                "my-first-header": "first value",
                "my-second-header": "second value"
            },
            beforeSend: function () {
                document.getElementById('ansVotedown'+aid).classList.add('d-none')
                document.getElementById("loaderAnsVotedown" + aid).classList.remove('d-none')
            },
            success: function (responce) {
                document.getElementById('ansVotedown'+aid).classList.remove('d-none')
                document.getElementById("loaderAnsVotedown" + aid).classList.add('d-none')
                if (responce.downvote == "withdraw vote") {
                    Swal.fire({
                        type: 'success',
                        html: 'removed from dislike'
                    })
                    document.getElementById('ansVotedown'+responce.ansid).innerHTML = responce.sizedownvote
                }
                if (responce.user == "error") {
                    Swal.fire({
                        type: 'warning',
                        html: 'You cannot give vote to your own posted answer'
                    })
                }if (responce.size == undefined) {
                    document.getElementById('ansVoteup'+responce.ansid).innerHTML = "0"
                }if(responce.downvote == "ok"){
                    Swal.fire({
                        type: 'success',
                        html: 'added to dislike'
                    })
                    document.getElementById('ansVoteup'+responce.ansid).innerHTML = responce.sizeupvote
                    document.getElementById('ansVotedown'+responce.ansid).innerHTML = responce.sizedownvote
                }
            }
        })
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please Login or Register first'
        })
    }
}

//question upvote
function faUpQues(event,username, qid) {
    event.preventDefault()
    if (document.cookie) {
        $.ajax({
            method: "POST",
            url: "/api/questions/upvote/" + qid + "/" + username,
            headers: {
                "my-first-header": "first value",
                "my-second-header": "second value"
            },
            beforeSend: function () {
                document.getElementById('quesVoteup'+qid).classList.add('d-none')
                document.getElementById("loaderQuesVoteup" + qid).classList.remove('d-none')
            },
            success: function (responce) {
                document.getElementById('quesVoteup'+qid).classList.remove('d-none')
                document.getElementById("loaderQuesVoteup" + qid).classList.add('d-none')
                if (responce.noupvote == 'withdraw vote') {
                    Swal.fire({
                        type: 'success',
                        html: 'removed from like'
                    })
                    document.getElementById('quesVoteup'+responce.quesid).innerHTML = responce.sizeupvote
                }
                if (responce.user == "error") {
                    Swal.fire({
                        type: 'warning',
                        html: 'You cannot give vote to your own question'
                    })
                } else if(responce.upvote == "ok"){
                    Swal.fire({
                        type: 'success',
                        html: 'added to like'
                    })
                    document.getElementById('quesVoteup'+responce.quesid).innerHTML = responce.sizeupvote
                    document.getElementById('quesVotedown'+responce.quesid).innerHTML = responce.sizedownvote
                }
            }
        })
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please Login or Register first'
        })
    }
}

//downvote of questions
function faDownQues(event,username, qid) {
    event.preventDefault()
    if (document.cookie) {
        $.ajax({
            method: "POST",
            url: "/api/questions/downvote/" + qid + "/" + username,
            headers: {
                "my-first-header": "first value",
                "my-second-header": "second value"
            },
            beforeSend: function () {
                document.getElementById('quesVotedown'+qid).classList.add('d-none')
                document.getElementById("loaderQuesVotedown" + qid).classList.remove('d-none')
            },
            success: function (responce) {
                document.getElementById('quesVotedown'+qid).classList.remove('d-none')
                document.getElementById("loaderQuesVotedown" + qid).classList.add('d-none')
                if (responce.nodownvote == "withdraw vote") {
                    Swal.fire({
                        type: 'success',
                        html: 'removed from dislike'
                    })
                    document.getElementById('quesVotedown'+responce.quesid).innerHTML = responce.sizedownvote
                }
                if (responce.user == "error") {
                    Swal.fire({
                        type: 'warning',
                        html: 'You cannot give vote to your own question'
                    })
                }
                if (responce.sizedownvote == undefined) {
                    document.getElementById('quesVotedown'+responce.quesid).innerHTML = "0"
                }
                if(responce.downvote == "ok"){
                    Swal.fire({
                        type: 'success',
                        html: 'added to dislike'
                    })
                    
                    document.getElementById('quesVotedown'+responce.quesid).innerHTML = responce.sizedownvote
                    
                    document.getElementById('quesVoteup'+responce.quesid).innerHTML = responce.sizeupvote
                }
            }
        })
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please Login or Register first'
        })
    }
}

//follow question
function followQuestion(event,username, id)
{
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/questions/followquestion",
            headers: {
                "my-first-header": "first value",
                "my-second-header": "second value"
            },
            data:{
                id:id,
                username:username
            },
            success: function(responce){
                
                if(responce.success == true && responce.data == "follow")
                {
                    Swal.fire({
                        type: 'success',
                        html: 'you follow this question'
                    })
                    document.getElementById('qid'+id).style.color = '#E83350'
                }
                if(responce.success == true && responce.data == "unfollow")
                {
                    Swal.fire({
                        type: 'success',
                        html: 'you unfollow this question'
                    })
                    document.getElementById('qid'+id).style.color = 'black'
                }
                if(responce.user == "error")
                {
                    Swal.fire({
                        type: 'warning',
                        html: 'you can not follow your own question'
                    })
                }
            }

        })
    })
}