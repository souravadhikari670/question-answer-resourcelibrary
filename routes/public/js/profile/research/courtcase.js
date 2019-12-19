
function publishCourtcase(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#courtcaseTitle').val()
        const keyword = $('#courtcaseKeyword').val()
        const court = $('#courtcaseCourt').val()
        const description = $('#courtcaseAbstract').val()
        const decideddate = $('#courtcaseDate').val()
        const reporter = $('#courtcaseReporter').val()
        const docketid = $('#courtcaseDocketid').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/courtcase",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                data:{
                    title:title,
                    keyword:keyword,
                    description:description,
                    court:court,
                    decideddate:decideddate,
                    reporter:reporter,
                    docketid:docketid
                },
                beforeSend: function(){
                    $('#courtcaseButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#courtcaseButton').removeAttr('disabled')
                    if(responce.success == true){
                        location.reload()
                    }
                }
            })

        }else{
            Swal.fire({
                type: 'warning',
                html: 'title is required'
            })
        }

    })
}

//deletecourtcase
function deleteCourtcase(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/courtcase/delete",
        headers: {
            "my-first-header": "first value",
            "my-second-header": "second value"
        },
        data:{
            username:username,
            id:id
        },
        success:function(responce){
            if(responce.success == true){
                location.reload()
            }
        }
    })
}