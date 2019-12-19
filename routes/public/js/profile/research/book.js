
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



function editBook(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/book/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editBooklabelloading').html('loading...')
            },
            success: function(responce){

                $('#editBooklabelloading').html('edit book')
                $('#ebookTitle').val(responce.book.title)
                $('#ebookAuthor').val(responce.book.authors)
                $('#ebookKeyword').val(responce.book.keyword)
                $('#ebookAbstract').val(responce.book.description)
                $('#ebookDate').val(responce.book.publicationdate)
                $('#ebookVolume').val(responce.book.volume)
                $('#ebookPage').val(responce.book.pages)
                $('#ebookPublisher').val(responce.book.publisher)
                $('#ebookId').val(responce.book._id)

            }
        })
    })
}

function publishEditBook(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#ebookTitle').val()
        const authors = $('#ebookAuthor').val()
        const keyword = $('#ebookKeyword').val()
        const description = $('#ebookAbstract').val()
        const publicationdate = $('#ebookDate').val()
        const volume = $('#ebookVolume').val()
        const pages = $('#ebookPage').val()
        const publisher = $('#ebookPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/book/edit/post",
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
                    publisher:publisher,
                    id:$('#ebookId').val()
                },
                beforeSend: function(){
                    $('#ebookButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#ebookButton').removeAttr('disabled')
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
