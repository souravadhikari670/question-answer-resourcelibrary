function getFollower(event, username) {
    event.preventDefault()
    $(document).ready(function () {

        $.ajax({
            method: "POST",
            url: "/api/profile/getfollower",
            data: {
                username
            },
            beforeSend: function () {
                $('#followerLoading').html('loading...')
            },
            success: function (responce) {

                $('#followerLoading').html('')
                $('#followerListCon').html('')
                for (k = 0; k < responce.users.length; k++) {
                    for (i = 0; i < responce.user.follower.length; i++) {

                        if (responce.users[k].username == responce.user.follower[i].username) {
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
                                </div>
                            </li>
                            `
                            $('#followerListCon').append(f)
                        }

                    }
                }
            }
        })

    })
}