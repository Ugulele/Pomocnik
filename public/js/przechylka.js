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

const valueList = document.querySelector("#valuelist");
const curveParameters = document.querySelector("#superelevation_compute_input");
const superelevationResults = document.querySelector("#superelevation_compute_output");
const TCParameters = document.querySelector("#tc_parameters_input");
const TCDivision = document.querySelector("#tc_dividing_output");

const SectionForm = [
    valueList,
    curveParameters,
    TCParameters,
]

SectionForm.forEach(item => {

    item.addEventListener("input", (e) =>{
        
        //pobranie obiektu z danymi wyjściowymi formularza
        const input = {
            r: document.querySelector("#radius"),
            vmax: document.querySelector("#vmax"),
            vmin: document.querySelector("#vmin"),
            itype: document.querySelector("#idoplist"),
            etype: document.querySelector("#edoplist"),
            platform: document.querySelector("#platform"),
            calctype: document.querySelector("#valuelist"),
            l: document.querySelector("#length"),
            l2: document.querySelector("#halflength"),
            d: document.querySelector("#superelevation"),
            curvetype: document.querySelector("#curvetype"),
            lprim: document.querySelector("#newl"),
        }

        let output = ""

        //uruchamianie funkcji w zależności od  przyjętych parametrów
        if(input.r.value && input.l.value && input.lprim.value){
            output = new tcDivisionInput(input.r, input.l, input.l2, input.curvetype, input.d, input.lprim)
            dzielKP(output);
        }
        else if(input.r.value && input.l.value){
            output = new tcComputeInput(input.r, input.l, input.curvetype) 
            liczKP(output);
        }
        else if(input.r.value){
            output = new superelevationComputeInput(input.r,input.vmax,input.vmin,input.itype,input.etype,input.platform, input.calctype);
            liczPrzechylke(output)
        }else{
            const superelevationOutput = document.querySelector("#superelevation_compute_output");
            for (const child of superelevationOutput.children){
                if (child.classList.contains("boxline")){
                    for (const item of child.children){
                        item.value = ""
                    }
                }
            }
            const tcDivisionOutput = document.querySelector("#tc_division_output");
            for (const child of tcDivisionOutput.children){
                if(child.classList.contains("boxline")){
                    for(const item of child.children){
                        item.value = ""
                    }
                }
            }
            const tcComputeOutput = [document.querySelector("#halflength"), document.querySelector("#showshift")]
            for(const item of tcComputeOutput){
                item.value = ""
            }
        }

        function superelevationComputeInput(r,vmax,vmin,itype,etype,platform,calctype){
            this.r = r.value,
            this.vmax = vmax.value,
            this.vmin = vmin.value,
            this.itype = itype.value,
            this.etype = etype.value,
            this.platform = platform.value,
            this.calctype = calctype.value
        }

        function tcComputeInput(r,l,curvetype){
            this.r = r.value,
            this.l = l.value,
            this.curvetype = curvetype.value
        }

        function tcDivisionInput(r, l, l2, curvetype, d, lprim){
            this.r = r.value,
            this.l = l.value,
            this.l2 = l2.value,
            this.curvetype = curvetype.value,
            this.d = d.value,
            this.lprim = lprim.value
        }

    })

})

