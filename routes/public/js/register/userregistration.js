function createUserAccount(event) {
    event.preventDefault()

    $(document).ready(function () {

        const name = $('#name1').val()
        const username = $('#username1').val()
        const email = $('#email1').val()
        const affiliation = $('#affiliation1').val()
        const country = $('#country1').val()
        const password = $('#password1').val()
        const confirmpassword = $('#rePassword1').val()
        const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
        const passwordFormat = /^[A-Za-z]\w{5,30}$/;

        if (name != '') {

            if (username != '') {
                if (email != '') {
                    if (email.match(mailformat)) {
                        if (affiliation != '') {
                            if (country != '') {
                                if (password != '') {
                                    if (password.match(passwordFormat)) {
                                        if (confirmpassword != '') {
                                            if (confirmpassword === password) {

                                                $.ajax({
                                                    method: "POST",
                                                    url: '/api/auth/registration',
                                                    headers: {
                                                        "my-first-header": "first value",
                                                        "my-second-header": "second value"
                                                    },
                                                    data: {
                                                        accountType: "user",
                                                        name: name,
                                                        username: username,
                                                        email: email,
                                                        affiliation: affiliation,
                                                        country: country,
                                                        password: password
                                                    },
                                                    beforeSend: function () {
                                                        $('#btnUserSignup').attr('disabled', 'disabled')
                                                        $('#btnUserSignup').html('please wait...')
                                                    },
                                                    success: function (responce) {
                                                        $('#btnUserSignup').removeAttr('disabled')
                                                        $('#btnUserSignup').html('Create Account')
                                                        if (responce.success == true) {

                                                            location.href = '/api/auth/activeaccount1'

                                                        } else if (responce.username == "exist") {
                                                            Swal.fire({
                                                                type: 'warning',
                                                                html: 'Username already exist'
                                                            })
                                                        } else if (responce.email == "exist") {
                                                            Swal.fire({
                                                                type: 'warning',
                                                                html: 'user already exist with this email'
                                                            })
                                                        } else if (responce.email == "notexist") {

                                                            Swal.fire({
                                                                type: 'warning',
                                                                html: 'email doennot exist anymore please check'
                                                            })

                                                        }
                                                    }
                                                })

                                            } else {
                                                Swal.fire({
                                                    type: 'warning',
                                                    html: 'password doennot match yet'
                                                })
                                            }
                                        } else {
                                            Swal.fire({
                                                type: 'warning',
                                                html: 'please confirm your password'
                                            })
                                        }
                                    } else {
                                        Swal.fire({
                                            type: 'warning',
                                            html: 'please follow password format'
                                        })
                                    }
                                } else {
                                    Swal.fire({
                                        type: 'warning',
                                        html: 'please type password'
                                    })
                                }
                            } else {
                                Swal.fire({
                                    type: 'warning',
                                    html: 'please type country'
                                })
                            }
                        } else {
                            Swal.fire({
                                type: 'warning',
                                html: 'please type affiliation'
                            })
                        }

                    } else {
                        Swal.fire({
                            type: 'warning',
                            html: 'email format does not valid'
                        })
                    }
                } else {
                    Swal.fire({
                        type: 'warning',
                        html: 'please type email'
                    })
                }
            } else {
                Swal.fire({
                    type: 'warning',
                    html: 'please type username'
                })
            }

        } else {
            Swal.fire({
                type: 'warning',
                html: 'please type fullname'
            })
        }
    })

}