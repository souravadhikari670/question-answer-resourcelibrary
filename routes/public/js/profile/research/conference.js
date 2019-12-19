
function publishConference(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#conferenceTitle').val()
        const authors = $('#conferenceAuthor').val()
        const keyword = $('#conferenceKeyword').val()
        const description = $('#conferenceAbstract').val()
        const publicationdate = $('#conferenceDate').val()
        const conference = $('#conference').val()
        const volume = $('#conferenceVolume').val()
        const issue = $('#conferenceIssue').val()
        const pages = $('#conferencePage').val()
        const publisher = $('#conferencePublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/conference",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                data:{
                    title:title,
                    authors:authors,
                    keyword:keyword,
                    description:description,
                    publicationdate:publicationdate,
                    conference:conference,
                    volume:volume,
                    issue:issue,
                    pages:pages,
                    publisher:publisher
                },
                beforeSend: function(){
                    $('#conferenceButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#conferenceButton').removeAttr('disabled')
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

//deleteconference
function deleteConference(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/conference/delete",
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