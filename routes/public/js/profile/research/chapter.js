
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

function editChapter(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/chapter/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editChapterlabelloading').html('loading...')
            },
            success: function(responce){
                $('#editChapterlabelloading').html('edit chapter')
                
                $('#echapterTitle').val(responce.chapter.title)
                $('#echapterAuthor').val(responce.chapter.authors)
                $('#echapterKeyword').val(responce.chapter.keyword)
                $('#echapterAbstract').val(responce.chapter.description)
                $('#echapterDate').val(responce.chapter.publicationdate)
                $('#echapter').val(responce.chapter.book)
                $('#echapterVolume').val(responce.chapter.volume)
                $('#echapterPage').val(responce.chapter.pages)
                $('#echapterPublisher').val(responce.chapter.publisher)
                $('#echapterId').val(responce.chapter._id)

            }
        })
    })
}



function publishEditChapter(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#echapterTitle').val()
        const authors = $('#echapterAuthor').val()
        const keyword = $('#echapterKeyword').val()
        const description = $('#echapterAbstract').val()
        const publicationdate = $('#echapterDate').val()
        const book = $('#echapter').val()
        const volume = $('#echapterVolume').val()
        const pages = $('#echapterPage').val()
        const publisher = $('#echapterPublisher').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/chapter/edit/post",
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
                    publisher:publisher,
                    id:$('#echapterId').val()
                },
                beforeSend: function(){
                    $('#echapterButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#echapterButton').removeAttr('disabled')
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
