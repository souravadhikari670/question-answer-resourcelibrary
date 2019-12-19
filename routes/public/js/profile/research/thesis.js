
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