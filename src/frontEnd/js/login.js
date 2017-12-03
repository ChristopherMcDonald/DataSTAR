function func(a) {
    var show;
    var hide;

    if(a === 1) {
        show = document.getElementById("clientLogin").style.display = "block";
        hide = document.getElementById("userLogin").style.display = "none";
   } 
    if(a === 2) {
        show = document.getElementById("clientLogin").style.display = "none";
        hide = document.getElementById("userLogin").style.display = "block";
   }

}

document.getElementById('b1').onclick = function () {
    func(1);
};

document.getElementById('b2').onclick = function() {
    func(2);
};

$("#clientLoginBtn").click(function(evt){
    var clientEmail = $("#clientLoginEmail");
    var clientPwd = $("#clientLoginPwd");
    axios.post("/clientLogin", {
        "email": clientEmail, 
        "password": clientPwd
    })
    .then(res => {
        localStorage.setItem("clientId", res.data.id);
        window.location.href = "../html/clientHome.html";
    })
    .catch(error => {
        console.error(error);
    });
});

$("#userLoginBtn").click(function(evt){
    var userEmail = $("#userLoginEmail");    
    var userPwd = $("#userLoginPwd");
    axios.post("/login", {
        "email": userEmail, 
        "password": userPwd
    })
    .then(res => {
        localStorage.setItem("userId", res.data.user);
        window.location.href = "../html/userHome.html";
    })
    .catch(error => {
        console.error(error);
    });
});
