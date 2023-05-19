const ProfilePic = document.getElementById("pro-image");
const UserName = document.getElementById("user-name");
const AdTable = document.getElementById("ad-table");
const CreateAdBtn = document.getElementById("create-ad-btn");


fetch(BACKEND_URL + "/api/v1/user/me",{
    method: "GET",
    credentials: "include"
}).then(res => res.json()).then(data => {
    if (data.status === "Success") {
        let Userdata = data.data
        ProfilePic.src = BACKEND_URL + "/api/v1/image/get/" + Userdata.profPic
        UserName.innerText = Userdata.name
    }else if(data.code==="400" && data.msg==="You have to login to use this feature."){
        alert("Login Session Expired!");
        window.location.href="/login.html";
    }
})