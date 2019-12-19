
function publishJournal(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#journalTitle').val()
        const authors = $('#journalAuthor').val()
        const keyword = $('#journalKeyword').val()
        const description = $('#journalAbstract').val()
        const publicationdate = $('#journalDate').val()
        const journal = $('#journal').val()
        const volume = $('#journalVolume').val()
        const issue = $('#journalIssue').val()
        const pages = $('#journalPage').val()
        const publisher = $('#journalPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/journal",
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
                    journal:journal,
                    volume:volume,
                    issue:issue,
                    pages:pages,
                    publisher:publisher
                },
                beforeSend: function(){
                    $('#journalButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#journalButton').removeAttr('disabled')
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

//deletejournal
function deleteJournal(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/journal/delete",
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


function editJournal(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/journal/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editJournallabelloading').html('loading...')
            },
            success: function(responce){

                $('#editJournallabelloading').html('edit journal')
                $('#ejournalTitle').val(responce.journal.title)
                $('#ejournalAuthor').val(responce.journal.authors)
                $('#ejournalKeyword').val(responce.journal.keyword)
                $('#ejournalAbstract').val(responce.journal.description)
                $('#ejournalDate').val(responce.journal.publicationdate)
                $('#ejournal').val(responce.journal.journal)
                $('#ejournalVolume').val(responce.journal.volume)
                $('#ejournalIssue').val(responce.journal.issue)
                $('#ejournalPage').val(responce.journal.pages)
                $('#ejournalPublisher').val(responce.journal.publisher)
                $('#ejournalId').val(responce.journal._id)
            }
        })
    })
}

function publishEditJournal(event){
    event.preventDefault()
    $(document).ready(function(){
        
        const title = $('#ejournalTitle').val()
        const authors = $('#ejournalAuthor').val()
        const keyword = $('#ejournalKeyword').val()
        const description = $('#ejournalAbstract').val()
        const publicationdate = $('#ejournalDate').val()
        const journal = $('#ejournal').val()
        const volume = $('#ejournalVolume').val()
        const issue = $('#ejournalIssue').val()
        const pages = $('#ejournalPage').val()
        const publisher = $('#ejournalPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/journal/edit/post",
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
                    journal:journal,
                    volume:volume,
                    issue:issue,
                    pages:pages,
                    publisher:publisher,
                    id:$('#ejournalId').val()
                },
                beforeSend: function(){
                    $('#journalButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#journalButton').removeAttr('disabled')
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