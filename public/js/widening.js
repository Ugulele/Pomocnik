function radians(angle){
    return (angle*Math.PI)/180;
}

function cround(number, digits){
    return Math.round(number*(10**digits))/(10**digits);
}

function degrees(angle){
    return angle*(180/Math.PI);
}

function liczPrzesuniecie(r,l,curvetype){
    var n = "";
    
    if(curvetype=="3st"){
        n = (l**2)/(24*r);
    }else if(curvetype =="bloss"){
        n = (l**2)/(48*r)
    }else if(curvetype == "4st"){ 
        n = (l**2)/(40*r)
    } 
    
    return n;
}

function runliczPoszerzenie(){
    let r1 = document.getElementById("widening_radius_1").value;
    let r2 = document.getElementById("widening_radius_2").value;
    let d = document.getElementById("widening_change").value;
    let alfa = document.getElementById("widening_angle").value;
    let l1 = document.getElementById("widening_curve_length_1").value;
    let l2 = document.getElementById("widening_curve_length_2").value;
    let curvetype = document.getElementById("widening_curvetype").value;

    if(r1 != 0 && r2 != 0 && d != 0 && alfa != 0){
        liczPoszerzenie(r1,r2,d,alfa,l1,l2,curvetype);
    }else if(r1 == 0 && r2 == 0 && d == 0 && alfa == 0 ){
        document.getElementById("widening_inset").value = "";
        document.getElementById("widening_length").value = "";
        document.getElementById("widening_curve1").value = "";
        document.getElementById("widening_curve2").value = "";
    }

    
}

function liczPoszerzenie(r1,r2,d,alfa,l1,l2,curvetype){
    //obliczanie wartości wstawki i długości i przesunięć
    let w = d/(Math.sin(radians(alfa))) - r1*Math.tan(radians(alfa/2)) - r2*Math.tan(radians(alfa/2)) - l1/2 - l2/2;
    let n1 = liczPrzesuniecie(r1,l1,curvetype);
    let n2 = liczPrzesuniecie(r2,l2,curvetype);
   
    //wyświetlanie wyników
    document.getElementById("widening_inset").value = cround(w,4);
    document.getElementById("widening_length").value = cround(w + 2*l1 + 2*l2 + (alfa/360)*2*Math.PI*((r1)) + (alfa/360)*2*Math.PI*((r2)),4);
    document.getElementById("widening_curve1").value = cround((alfa/360)*2*Math.PI*((r1)) - l1,4);
    document.getElementById("widening_curve2").value = cround((alfa/360)*2*Math.PI*((r2)) - l2,4);
    document.getElementById("widening_shift_1").value = cround(n1,2);
    document.getElementById("widening_shift_2").value = cround(n2,2);
}

function runliczPoszerzenie2(){
    let r = document.getElementById("widening2_radius").value;
    let l = document.getElementById("widening2_curve_length").value;
    let d = document.getElementById("widening2_change").value;
    let curvetype = document.getElementById("widening2_curvetype").value;

    if(r != 0 && d != 0){
        liczPoszerzenie2(r,l,d,curvetype);
    }else if(r == 0 || d == 0){
        document.getElementById("widening2_length").value = "";
        document.getElementById("widening2_angle").value = "";
        document.getElementById("widening2_curve").value = "";
        document.getElementById("widening2_shift").value = "";
    }
}

function liczPoszerzenie2(r,l,d,curvetype){
    //Obliczanie poszerzenia
    let k = (-3*l +  Math.sqrt(l**2 + 4*r*d))/2;
    //Obliczanie kąta łuku
    let alfa = degrees(2*Math.atan((k+l)/(2*r)));
    //Obliczanie długości poszerzenia
    let p = 2*k + 4*l;
    //obliczanie przesunięcia
    let n = liczPrzesuniecie(r,l,curvetype);
  
    

    //wyświetlanie wyników
    document.getElementById("widening2_length").value = cround(p,2);
    document.getElementById("widening2_angle").value = cround(alfa,4);
    document.getElementById("widening2_curve").value = cround((alfa/360)*2*Math.PI*((r)),4);
    document.getElementById("widening2_shift").value = cround(n,2);
    
}

