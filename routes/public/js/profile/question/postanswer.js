//show code container
$(document).ready(function () {
    $("#btnCodeCon").click(function () {
        $("#answerCodeCon").toggle(500)
        $("#btnAnswerCon").toggle(500)
        if ($("#btnCodeCon").html() == "Close code") {
            $("#btnCodeCon").html("Write code")
        } else if ($("#btnCodeCon").html() == "Write code") {
            $("#btnCodeCon").html("Close code")
        }
    })
})
//show text container
$(document).ready(function () {
    $("#btnTextCon").click(function () {
        $("#answerTextCon").toggle(500)
        $("#btnAnswerCon").toggle(500)
        if ($("#btnTextCon").html() == "Close text") {
            $("#btnTextCon").html("Write text")
        } else if ($("#btnTextCon").html() == "Write text") {
            $("#btnTextCon").html("Close text")
        }
    })
})
//post answer
function trimfield(str) {
    return str.replace(/^\s+|\s+$/g, '');
}


//post answer route
function postAnswer(event, username, qid, q) {
    event.preventDefault()
    if (document.cookie) {
        var ansText = trimfield(document.getElementById('answerText').value)
        var ansCode = trimfield(document.getElementById('answerCode').value)
        if (ansText != "") {
            $.ajax({
                method: "POST",
                url: "/api/questions/answers/" + qid+'/'+username,
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                data: {
                    anstext: ansText,
                    anscode: ansCode
                },
                beforeSend: function () {
                    $("#loadCon").removeClass('d-none')
                },
                success: function (responce) {
                    $("#loadConText").html('Successfully submited')
                    setTimeout(function () {
                        $("#loadCon").addClass('d-none')
                        $("#loadConText").html("")
                        location.reload()
                    }, 3000)
                }
            })
        } else {
            Swal.fire({
                type: 'warning',
                html: 'Please type your answer as text or code or both'
            })
        }
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please Login or Register first'
        })
    }
}