
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



function editConference(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/conference/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editConferencelabelloading').html('loading...')
            },
            success: function(responce){
                $('#editConferencelabelloading').html('edit conference')
                
                $('#econferenceTitle').val(responce.conference.title)
                $('#econferenceAuthor').val(responce.conference.authors)
                $('#econferenceKeyword').val(responce.conference.keyword)
                $('#econferenceAbstract').val(responce.conference.description)
                $('#econferenceDate').val(responce.conference.publicationdate)
                $('#econference').val(responce.conference.conference)
                $('#econferenceVolume').val(responce.conference.volume)
                $('#econferenceIssue').val(responce.conference.issue)
                $('#econferencePage').val(responce.conference.pages)
                $('#econferencePublisher').val(responce.conference.publisher)
                $('#econferenceId').val(responce.conference._id)

            }
        })
    })
}



function publishEditConference(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#econferenceTitle').val()
        const authors = $('#econferenceAuthor').val()
        const keyword = $('#econferenceKeyword').val()
        const description = $('#econferenceAbstract').val()
        const publicationdate = $('#econferenceDate').val()
        const conference = $('#econference').val()
        const volume = $('#econferenceVolume').val()
        const issue = $('#econferenceIssue').val()
        const pages = $('#econferencePage').val()
        const publisher = $('#econferencePublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/conference/edit/post",
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
                    publisher:publisher,
                    id:$('#econferenceId').val()
                },
                beforeSend: function(){
                    $('#econferenceButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#econferenceButton').removeAttr('disabled')
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