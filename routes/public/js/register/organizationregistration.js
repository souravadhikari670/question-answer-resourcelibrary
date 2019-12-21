$(document).ready(function () {

    $('#category2').on('change', function () {

        if ($('#category2 option:selected').val() == 'Journal') {
            $('#ifJournal').removeClass('d-none')
        } else {
            $('#ifJournal ').addClass('d-none')
        }
    })
})

function createOrganizationAccount(event) {
    event.preventDefault()
    const name = $('#name2').val()
    const username = $('#username2').val()
    const email = $('#email2').val()
    const affiliation = $('#affiliation2').val()
    const country = $('#country2').val()
    const type = $('#type2 option:selected').val()
    const category = $('#category2 option:selected').val()
    const impactfactor = $('#impactfactor2').val()
    const hindex = $("#hindex2").val()
    const password = $('#password2').val()
    const confirmpassword = $('#rePassword2').val()

    let jCategoryString = ""
    const jCategory = document.getElementsByClassName(' jCategory')
    for (i = 0; i < jCategory.length; i++) {
        if (jCategory[i].checked == true) {
            jCategoryString += jCategory[i].value + ','
        }
    }


    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    const passwordFormat = /^[A-Za-z]\w{5,30}$/;


    // console.log(name +","+username+","+email+","+affiliation+","+country+","+type+","+category+","+impactfactor+","+hindex+","+password+","+confirmpassword+","+jCategoryString)
    if (name != '') {
        if (username != '') {
            if (email != '') {
                if (email.match(mailformat)) {
                    if (affiliation != '') {
                        if (country != '') {
                            if (type != '') {
                                if (category != '') {

                                    if (category == 'Journal') {

                                        if (impactfactor != '') {
                                            if (hindex != '') {
                                                if (jCategoryString != "") {
                                                    jCategoryString = jCategoryString.substring(0, jCategoryString.length - 1);
                                                    if (password != '') {
                                                        if (confirmpassword != '') {
                                                            if (password === confirmpassword) {

                                                                //ajax request

                                                                $.ajax({
                                                                    method: "POST",
                                                                    url: "/api/auth/registration/organization",
                                                                    data: {
                                                                        accountType: "organization",
                                                                        name: name,
                                                                        username: username,
                                                                        email: email,
                                                                        affiliation: affiliation,
                                                                        country: country,
                                                                        type: type,
                                                                        category: category,
                                                                        impactfactor: impactfactor,
                                                                        hindex: hindex,
                                                                        jCategory: jCategoryString,
                                                                        password: password,
                                                                    },
                                                                    beforeSend: function () {
                                                                        $('#btnOrganizationSignup').attr('disabled', 'disabled')
                                                                        $('#btnOrganizationSignup').html('please wait...')
                                                                    },
                                                                    success: function (responce) {
                                                                        $('#btnOrganizationSignup').removeAttr('disabled')
                                                                        $('#btnOrganizationSignup').html('Create Account')
                                                                        if (responce.success == true) {

                                                                            location.href = '/api/auth/activeaccount1'

                                                                        } else if (responce.username == "exist") {
                                                                            Swal.fire({
                                                                                type: 'warning',
                                                                                html: 'username already exist'
                                                                            })
                                                                        } else if (responce.email == "exist") {
                                                                            Swal.fire({
                                                                                type: 'warning',
                                                                                html: 'email already exist'
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
                                                            html: 'Please type password'
                                                        })
                                                    }

                                                } else {
                                                    Swal.fire({
                                                        type: 'warning',
                                                        html: 'Please select minimum one journal category!'
                                                    })
                                                }
                                            } else {
                                                Swal.fire({
                                                    type: 'warning',
                                                    html: 'Please type hindex'
                                                })
                                            }
                                        } else {
                                            Swal.fire({
                                                type: 'warning',
                                                html: 'Please type impact factor'
                                            })
                                        }

                                    } else {
                                        if (password != '') {
                                            if (confirmpassword != '') {
                                                if (password === confirmpassword) {

                                                    //ajax request

                                                    $.ajax({
                                                        method: "POST",
                                                        url: "/api/auth/registration/organization",
                                                        data: {
                                                            accountType: "organization",
                                                            name: name,
                                                            username: username,
                                                            email: email,
                                                            affiliation: affiliation,
                                                            country: country,
                                                            type: type,
                                                            category: category,
                                                            password: password
                                                        },
                                                        beforeSend: function () {
                                                            $('#btnOrganizationSignup').attr('disabled', 'disabled')
                                                            $('#btnOrganizationSignup').html('please wait...')
                                                        },
                                                        success: function (responce) {
                                                            $('#btnOrganizationSignup').removeAttr('disabled')
                                                            $('#btnOrganizationSignup').html('Create Account')
                                                            if (responce.success == true) {

                                                                location.href = '/api/auth/activeaccount1'

                                                            } else if (responce.username == "exist") {
                                                                Swal.fire({
                                                                    type: 'warning',
                                                                    html: 'username already exist'
                                                                })
                                                            } else if (responce.email == "exist") {
                                                                Swal.fire({
                                                                    type: 'warning',
                                                                    html: 'email already exist'
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
                                                html: 'Please type password'
                                            })
                                        }
                                    }

                                } else {
                                    Swal.fire({
                                        type: 'warning',
                                        html: 'Please select organization category'
                                    })
                                }
                            } else {
                                Swal.fire({
                                    type: 'warning',
                                    html: 'Please select organization type'
                                })
                            }
                        } else {
                            Swal.fire({
                                type: 'warning',
                                html: 'Please type country'
                            })
                        }
                    } else {
                        Swal.fire({
                            type: 'warning',
                            html: 'Please type affiliation'
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
                    html: 'Please type your email'
                })
            }
        } else {
            Swal.fire({
                type: 'warning',
                html: 'Please type unsername'
            })
        }
    } else {
        Swal.fire({
            type: 'warning',
            html: 'Please type your name'
        })
    }
}