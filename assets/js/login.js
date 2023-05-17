const UsernameField = document.getElementById("username")
const PasswordField = document.getElementById("password")
const LoginButton = document.getElementById("login-btn")

function validateForm(onValidate) {
    let ToCheck = [UsernameField, PasswordField];
    let view = false;
    for (let i = 0; i < ToCheck.length; i++) {
        if (IsNotFilled(ToCheck[i])) {
            if (!view) {
                ToCheck[i].scrollIntoView({ behavior: "smooth" });
                view = true;
            }
            ToCheck[i].style.border = "2px solid red";
            ToCheck[i].addEventListener("keyup", (ev) => {
                ToCheck[i].style.border = "";
            })
        }
    }
    if (!view) {
        if (onValidate) {
            onValidate(...ToCheck);
        }
    }
}

LoginButton.addEventListener("click", (ev) => {
    validateForm((uname, pass) => {
        console.log(uname.value, pass.value);
        let header = new Headers();
        header.append("Content-Type", "application/x-www-form-urlencoded");
        header.append("Accept", "application/json");
        var urlencoded = new URLSearchParams();
        urlencoded.append("username", uname.value);
        urlencoded.append("password", pass.value);
        fetch(BACKEND_URL + "/api/v1/user/login", {
            method: "POST",
            body: urlencoded,
            headers: header,
            credentials: "include"
        })
            .then((res) => {
                console.log(res);
                return res.text(); // Add the return statement here
            })
            .then((txt) => {
                console.log(txt);
                data = JSON.parse(txt);
                if (data.status === "Succeed") {
                    alert(`Login Successful, welcome ${data.data.name}`);
                } else {
                    alert(`${data.msg}`);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    });
})
