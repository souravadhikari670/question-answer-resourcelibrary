
function publishChapter(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#chapterTitle').val()
        const authors = $('#chapterAuthor').val()
        const keyword = $('#chapterKeyword').val()
        const description = $('#chapterAbstract').val()
        const publicationdate = $('#chapterDate').val()
        const book = $('#chapter').val()
        const volume = $('#chapterVolume').val()
        const pages = $('#chapterPage').val()
        const publisher = $('#chapterPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/chapter",
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
                    book:book,
                    volume:volume,
                    pages:pages,
                    publisher:publisher
                },
                beforeSend: function(){
                    $('#chapterButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#chapterButton').removeAttr('disabled')
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

//deletechapter
function deleteChapter(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/chapter/delete",
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