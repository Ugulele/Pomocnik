function mround(number, multiple){
    return multiple*Math.round(number/multiple);
}

function degrees(angle){
    return angle*(180/Math.PI);
}

function cround(number, digits){
    return Math.round(number*(10**digits))/(10**digits);
}

function eround(number, digits){
    return parseFloat(number.toFixed(digits));
}

function runFunctions(){
    let r = document.getElementById("radius").value;
    let vmax = document.getElementById("vmax").value;
    let vmin = document.getElementById("vmin").value;
    let itype = document.getElementById("idoplist").value;
    let etype = document.getElementById("edoplist").value;
    let platform = document.getElementById("platform").value;
    let calctype = document.getElementById("valuelist").value;
    let l = document.getElementById("length").value;
    let d = document.getElementById("superelevation").value;
    let curvetype = document.getElementById("curvetype").value;
    let lprim = document.getElementById("newl").value;

    if(r && vmax){
        if(vmin){
            liczPrzechylke(r,vmax,vmin,itype,etype,platform,calctype);
        }
       if(l){
            liczKP(r,l,curvetype);
            if(lprim){
                dzielKP();
            }else{
                document.getElementById("showrprim").value = "";
                document.getElementById("showrbis").value = "";
                document.getElementById("showlprim").value = "";
                document.getElementById("showlbis").value = "";
                document.getElementById("shownprim").value = "";
                document.getElementById("shownbis").value = "";
                document.getElementById('showdprim').value = "";
                document.getElementById('showdprimdeg').value = ""; 
            }
        }else if(!l && d){
            liczMinlKP(r,vmax,d,curvetype,calctype)
        }
    }else if(!r || !vmax || !vmin){
        document.getElementById('showdmin').value = "";
        document.getElementById('showdmindeg').value = ""; 
        document.getElementById('showdreg').value = "";
        document.getElementById('showdregdeg').value = "";
        document.getElementById('showdmed').value = "";
        document.getElementById('showdmeddeg').value = ""; 
        document.getElementById('showdeq').value = "";
        document.getElementById('showdeqdeg').value = "";  
        document.getElementById('showdmax').value = "";
        document.getElementById('showdmaxdeg').value = ""; 
        if(r && l){
            liczKP(r,l,curvetype);
            if(lprim){
                dzielKP()
            }
        }else if(r && l && lprim){

        }else{
            document.getElementById('halflength').value = "";
            document.getElementById('showshift').value = "";
        }
        if(!r && (vmax && vmin)){
            liczPrzechylke(r,vmax,vmin,itype,etype,platform,calctype);
        }
    }
    if(!lprim){
        document.getElementById("showrprim").value = "";
        document.getElementById("showrbis").value = "";
        document.getElementById("showlprim").value = "";
        document.getElementById("showlbis").value = "";
        document.getElementById("shownprim").value = "";
        document.getElementById("shownbis").value = "";
        document.getElementById('showdprim').value = "";
        document.getElementById('showdprimdeg').value = "";  
    }
}

