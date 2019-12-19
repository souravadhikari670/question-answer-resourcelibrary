   //post questions
   function postQuestion(event) {
    event.preventDefault()
    $(document).ready(function(){

        var tag = $('#questiontag').val()
        var text = $('#questiontitle').val()
        var code = $('#questioncode').val()

        if (tag != "") {
            if (text != "") {
                
                $.ajax({
                    method:"POST",
                    url:"/api/questions/postquestion",
                    headers: {
                        "my-first-header": "first value",
                        "my-second-header": "second value"
                    },
                    data:{
                        tag:tag,
                        text:text,
                        code:code
                    },
                    beforeSend: function(){
                        $('#btnPost').attr('disabled', 'disabled')
                    },
                    success: function(responce){
                        if (responce.success === true) {

                            location.reload()
                        }
                        if (responce.status == 500) {
                            swal('Sorry!', 'Internal server error please try again after some time', 'error')
                        }
                    }
                })
                
            } else {
                Swal.fire({
                    type: 'warning',
                    html: 'please type your Question title'
                })
            }
        } else {
            Swal.fire({
                type: 'warning',
                html: 'please type your Question tags'
            })
        }
    })
    
}
