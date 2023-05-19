const BACKEND_URL = "http://localhost:3000"

function IsNotFilled(obj) { return obj.type==="checkbox"? !obj.checked: (obj.value.trim() === "") }
let OnLoggedIn;
if(localStorage.getItem("LOGGED_IN") === "1"){
    document.getElementById("signin-link").innerText="Dashboard";
    document.getElementById("signin-link").href="/dash.html";
    document.getElementById("signup-link").innerText="Log Out";
    document.getElementById("signup-link").href="/logout.html";
    if(OnLoggedIn){
        OnLoggedIn(JSON.parse(localStorage.getItem("USER_DATA")));
    }
}