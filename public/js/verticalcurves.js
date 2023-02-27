function radians(angle){
    return angle*Math.PI/180;
}

function cround(number, digits){
    return Math.round(number*(10**digits))/(10**digits);
}

function verticalVis(){
    const vcase = document.getElementById("vertical_case").value;
    if(vcase == "radius"){
       document.getElementById("vertical_radius").parentElement.classList.remove("invisible");
       document.getElementById("vertical_radius_result").parentElement.classList.add("invisible");
       document.getElementById("vertical_length").parentElement.classList.add("invisible");
       document.getElementById("vertical_length_result").parentElement.classList.remove("invisible");
        //document.getElementById("vertical_button").value = "Oblicz długość";

    }else if(vcase == "length"){
        document.getElementById("vertical_radius").parentElement.classList.add("invisible");
        document.getElementById("vertical_radius_result").parentElement.classList.add("invisible");
        document.getElementById("vertical_length").parentElement.classList.remove("invisible");
        document.getElementById("vertical_length_result").parentElement.classList.remove("invisible");
        // document.getElementById("vertical_button").value = "Oblicz promień";
    }
}

window.addEventListener("load",verticalVis);

function runverticalInclines1(){
    let r = document.getElementById("vertical_radius").value;
    let l = document.getElementById("vertical_length").value;
    let i1 = document.getElementById("vertical_inclination_1").value;
    let i2 = document.getElementById("vertical_inclination_2").value;
    const vcase = document.getElementById("vertical_case").value;

    if(r !=0 || l != 0){
        verticalInclines1(r,l,i1,i2,vcase);
    }else if((r ==0 || l == 0)&& i1 == 0 && i2 == 0){
        document.getElementById("vertical_length_result").value = "";
        document.getElementById("vertical_radius_result").value = "";
    }
}

function verticalInclines1(r,l,i1,i2,vcase){
    
    //obliczanie wartości
    let deltai = Math.abs(i2 - i1)
    const p = 0.05728586;

    if(vcase == "lenght"){
        r = l/(Math.PI*deltai*(p/180));
    }else if(vcase == "radius"){
        l = r*Math.PI*deltai*p/180;
    }

    document.getElementById("vertical_length_result").value = cround(l,6);
    document.getElementById("vertical_radius_result").value = cround(r,6);

}

function runverticalInclines2(){
    let l = document.getElementById("vertical_length_3").value;
    let i = document.getElementById("vertical_inclination_3").value;

    if(i !=0 || l != 0){
        verticalInclines2(l,i);
    }else if(i ==0 && l == 0){
        document.getElementById("vertical_length_3_result").value = "";
    }
}

function verticalInclines2(l,i){
    //stała do zmiany promili na stopnie
    const p = 0.05728586;

    //obliczanie wartości
    lprim = l/Math.cos(radians(i*p));
    w = lprim - l;

    //drukowanie wyniku
    document.getElementById("vertical_length_3_result").value = cround(w,6);

}

