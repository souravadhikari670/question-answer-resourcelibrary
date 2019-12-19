
function getFollowing(event, username)
{
    event.preventDefault()
    $(document).ready(function(){
        
        $.ajax({
            method:"POST",
            url:"/api/profile/getfollowing",
            data:{
                username
            },
            beforeSend: function(){
                $('#followingLoading').html('loading...')
            },
            success: function(responce){

                $('#followingLoading').html('')
                $('#followingListCon').html('')

                for(k=0;k<responce.users.length;k++)
                {
                    for( i=0;i<responce.user.following.length;i++ ){
                        
                        if( responce.users[k].username == responce.user.following[i].username )
                        {
                            const f = `
                                <li class="list-item">
                                <div class="row">
                                    <div class="col-1">
                                       ${responce.users[k].profilepic == 'https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png'? ` <div class="mb-2" id="profilepicCon"style="background-image: url('https://cdn.pixabay.com/photo/2013/07/13/10/07/man-156584_1280.png');"></div>`:`<div class="mb-2" id="profilepicCon"style="background-image: url('/profile/profilepic/${responce.users[k].profilepic}');"></div>`}
                                        
                                    </div>
                                    <div class="col-10 mt-2">
                                        <a href="/api/profile/find/users/${responce.users[k].username}" class="ml-2"
                                            style="text-decoration: none;">
                                            ${responce.users[k].username}
                                        </a>
                                    </div>
                                    <div class="col-1 mt-2">
                                        ${`<button class="btn btn-sm btn-secondary float-right mt-1"onclick="unfollow('${responce.users[k].username}', event)">
                                            unfollow
                                        </button>`}
                                    </div>
                                </div>
                            </li>
                            `
                            $('#followingListCon').append(f)
                        }

                    }
                }
            }
        })

    })
}