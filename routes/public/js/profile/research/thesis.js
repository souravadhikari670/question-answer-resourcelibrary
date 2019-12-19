
function publishThesis(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#thesisTitle').val()
        const authors = $('#thesisAuthor').val()
        const keyword = $('#thesisKeyword').val()
        const description = $('#thesisAbstract').val()
        const publicationdate = $('#thesisDate').val()
        const institution = $('#thesisInstitution').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/thesis",
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
                    institution:institution
                },
                beforeSend: function(){
                    $('#thesisButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#thesisButton').removeAttr('disabled')
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

//deletethesis
function deleteThesis(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/thesis/delete",
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



function editThesis(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/thesis/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editThesislabelloading').html('loading...')
            },
            success: function(responce){
                $('#editThesislabelloading').html('edit thesis')

                $('#ethesisTitle').val(responce.thesis.title)
                $('#ethesisAuthor').val(responce.thesis.authors)
                $('#ethesisKeyword').val(responce.thesis.keyword)
                $('#ethesisAbstract').val(responce.thesis.description)
                $('#ethesisDate').val(responce.thesis.publicationdate)
                $('#ethesisInstitution').val(responce.thesis.institution)
                $('#ethesisId').val(responce.thesis._id)
            }
        })
    })
}


function publishEditThesis(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#ethesisTitle').val()
        const authors = $('#ethesisAuthor').val()
        const keyword = $('#ethesisKeyword').val()
        const description = $('#ethesisAbstract').val()
        const publicationdate = $('#ethesisDate').val()
        const institution = $('#ethesisInstitution').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/thesis/edit/post",
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
                    institution:institution,
                    id:$('#ethesisId').val()
                },
                beforeSend: function(){
                    $('#ethesisButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#ethesisButton').removeAttr('disabled')
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