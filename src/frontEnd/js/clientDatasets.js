function move() {
    var elem1 = document.getElementById("myBar1"); 
    var elem2 = document.getElementById("myBar2"); 
    var elem3 = document.getElementById("myBar3"); 
    
    var width1 = 1;
    var width2 = 1;
    var width3 = 1;

    var id1 = setInterval(frame, 10);
    var id2 = setInterval(frame, 10);
    var id3 = setInterval(frame, 10);

    function frame() {
        if (width1 >= 40) {
            clearInterval(id1);
        } else {
            width1++; 
            elem1.style.width = width1 + '%'; 
        }
        if (width3 >= 65) {
            clearInterval(id3);
        } else {
            width3++; 
            elem3.style.width = width3 + '%'; 
        }
        if (width2 >= 100) {
            clearInterval(id2);
        } else {
            width2++; 
            elem2.style.width = width2 + '%'; 
        }
    }
}

window.onload = move();