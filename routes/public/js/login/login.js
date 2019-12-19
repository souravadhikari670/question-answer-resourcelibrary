function formSubmit(event){
    event.preventDefault()
    $(document).ready(function(){
      
        var email = $('#email').val()
        var password = $('#password').val()
        
        if( email === "" ){
                Swal.fire({
                type: 'warning',
                text: 'Please type your email first',
                })
        }else{
            var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
            if(email.match(mailformat)){
    
                if( password === ""){
                    Swal.fire({
                    type: 'warning',
                    text: 'Please type your password',
                    })
                }else{
                    $.ajax({
                        method:"POST",
                        url:"/api/auth/login",
                        headers: {
                            "my-first-header": "first value",
                            "my-second-header": "second value"
                        },
                        data:{
                            email:email,
                            password:password
                        },
                        beforeSend: function(){

                        },
                        success: function(responce){
                            if(responce.success === true){
                                location.href = '/api/profile'
                            }
                            if(responce.status == "pending"){

                                Swal.fire({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Your account is not activated please check your email for activation code',
                                    })
                                $('#btnActivate').removeClass('d-none')
                            }
                            if(responce.emailEerror == "emailIncorrect"){
                                Swal.fire({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'User not found with this email',
                                })
                                    $('#btnLogin').removeAttr('disabled')
                                    $('#btnLogin').html("Go Inside")
                            }
                            if(responce.passwordError == "passwordIncorrect"){
                                Swal.fire({
                                    type: 'error',
                                    title: 'Oops...',
                                    text: 'Incorrect Password',
                                })
                                    $('#btnLogin').removeAttr('disabled')
                                    $('#btnLogin').html("Go Inside")
                            }
                        }
                    })
                }
            }else{
                Swal.fire({
                type: 'warning',
                text: 'Please type a valid email',
                })
            }
        }
        
    })
}