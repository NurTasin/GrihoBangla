const ProfilePic = document.getElementById("pro-image");
const UserName = document.getElementById("user-name");
const AdTable = document.getElementById("ad-table");
const TierData = document.getElementById("tier-data");
const CreateAdBtn = document.getElementById("create-ad-btn");
const AdSectionTitle = document.getElementById("ad-sec-title");

CreateAdBtn.addEventListener("click",(ev)=>{
    window.location.href = "/createAd.html"
})


fetch(BACKEND_URL + "/api/v1/user/me",{
    method: "GET",
    credentials: "include"
}).then(res => res.json()).then(data => {
    if (data.status === "Success") {
        let Userdata = data.data;
        ProfilePic.src = BACKEND_URL + "/api/v1/image/get/" + Userdata.profPic;
        UserName.innerText = Userdata.name;
        TierData.innerText = Userdata.tier + " User";
        ProfilePic.src = BACKEND_URL+"/api/v1/image/get/"+Userdata.profPic.replace("/","_");
        if(Userdata.ads.length>0){
            AdSectionTitle.innerText=`${Userdata.ads.length} ads are running.`
            fetch(BACKEND_URL+"/api/v1/ad/bulkGet",{
                method:"POST",
                credentials:"include",
                body:JSON.stringify({ads:Userdata.ads}),
                headers:{
                    "Content-Type":"application/json"
                }
            }).then(res=>res.json()).then(adsData=>{
                let objs = Object.values(adsData);
                let innerTable=""
                for(let i=0;i<objs.length;i++){
                    innerTable+=`<tr>
                    <td><a href="/ad?id=${objs[i]['id']}">${objs[i]['name']}</td>
                    <td>
                        <div class="btn-group btn-group-sm" role="group" style="height: 1.5rem;">
                            <a class="btn btn-primary" role="button" style="padding-top: 0;" href="/editAd?id=${objs[i]['id']}">Edit</a>
                            <a class="btn btn-primary" role="button" style="padding-top: 0;margin-left: 6px;" href="/deleteAd?id=${objs[i]['id']}>Delete</a>
                        </div>
                    </td>
                </tr>`
                }
                AdTable.innerHTML=innerTable;
            }).catch(err=>{console.error(err);alert("An Error Occured. Please Contact Admins");});
        }else{
            AdSectionTitle.innerText="No Ads Are Running Now...."
            AdTable.innerHTML=""
        }
    }else if(data.code==="400" && data.msg==="You have to login to use this feature."){
        alert("Login Session Expired!");
        window.location.href="/login.html";
    }
})