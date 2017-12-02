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

function redirect() {
    window.location.replace("userHome");
    return false;
}