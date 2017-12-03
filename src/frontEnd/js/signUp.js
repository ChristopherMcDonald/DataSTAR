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
    evt.preventDefault();
    var clientName = $("#clientSignUpName").val();
    var clientEmail = $("#clientSignUpEmail").val();
    var clientPwd = $("#clientSignUpPwd").val();
    
    axios.post("http://localhost:3000/client", {
        "coname": clientName,
        "email": clientEmail, 
        "password": clientPwd
    })
    .then(res => {
        window.location.href = "../html/login.html";
    })
    .catch(error => {
        console.error(error);
    });
});

$("#userSignUpBtn").click(function(evt){
    evt.preventDefault();
    var userName = $("#userSignUpName").val();
    var userEmail = $("#userSignUpEmail").val();
    var userPwd = $("#userSignUpPwd").val();
    
    axios.post("http://localhost:3000/user", {
        "name": userName,
        "email": userEmail, 
        "password": userPwd
    })
    .then(res => {
        window.location.href = "../html/login.html";
    })
    .catch(error => {
        console.error(error);
    });
});