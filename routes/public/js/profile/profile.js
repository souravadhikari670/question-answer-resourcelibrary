// //disable back button
history.pushState(null, null, location.href);
window.onpopstate = function () {
  history.go(1);
};

//follow

function follow(username, event) {
  event.preventDefault()
  if (document.cookie) {
    $(document).ready(function () {
      $.ajax({
        method: "POST",
        url: "/api/profile/find/user/auth/follow/" + username,
        success: function (responce) {
          if (responce.success == true) {
            location.reload()
          }
          if (responce.user == "error") {
            Swal.fire({
              type: 'warning',
              html: 'you can not follow your own profile'
            })
          } else if (responce.user == false) {
            location.href = '/sessionexpire'
          }
        }
      })
    })
  }
}

//unfollow

function unfollow(username, event) {
  event.preventDefault()
  if (document.cookie) {
    $(document).ready(function () {
      $.ajax({
        method: "POST",
        url: "/api/profile/find/user/auth/unfollow/" + username,
        success: function (responce) {
          if (responce.success == true) {
            location.reload()
          }
          if (responce.user == "error") {
            Swal.fire({
              type: 'warning',
              html: 'you can not follow your own profile'
            })
          }

        }
      })
    })
  }
}


//delete account
function deleteAccount(event){
  event.preventDefault()

  $(document).ready(function () {

    if( $('#deletepassword').val() != '' ){

      $.ajax({
          method: "POST",
          url: "/api/profile/deleteaccount",
          data: {
            password: $("#deletepassword").val()
          },
          beforeSend: function () {
            $("#btnDelete").attr("disabled", "disabled")
            $("#btnDelete").html("We are verifying...")
          },
          success: function (response) {
            if (response.trim() == "success") {
              location.replace('/')
            } else if (response.trim() == "incorrectpassword") {
              $("#btnDelete").removeAttr("disabled")
              $("#passwordError").html("Please verify your password")
              $("#btnDelete").html("Delete Account")
              setTimeout(function () {
                $("#passwordError").html("")
              }, 4000)
            }
          }
      })

    }else{
      Swal.fire({
        type: 'warning',
        html: 'provide your password'
      })
    }
  })
}

