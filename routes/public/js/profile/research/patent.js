
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