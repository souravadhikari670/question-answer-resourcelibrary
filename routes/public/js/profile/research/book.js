
function publishBook(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#bookTitle').val()
        const authors = $('#bookAuthor').val()
        const keyword = $('#bookKeyword').val()
        const description = $('#bookAbstract').val()
        const publicationdate = $('#bookDate').val()
        const volume = $('#bookVolume').val()
        const pages = $('#bookPage').val()
        const publisher = $('#bookPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/book",
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
                    volume:volume,
                    pages:pages,
                    publisher:publisher
                },
                beforeSend: function(){
                    $('#bookButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#bookButton').removeAttr('disabled')
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

//deletebook
function deleteBook(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/book/delete",
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