function liczPrzechylke(input){
    const { r, vmax, vmin, itype, etype, platform, calctype } =  input

    //choosing Idop value
    const calctypeIndex = Number(calctype - 1);
    console.log(calctypeIndex);
    let IDopValueList;

    if(itype == 1){  // main tracks
        IDopValueList = [110,130,150];                
    }
    else if(itype == 2){    //"side tracks"
        IDopValueList = [80,100,110];   
    }
    else if(itype == 3){    // "small arc radius"
        IDopValueList = [80,100,100];   
    }
    else if(itype == 4){    // "extra small arc radius"
        IDopValueList = [80,100,100];  
    }
    else if(itype == 5){    // "switches with vmax <= 160"
        IDopValueList = [90,110,110];
    }
    else if(itype == 6){   // "switches with vmax > 160"
        IDopValueList = [60,90,90];
    }
    else if(itype == 7){    // "double switches"
        IDopValueList = [0,0,80];
    }

    const Idop = IDopValueList[calctypeIndex];
    
    //ustalanie Edop z listy rozwijanej - przerobić na case`y

    let EDopValueList = []

    if(etype == 1){     
        EDopValueList = [90,110,110];
    }
    else if(etype == 2){       
        EDopValueList = [95,95,110];
    }
    else if(etype == 3){       
        EDopValueList = [80,95,110];
    }
    else if(etype == 4){       
        EDopValueList = [65,80,110];
    }
    else if(etype == 5){       
        EDopValueList = [50,80,110];
    }

    const Edop = EDopValueList[calctypeIndex]

    // var rminbp = 11.8*(vmax**2)/Idop;
    // var rminp = 11.8*(vmax**2)/(Idop+Dmaxdop);

    //obliczanie Dmax
    const Dmaxdop = 150;
    let Dmax = 0;

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
    const Dreg = 6.5*(vmax**2)/r;

    //Obliczanie Dmin
    let Dmin = (11.8*(vmax**2)/r)-Idop;

    if(Number(Dmin) < 20){
        Dmin = 20;
    }

    const Deq = (11.8*(vmax**2)/r)
    const Dmed = (Dmax+Dmin)/2

    //Drukowanie wyników
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

function liczKP(input){
    const {r, l, curvetype} = input

    n = liczPrzesuniecie(r,l,curvetype);

    document.getElementById("showshift").value = cround(n,2);
    let l2 = cround(l/2,2)
    document.getElementById("halflength").value = l2;
}

function liczPrzesuniecie(r,l,curvetype){
    let n = "";
    if(curvetype=="3st"){
        n = (l**2)/(24*r);
    }else if(curvetype =="bloss"){
        n = (l**2)/(48*r)
    }else if(curvetype == "4st"){
        n = (l**2)/(40*r)
    } 
    return n;
}

function dzielKP(input){
    //deklaracja wartości
    let { r, l, l2, curvetype, d, lprim } = input

    //wartości do obliczeń
    let rprim = 0;
    let nprim = 0;
    let dprim = 0;

    //Obliczanie przesunięcia i promienia/promieni w zależności od typu krzywej
    if(curvetype == "3st"){
        rprim = r*l/lprim;
        nprim = liczPrzesuniecie(rprim,lprim,curvetype)
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
        nprim = liczPrzesuniecie(rprim,lprim,curvetype)
    }else if(curvetype == "bloss"){
        rprim = r*(l**3)/((lprim**2)*(3*l-2*lprim))
        ksi = Math.asin(lprim/(2*rprim));
        ykprim = 3*(lprim**2)/(20*rprim);
        nprim = liczPrzesuniecie(rprim,lprim,curvetype)
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
        if(rbis){
            document.getElementById("shownbis").value = 0;
        }else{
            document.getElementById("showrbis").value = "";
            document.getElementById("showlbis").value = "";
            document.getElementById("shownbis").value = "";
        }
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

const computeMinimalLengthTC = (input) => {

    //pobranie wartości z obiektu wejściowego
    const r = input.r.value;
    const vmax = input.vmax.value;
    const d = input.d.value;
    const curvetype = input.curvetype.value;
    let calctype = input.calctype.value;

    type = {
        rec: 0,
        nrm: 1,
        ext: 2,
    }

    calctypeIndex = type[calctype];

    //obliczanie minimalnej długości KP    
    const MinimalTCLengthParameters = {
        qn: curvetype === "3st" ? 1 : 1.5,
        qr: 0.48,
        dddsdop: [1.6,2.0,2.5],
        dddtdop: curvetype === "3st" ? [35,50,60] : [55,55,70],
        didtdop: curvetype === "3st" ? (vmax <= 200? [55,70,80] : [55,55,70]) : [90,90,100],
    }
    
    const qn = MinimalTCLengthParameters.qn;
    const qr = MinimalTCLengthParameters.qr;
    const dddtdop = MinimalTCLengthParameters.dddtdop[calctypeIndex];
    const dddsdop = MinimalTCLengthParameters.dddsdop[calctypeIndex];
    const didtdop = MinimalTCLengthParameters.didtdop[calctypeIndex];    

    //deklaracja stałych
    const I = (11.8*(vmax**2)/r) - d; 
 
    const w1 = Number(qn*d/dddsdop);
    const w2 = Number(qn*(vmax/3.6)*d/dddtdop);
    const w3 = Number(qn*(vmax/3.6)*I/didtdop);
    const w4 = 30.0;
    const w5 = Number(Math.sqrt(qr*r));
    

    if(calctype === "rec"){
        lmin = Math.max(w1,w2,w3,w4,w5);
    }else{
        lmin = Math.max(w1,w2,w3)
    }

    const output = {
        l: "",
        l2: "",
        n: "",
    }

    output.l = cround(lmin,2);
    output.l2 = cround(lmin/2,2);
    
    const n = liczPrzesuniecie(r,lmin,curvetype);
    output.n = cround(n,2)

    return output
}

const tc_min_length_input_form = document.querySelector("#minimal_tc_length_input");

tc_min_length_input_form.addEventListener("input", () => {

    const curveParametersInput = {
        r: document.getElementById("minimal_tc_length_radius"),
        vmax: document.getElementById("minimal_tc_length_velocity"),
        d: document.getElementById("minimal_tc_length_superelevation"),
        curvetype: document.getElementById("minimal_tc_length_curvetype"),
        calctype: document.getElementById("minimal_tc_length_calctype"),
    }

    if(curveParametersInput.r.value && curveParametersInput.vmax.value){
        const curveParametersOutput = computeMinimalLengthTC(curveParametersInput)
        document.getElementById("minimal_tc_length_length").value = curveParametersOutput.l;
        document.getElementById("minimal_tc_length_halflength").value = curveParametersOutput.l2;
        document.getElementById("minimal_tc_length_shift").value = curveParametersOutput.n;
    }else{
        document.getElementById("minimal_tc_length_length").value = "";
        document.getElementById("minimal_tc_length_halflength").value = "";
        document.getElementById("minimal_tc_length_shift").value = "";
    }
})