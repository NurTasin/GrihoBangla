if(localStorage.getItem("LOGGED_IN")==="1"){
    fetch(BACKEND_URL+"/api/v1/user/logout",{
        method:"GET",
        credentials:"include"
    }).then(res=>res.json()).then(data=>{
        if(data.status==="Success"){
            localStorage.setItem("LOGGED_IN","0");
            alert("Logout Successfull");
            window.location.href="/"
        }else{
            alert(data.msg);
        }
    })
}