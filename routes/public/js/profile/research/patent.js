
function publishPatent(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#patentTitle').val()
        const inventors = $('#patentInventors').val()
        const keyword = $('#patentKeyword').val()
        const description = $('#patentAbstract').val()
        const publicationdate = $('#patentDate').val()
        const patentoffice = $('#patentOffice').val()
        const patentnumber = $('#patentNumber').val()
        const applicationnumber = $('#patentApplicationNumber').val()
      
        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/patent",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                data:{
                    title:title,
                    inventors:inventors,
                    keyword:keyword,
                    description:description,
                    publicationdate:publicationdate,
                    patentoffice:patentoffice,
                    patentnumber:patentnumber,
                    applicationnumber:applicationnumber
                },
                beforeSend: function(){
                    $('#patentButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#patentButton').removeAttr('disabled')
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

//deletepatent
function deletePatent(event, username, id){
    event.preventDefault()

    $.ajax({
        method:"POST",
        url:"/api/research/patent/delete",
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


function editPatent(event, username, id){
    event.preventDefault()
    $(document).ready(function(){
        $.ajax({
            method:"POST",
            url:"/api/research/patent/edit",
            data:{
                username:username,
                id:id
            },
            beforeSend: function(){
                $('#editPatentlabelloading').html('loading...')
            },
            success: function(responce){
                $('#editPatentlabelloading').html('edit patent')

                $('#epatentTitle').val(responce.patent.title)
                $('#epatentInventors').val(responce.patent.inventors)
                $('#epatentKeyword').val(responce.patent.keyword)
                $('#epatentAbstract').val(responce.patent.description)
                $('#epatentDate').val(responce.patent.publicationdate)
                $('#epatentOffice').val(responce.patent.patentoffice)
                $('#epatentNumber').val(responce.patent.patentnumber)
                $('#epatentApplicationNumber').val(responce.patent.applicationnumber)
                $('#epatentId').val(responce.patent._id)
            }
        })
    })
}



function publishEditPatent(event){
    event.preventDefault()
    
    $(document).ready(function(){

        const title = $('#epatentTitle').val()
        const inventors = $('#epatentInventors').val()
        const keyword = $('#epatentKeyword').val()
        const description = $('#epatentAbstract').val()
        const publicationdate = $('#epatentDate').val()
        const patentoffice = $('#epatentOffice').val()
        const patentnumber = $('#epatentNumber').val()
        const applicationnumber = $('#epatentApplicationNumber').val()
      
        if( title != '' ){
            
            $.ajax({
                method:"POST",
                url:"/api/research/patent/edit/post",
                headers: {
                    "my-first-header": "first value",
                    "my-second-header": "second value"
                },
                data:{
                    title:title,
                    inventors:inventors,
                    keyword:keyword,
                    description:description,
                    publicationdate:publicationdate,
                    patentoffice:patentoffice,
                    patentnumber:patentnumber,
                    applicationnumber:applicationnumber,
                    id:$('#epatentId').val()
                },
                beforeSend: function(){
                    $('#epatentButton').attr('disabled','disabled')
                },
                success: function(responce){
                    $('#epatentButton').removeAttr('disabled')
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