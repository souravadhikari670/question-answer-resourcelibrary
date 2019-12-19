function formSubmit(event) {
    event.preventDefault()

    $(document).ready(function () {
        var code = $('#signupCode').val()
        if (code != "") {
            if (code.length != 8) {
                Swal.fire({
                    type: 'warning',
                    html: 'Please type a valid activation code'
                })
            } else {

                $.ajax({
                    method: "POST",
                    url: "/api/auth/accountactivate",
                    data: {
                        code
                    },
                    headers: {
                        "my-first-header": "first value",
                        "my-second-header": "second value"
                    },
                    beforeSend: function () {
                        $('#btnActive').attr('disabled', 'disabled')
                        $('#btnActive').html("checking...")
                    },
                    success: function (responce) {

                        if (responce.success == true) {
                            location.href = '/api/profile'
                        } else if (responce.code == 'notmatch') {

                            $('#btnActive').removeAttr('disabled')
                            $('#btnActive').html("Activate")
                            Swal.fire({
                                type: 'warning',
                                html: 'Activationc code not match, please check your email'
                            })
                        }
                    }
                })
            }
        } else {
            Swal.fire({
                type: 'warning',
                html: 'Please type your activation code'
            })
        }
    })
}

function reSendCode(event) {
    event.preventDefault()
    $(document).ready(function () {
        $.ajax({
            method: "POST",
            url: "/api/auth/resendcode",
            beforeSend: function(){
                $('#btnActivate').attr('disabled','disabled')
            },
            success: function (responce) {
                $('#btnActivate').removeAttr('disabled')
                if (responce.success == true) {
                    Swal.fire({
                        type: 'success',
                        html: 'Send activation code to your email'
                    })
                }
            }
        })
    })
}