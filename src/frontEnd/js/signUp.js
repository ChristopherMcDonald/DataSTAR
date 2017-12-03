function func(a) {
    var show;
    var hide;

    if(a === 1) {
        show = document.getElementById("clientSignUp").style.display = "block";
        hide = document.getElementById("userSignUp").style.display = "none";
    } 
    if(a === 2) {
        show = document.getElementById("clientSignUp").style.display = "none";
        hide = document.getElementById("userSignUp").style.display = "block";
   }
}

document.getElementById('f1').onclick = function () {
    func(1);
};
document.getElementById('f2').onclick = function() {
    func(2);
};


$("#clientSignUpBtn").click(function(evt){
    var clientName = $("#clientSignUpName");
    var clientEmail = $("#clientSignUpEmail");
    var clientPwd = $("#clientSignUpPwd");
    
    axios.post("/client", {
        "coname": clientName,
        "email": clientEmail, 
        "password": clientPwd
    })
    .then(res => {
        window.location.href = "../html/clientLogin.html";
    })
    .catch(error => {
        console.error(error);
    });
});

$("#userSignUpBtn").click(function(evt){
    var userName = $("#userSignUpName");
    var userEmail = $("#userSignUpEmail");
    var userPwd = $("#userSignUpPwd");
    
    axios.post("/user", {
        "name": userName,
        "email": userEmail, 
        "password": userPwd
    })
    .then(res => {
        window.location.href = "../html/userLogin.html";
    })
    .catch(error => {
        console.error(error);
    });
});