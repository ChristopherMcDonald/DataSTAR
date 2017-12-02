function func(a) {
    var show;
    var hide;
    var thanks;

    if(a === 1) {
        show = document.getElementById("clientSignUp").style.display = "block";
        hide = document.getElementById("userSignUp").style.display = "none";
    } 
    if(a === 2) {
        show = document.getElementById("clientSignUp").style.display = "none";
        hide = document.getElementById("userSignUp").style.display = "block";
   }
   if(a === 3) {
        show = document.getElementById("sumbitted").style.display = "block";
   }
}

document.getElementById('f1').onclick = function () {
    func(1);
};
document.getElementById('f2').onclick = function() {
    func(2);
};