function liczPrzechylke(r,vmax,vmin,itype,etype,platform,calctype){

    var Idop = 0;
    var Edop = 0;

    //ustalenie Idop z listy rozwijanej 

    if(itype == 1){
        if(calctype == 1){
            Idop = 110;
        }else if(calctype == 2){
            Idop = 130;
        }else{
            Idop = 150;
        }
    }
    else if(itype == 2){
        if(calctype == 1){
            Idop = 80;
        }else if(calctype == 2){
            Idop = 100;
        }else{
            Idop = 100;
        }
    }
    else if(itype == 3){
        if(calctype ==1){
            Idop = 80;
        }else if(calctype == 2){
            Idop = 100;
        }else{
            Idop = 100;
        }
    }
    else if(itype == 4){
        if(calctype == 1){
            Idop = 50;
        }else if(calctype == 2){
            Idop = 70;
        }else{
            Idop = 70;
        }
    }
    else if(itype == 5){
        if(calctype == 1){
            Idop = 90;
        }else if(calctype == 2){
            Idop = 110;
        }else{
            Idop = 110;
        }
    }else if(itype == 6){
        if(calctype == 1){
            Idop = 60;
        }else if(calctype == 2){
            Idop = 90;
        }else{
            Idop = 90;
        }
    }
    else if(itype == 7){
        if(calctype == 1){
            Idop = 0;
        }else if(calctype == 2){
            Idop = 0;
        }else{
            Idop = 80;
        }
    }
    
    //ustalanie Edop z listy rozwijanej - przerobić na case`y

    if(etype == 1){
        if(calctype == 1){
            Edop = 90;
        }else if(calctype == 2){
            Edop = 110;
        }else{
            Edop = 110;
        }
    }else if(etype == 2){
        if(calctype == 1){
            Edop = 95;
        }else if(calctype == 2){
            Edop = 95;
        }else{
            Edop = 110;
        }
    }else if(etype == 3){
        if(calctype ==1){
            Edop = 80;
        }else if(calctype == 2){
            Edop = 95;
        }else{
            Edop = 110;
        }
    }else if(etype == 4){
        if(calctype == 1){
            Edop = 65;
        }else if(calctype == 2){
            Edop = 80;
        }else{
            Edop = 110;
        }
    }else if(etype == 5){
        if(calctype == 1){
            Edop = 50;
        }else if(calctype == 2){
            Edop = 80;
        }else{
            Edop = 110;
        }
    }

    const Dmaxdop = 150;
    var rminbp = 11.8*(vmax**2)/Idop;
    var rminp = 11.8*(vmax**2)/(Idop+Dmaxdop);

    var Dmax = 0;

    //obliczanie Dmax
    if (Number(r) < 300) {
        Dmax = (r-50)/1.5;
    }else {
        Dmax = 11.8*((vmin**2)/r)+Edop;
    }
    
    if(platform == 2){
        if(calctype == 1){
            Dmax = 60;
        }else if(calctype == 2){
            Dmax = 100;
        }else{
            Dmax = 110;
        }
    }
    else if(Number(Dmax) >= 150){
        Dmax = 150;
    }
    
    //obilczanie Dreg
    var Dreg = 6.5*(vmax**2)/r;

    //Obliczanie Dmin
    var Dmin = (11.8*(vmax**2)/r)-Edop;

    if(Number(Dmin) < 20){
        Dmin = 20;
    }

    var Deq = (11.8*(vmax**2)/r)

    var Dmed = (Dmax+Dmin)/2

    //Drukowanie wyników
    if(r == 0){
        document.getElementById('radius').value = Math.round(rminp)
        return
    }else{
        document.getElementById('showdmin').value = mround(Dmin,5);
        document.getElementById('showdmindeg').value = cround(degrees(Math.atan(mround(Dmin,5)/1435)),1); 
        document.getElementById('showdreg').value = mround(Dreg,5);
        document.getElementById('showdregdeg').value = cround(degrees(Math.atan(mround(Dreg,5)/1435)),1);
        document.getElementById('showdmed').value = mround(Dmed,5);
        document.getElementById('showdmeddeg').value = cround(degrees(Math.atan(mround(Dmed,5)/1435)),1); 
        document.getElementById('showdeq').value = mround(Deq,5);
        document.getElementById('showdeqdeg').value = cround(degrees(Math.atan(mround(Deq,5)/1435)),1);  
        document.getElementById('showdmax').value = mround(Dmax,5);
        document.getElementById('showdmaxdeg').value = cround(degrees(Math.atan(mround(Dmax,5)/1435)),1); 
    }
   
}   