function runliczPoszerzenie3(){
    let r = document.getElementById("widening3_radius").value;
    let d = document.getElementById("widening3_change").value;
    let curvetype = document.getElementById("widening3_curvetype").value;

    if(r !=0 && d != 0){
        liczPoszerzenie3(r,d,curvetype)
    }else if(r == 0 || d == 0){
        document.getElementById("widening3_length").value = "";
        document.getElementById("widening3_curve_length").value = "";
        document.getElementById("widening3_shift").value = "";
    }
}

function liczPoszerzenie3(r,d,curvetype){
    //obliczanie długości krzywej
    l = cround(Math.sqrt(d*(8*r-d))/4,2)
    p = cround(4*l,2)

    n = liczPrzesuniecie(r,l,curvetype);

    //wyprowadzenie wyników
    document.getElementById("widening3_length").value = p;
    document.getElementById("widening3_curve_length").value = l;
    document.getElementById("widening3_shift").value = cround(n,2);
}

function runliczPoszerzenieluk(){
    let r1 = document.getElementById("wideningc_radius_1").value;
    let r2 = document.getElementById("wideningc_radius_2").value;
    let m1 = document.getElementById("wideningc_gauge_before").value;
    let m2 = document.getElementById("wideningc_gauge_after").value;
    let alfa = document.getElementById("wideningc_angle").value;
    let l1 = document.getElementById("wideningc_curve_length_1").value;
    let l2 = document.getElementById("wideningc_curve_length_2").value;
    let curvetype = document.getElementById("wideningc_curvetype").value;

    if(r1 && r2 && alfa && m1 !== "" && m2 !== "" ){
        liczPoszerzenieluk(r1,r2,m1,m2,alfa,l1,l2,curvetype);
    }else if(r1 == 0 || r2 == 0 || m1 == 0 || m2 == 0 || alfa == 0 ){
        document.getElementById("wideningc_inset").value = "";
        document.getElementById("wideningc_curve1").value = "";
        document.getElementById("wideningc_curve2").value = "";
        document.getElementById("wideningc_shift1").value = "";
        document.getElementById("wideningc_shift2").value = "";
    
    }
}

function liczPoszerzenieluk(r1,r2,m1,m2,alfa,l1,l2,curvetype){
    //obliczanie przesunięć

    let n1 = liczPrzesuniecie(r1,l1,curvetype);
    let n2 = liczPrzesuniecie(r2,l2,curvetype);
    let n = n1-n2;

    //przesunięcie środków łuków
    let wt = ((m1-n)/(Math.sin(radians(alfa)))) - ((m2-n)/(Math.tan(radians(alfa))))

    //poprawka na przesunięcie końców łuków i kp
    let x1 = (m1/Math.sin(radians(alfa))) - (m1/Math.tan(radians(alfa)));
    let x2 = (m2/Math.sin(radians(alfa))) - (m2/Math.tan(radians(alfa)));
    let x = (x1+x2)/2;

    //poprawka ze względu na różnicę długości stycznych
    let t1 = r1*Math.tan(radians(alfa/2));
    let t2 = r2*Math.tan(radians(alfa/2));
    let t = t2-t1;

   

    //obliczenie wstawki
    let w = - wt +2*x - t;

    let w1 = ((m1-n)/(Math.sin(radians(alfa))));
    let w2 = ((m2-n)/(Math.tan(radians(alfa))));

    //drukowanie wyników
   
    // Długość wstawki [m]: 
    document.getElementById("wideningc_inset").value = cround(w,4);

    // Długość łuku Ł1 [m]:
    document.getElementById("wideningc_curve1").value = cround((alfa/360)*2*Math.PI*r1 - l1,4);

    // Długość Łuku Ł2 [m]: 
    document.getElementById("wideningc_curve2").value = cround((alfa/360)*2*Math.PI*r2 - l2,4);


    // Przesunięcie KP(Ł1) [m]: 
    document.getElementById("wideningc_shift1").value = cround(n1,2);

    // Przesunięcie KP(Ł2) [m]:
    document.getElementById("wideningc_shift2").value = cround(n2,2);

}