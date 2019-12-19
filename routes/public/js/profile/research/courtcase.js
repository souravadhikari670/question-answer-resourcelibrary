
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



function editCourtcase(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/courtcase/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editCourtcaselabelloading').html('loading...')
            },
            success: function(responce){
                $('#editCourtcaselabelloading').html('edit courtcase')
                
                        
                $('#ecourtcaseTitle').val(responce.courtcase.title)
                $('#ecourtcaseKeyword').val(responce.courtcase.keyword)
                $('#ecourtcaseCourt').val(responce.courtcase.court)
                $('#ecourtcaseAbstract').val(responce.courtcase.description)
                $('#ecourtcaseDate').val(responce.courtcase.decideddate)
                $('#ecourtcaseReporter').val(responce.courtcase.reporter)
                $('#ecourtcaseDocketid').val(responce.courtcase.docketid)
                $('#ecourtcaseId').val(responce.courtcase._id)

            }
        })
    })
}



function publishEditCourtcase(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#ecourtcaseTitle').val()
        const keyword = $('#ecourtcaseKeyword').val()
        const court = $('#ecourtcaseCourt').val()
        const description = $('#ecourtcaseAbstract').val()
        const decideddate = $('#ecourtcaseDate').val()
        const reporter = $('#ecourtcaseReporter').val()
        const docketid = $('#ecourtcaseDocketid').val()

        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/courtcase/edit/post",
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
                    docketid:docketid,
                    id:$('#ecourtcaseId').val()
                },
                beforeSend: function(){
                    $('#ecourtcaseButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#ecourtcaseButton').removeAttr('disabled')
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