function liczKP(r,l,curvetype){
    r = document.getElementById("radius").value;
    l = document.getElementById("length").value;
    curvetype = document.getElementById("curvetype").value;

    n = liczPrzesuniecie(r,l,curvetype);

    document.getElementById("showshift").value = cround(n,2);
    let l2 = cround(l/2,2)
    document.getElementById("halflength").value = l2;
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

function liczMinlKP(r,vmax,d,curvetype,calctype){

    if (d == 0){
        document.getElementById("length").value = "";
        document.getElementById("halflength").value = "";
        document.getElementById("showlength").value = "";
        return
    }

    //obliczanie minimalnej długości KP
    var qn = 0;
    var qr = 0;
    var dddtdop = 0;
    var dddsdop = 0;
    var didtdop = 0;

    //deklaracja stałych
    let I = (11.8*(vmax**2)/r) - d; // krzywoliniowa - same here

    //deklaracja stałych w zależności od typu krzywej
    if(curvetype == "3st"){
    qn = 1;
    qr = 0.48;
    if(calctype == 1){
            dddsdop = 1.6;
            dddtdop = 35;
            if(vmax <= 200){
                didtdop = 55;
            }else{
                didtdop = 55;
            }
            
    }else if(calctype == 2){
            dddsdop = 2.0;
            dddtdop = 50;
            if(vmax <= 200){
                didtdop = 70;
            }else{
                didtdop = 55;
            }
    }else{
            dddsdop = 2.5;
            dddtdop = 60;
            if(vmax <= 200){
                didtdop = 80;
            }else{
                didtdop = 70;
            }
    }
    }else if(curvetype == "4st"){
        qn = 1.5;
        qr = 0.48;
        if(calctype == 1){
            dddsdop = 1.6;
            dddtdop = 55;
            didtdop = 90;
        }else if(calctype == 2){
            dddsdop = 2.0;
            dddtdop = 55;
            didtdop = 90;
        }else{
            dddsdop = 2.5;
            dddtdop = 70;
            didtdop = 100;
        }
    }else if(curvetype == "bloss"){ //potencjalne rozszerzenie na inne typy krzywych
        qn = 1.5;
        qr = 0.48;
        if(calctype == 1){
            dddsdop = 1.6;
            dddtdop = 55;
            didtdop = 90;
        }else if(calctype == 2){
            dddsdop = 2.0;
            dddtdop = 50;
            didtdop = 90;
        }else{
            dddsdop = 2.5;
            dddtdop = 70;
            didtdop = 100;
        } 
    } 

    const w1 = Number(qn*d/dddsdop);
    const w2 = Number(qn*(vmax/3.6)*d/dddtdop);
    const w3 = Number(qn*(vmax/3.6)*I/didtdop);
    const w4 = 30;
    const w5 = Number(Math.sqrt(qr*r));

    var lmin
    if(calctype == 1){
        lmin = Math.max(w1,w2,w3,w4,w5);
    }else{
        lmin = Math.max(w1,w2,w3)
    }

    document.getElementById("length").value = cround(lmin,2);
    document.getElementById("halflength").value = cround(lmin/2,2)

    n = liczPrzesuniecie(r,lmin,curvetype)
    document.getElementById("showshift").value = cround(n,2)
}

function dzielKP(){
    //deklaracja wartości
    let r = document.getElementById("radius").value;
    let l = document.getElementById("length").value;
    let l2 = document.getElementById("halflength").value;
    let d = document.getElementById("superelevation").value;
    let curvetype = document.getElementById("curvetype").value;
    var lprim = document.getElementById("newl").value;

    //wartości do obliczeń
    var rprim = 0;
    var nprim = 0;
    var ksi = 0;
    var kappa = 0;
    var ykprim = 0;
    var dprim = 0;

    //Obliczanie przesunięcia i promienia/promieni w zależności od typu krzywej
    if(curvetype == "3st"){
        rprim = r*l/lprim;
        nprim = (lprim**2)/(24*rprim);
        dprim = d*r/rprim;
    }else if(curvetype == "4st"){
        dprim = d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3));
        if(Number(lprim) > Number(l2)){
            rprim = (r*l**2)/(2*l2**2);
            var lbis = lprim - l2;
            lprim = l2;
            var rbis = (r*lprim**2)/((4*lbis*lprim)-(2*lbis**2)-(lprim**2));
        }else{
            rprim = (r*l**2)/(2*lprim**2);
        }
        //przesunięcie
        ksi = Math.asin(lprim/(2*rprim));
        kappa = 1/Math.cos(ksi);
        ykprim = kappa*7*(lprim**2)/(48*rprim);
        nprim = (ykprim - rprim*(1-Math.cos(ksi)))/Math.cos(ksi);
    }else if(curvetype == "bloss"){
        rprim = r*(l**3)/((lprim**2)*(3*l-2*lprim))
        ksi = Math.asin(lprim/(2*rprim));
        ykprim = 3*(lprim**2)/(20*rprim);
        nprim = (ykprim - rprim*(1-Math.cos(ksi)))/Math.cos(ksi);
        dprim = d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3))
    }

    //drukowanie wyników
    document.getElementById("showrprim").value = cround(rprim,2);
    document.getElementById("showlprim").value = lprim;
    document.getElementById("shownprim").value = cround(nprim,2);
    if(isNaN(d) == false){
        document.getElementById('showdprim').value = mround(dprim,5);
        document.getElementById('showdprimdeg').value = cround(degrees(Math.atan(mround(dprim,5)/1435)),2); 
    }
    //warunek + czyszczenie dla 4 stopnia
    if(curvetype == "4st"){
        document.getElementById("showrbis").value = cround(rbis,2);
        if(lbis != 0){
            document.getElementById("showlbis").value = lbis;
        }
        if(rbis != 0){
            document.getElementById("shownbis").value = 0;
        }
    }else{
        document.getElementById("showrbis").value = "";
        document.getElementById("showlbis").value = "";
        document.getElementById("shownbis").value = "";
    }

}

function elevationcase(){
    let d1 = document.getElementById("superelevation_degrees").value;
    let d2 = document.getElementById("superelevation_milimeters").value;
    let supercase = document.getElementById("superelevation_case").value

    if (supercase == "degrees"){
        document.getElementById("superelevation_milimeters_result").parentElement.classList.add("invisible");
        document.getElementById("superelevation_degrees_result").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_milimeters").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_degrees").parentElement.classList.add("invisible");
    }else{
        document.getElementById("superelevation_milimeters_result").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_degrees_result").parentElement.classList.add("invisible");
        document.getElementById("superelevation_milimeters").parentElement.classList.add("invisible");
        document.getElementById("superelevation_degrees").parentElement.classList.remove("invisible");
    }

    
    if (!d1 && !d2){
        document.getElementById("superelevation_degrees_result").value  = "";
        document.getElementById("superelevation_milimeters_result").value = "";
    }else if(d1|d2){
        superelevationconvert(d1,d2);
    }
}

window.addEventListener("load",elevationcase);

function superelevationconvert(d1,d2){

    
    function degreestomilimeters(angle){
        return Math.tan(radians(angle))*1435;
    }

    function milimeterstodegrees(milimeters){
        return degrees(Math.atan(milimeters/1435));
    }

    
    let dres = ""
    
    if (d1 != 0) {
        dres = degreestomilimeters(d1);
    }else if (d2 !=0){
        dres = milimeterstodegrees(d2);
    }

    document.getElementById("superelevation_degrees_result").value  = cround(dres,2);
    document.getElementById("superelevation_milimeters_result").value = cround(dres,2);
    
}