//post answer
function trimfield(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

function sendMessage(event){
  event.preventDefault()
  $(document).ready(function(){

    const message = trimfield($('#messageBody').val())
    const to = $('#messageTo').val()

    if(message != '')
    {
      $.ajax({
        method:"POST",
        url:"/api/profile/sendmessage",
        headers: {
          "my-first-header": "first value",
          "my-second-header": "second value"
      },
        data:{
          message:message,
          to:to
        },
        beforeSend: function(){
          $('#btnMessageSend').attr('disabled','disabled')
        },
        success: function(responce){

          if(responce.success == true){

            $('#btnMessageSend').removeAttr('disabled')
            $('#messageBody').html('')
            
            Swal.fire({
              type: 'success',
              html: 'message sended'
            })
          }
        }
      })
    }else{
      Swal.fire({
        type: 'warning',
        html: 'please type message'
      })
    }

  })
}


function readMore(username, index, event){
  event.preventDefault()
  $('#pshowfullmessage').html('')
  $('#pshowfullmessagedate').html('')
  $('#pshowfullmessagefrom').html('')
  $(document).ready( function(){
    $.ajax({
      method:"POST",
      url:"/api/profile/message/readmore",
      data:{
        username:username,
        index: Number(index)
      },
      beforeSend:function(){
        $('#pshowfullmessage').html('loading...')
      },success: function(responce){
        
        $('#newMessageAlert'+index).css("display", "none");
        $('#pshowfullmessage').text(responce.message.message)
        let d = `
          <strong> Date : ${responce.message.date}
        `
        $('#pshowfullmessagedate').append(d)

        let f = `
        <div class="col-1 mt-3">
        <strong>From : </strong>
        </div>
        <div "col-1 mt-3">
          ${responce.profilepic == 'https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png'? ` <div id="messageProfilepicCon" style="background-image: url('https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png');"></div>`:`<div id="messageProfilepicCon"style="background-image: url('/profile/profilepic/${responce.profilepic}');"></div>`}
        </div>
          <div class="col-10 mt-3">
            <a href="/api/profile/find/users/${responce.message.from}" class="ml-2"
                style="text-decoration: none;">
                ${responce.message.from}
            </a>
          </div>
        `
        $('#pshowfullmessagefrom').append(f)
      }
    })
  })
}


//upload profilepic

  $(document).ready(function(){
    $('#uploadprofilepic').on('change', function(){
      let file_name = this.files[0].name;
      let file_size = (this.files[0].size)/1024/1024;
      $(".upload-profile-pic").html(file_name);
      if( file_size < 3 ){
        $('#uploadprofilepicButton').removeAttr('disabled')
      }else{
        Swal.fire({
          type: 'warning',
          html: 'filesize mustbe less than 3mb'
        })
      }
    })
  })
  function uploadprofilepic(event){
    event.preventDefault()
    var $data = new FormData();
    $data.append('uploadprofilepic', $("#uploadprofilepic").get(0).files[0])
    $.ajax({
      xhr: function () {
          var xhr = new window.XMLHttpRequest();

          xhr.upload.addEventListener("progress", function (evt) {

            $('#uploadprofilepicCon').removeClass('d-none')

              if (evt.lengthComputable) {
                  var percentComplete = evt.loaded / evt.total;
                  percentComplete = parseInt(percentComplete * 100);
                  $("#uploadprofilepicprogress").css("width",
                      percentComplete + "%");
                  $("#uploadprofilepicprogress").html(percentComplete +
                      "% complete");
                  console.log(percentComplete)
                  if (percentComplete === 100) {
                      setTimeout(function () {
                          $("#uploadprofilepicprogress")
                              .addClass('d-none')
                          $("#uploadprofilepicprogress").css('width',
                              0 + "%")
                          $(".upload-profile-pic").html(
                              'Choose file')
                          $('#uploadprofilepicCon').addClass('d-none')
                          location.reload()
                      }, 1000)
                  }
              }
          }, false);

          return xhr;
      },
      method: "POST",
      url: "/api/profile/profilepic",
      data: $data,
      contentType: false,
      processData: false,
      catch: false,
  })
  }

//trim text
function trimfield(str) {
  return str.replace(/^\s+|\s+$/g, '');
}
  //upload bio
  function uploadBio(event){
    event.preventDefault()
    let bio = trimfield($('#bioBody').val())

    if(bio != ''){
      $.ajax({
        method:"POST",
        url:"/api/profile/addbio",
        headers: {
          "my-first-header": "first value",
          "my-second-header": "second value"
      },
        data:{
          bio
        },
        success:function(responce){
          if(responce.success == true){
            location.reload()
          }
        }
      })
    }else{
      Swal.fire({
        type: 'warning',
        html: 'please type your bio'
      })
    }
  }

  //simple send message
  function postSimpleMessage(event, username)
  {
    event.preventDefault()
    $(document).ready( function(){
      $.ajax({
        method:"POST",
        url:"/api/profile/postsimplemessage",
        data:{
          title:$('#simpleTextMessage').val(),
          tag:"txt",
          username:username
        },
        beforeSend:function(){
          $('#btnpostSimpleMessage').attr('disabled', 'disabled')
        },
        success: function(responce){
          $('#btnpostSimpleMessage').removeAttr('disabled')
          if(responce.success == true)
            $('#simpleTextMessage').val() = ''
            location.reload()
        }
      })
    })
  }
  

  //simple send message as code
  function postSimpleCode(event, username)
  {
    event.preventDefault()
    $(document).ready( function(){
      $.ajax({
        method:"POST",
        url:"/api/profile/postsimplemessage",
        data:{
          title:$('#simpleTextMessage').val(''),
          tag:"code",
          username:username
        },
        beforeSend:function(){
          $('#btnpostSimpleCode').attr('disabled', 'disabled')
        },
        success: function(responce){
          $('#btnpostSimpleCode').removeAttr('disabled')
          if(responce.success == true)
            $('#simpleTextMessage').val('')
            location.reload()
        }
      })
    })
  }
  

  //delete simple message
  function deleteSimpleMessage(event, username, id){
    event.preventDefault()
    $.ajax({
      method:"POST",
      url:"/api/profile/deletesimplemessage",
      data:{
        id:id,
        username:username
      },
      success: function(responce){
        if(responce.success == true)
          location.reload()
      }
    })
  }