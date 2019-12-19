
   $(document).ready(function(){
    $("#filterQues").on('change', function(){

        const username = $('#username').val()

        if($('#filterQues').val() === 'upvote'){
            $.ajax({
                method:"GET",
                url:"/api/questions/sortby",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                success: function(responce){
                    if( responce.success === true ){
                        location.href = '/api/questions/'+username+'/sortby/upvote'
                    }
                }
            })
        }
        if($('#filterQues').val() === 'downvote'){
            $.ajax({
                method:"GET",
                url:"/api/questions/sortby",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                success: function(responce){
                    if( responce.success === true ){
                        location.href = '/api/questions/'+username+'/sortby/downvote'
                    }
                }
            })
        }
        if($('#filterQues').val() === 'answers'){
            $.ajax({
                method:"GET",
                url:"/api/questions/sortby",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                success: function(responce){
                    if( responce.success === true ){
                        location.href = '/api/questions/'+username+'/sortby/answers'
                    }
                }
            })
        }
        if($('#filterQues').val() === 'clear'){
           location.href = '/api/questions/'+username+'/questions'
        }
    })
})
