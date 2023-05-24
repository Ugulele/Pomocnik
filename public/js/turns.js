function radians(angle){
    return (angle*Math.PI)/180;
}

function degrees(angle){
    return angle*(180/Math.PI);
}

function cround(number, digits){
    return Math.round(number*(10**digits))/(10**digits);
}

function turnlength(){
    //potrzebne wartości: vmax i turncase
    let vmax = document.getElementById("turn_max_velocity").value;
    let turncase = document.getElementById("turn_case").value;

    if(vmax){
        results()
    }else{
        document.getElementById("turn_minimal_length").value = "";
    }

    //wybór minimalnej długości łuku
    function minimallength(vmax,turncase){
        if(turncase == "exp"){
            if(Number(vmax) > 120){
                if (vmax < 200){
                    lmin = 0.30*vmax;
                }else{
                    lmin = 0.55*vmax;
                }
            }else{
                let l1 = 0.25*vmax;
                let l2 = 20;
                lmin = Math.max(Number(l1,l2));
            }
        }else{
            if(Number(vmax) > 120){
                if (vmax < 200){
                    lmin = 0.40*vmax;
                }else{
                    lmin = 0.65*vmax;
                }
            }else{
                let l1 = 0.35*vmax;
                let l2 = 30;
                lmin = Math.max(Number(l1,l2));
            }  
        }

        return lmin
    }

    //drukowanie wyniku
    function results(){
        let lmin = cround(minimallength(vmax, turncase),2);
        document.getElementById("turn_minimal_length").value = lmin;
    }
    
}

function turnparams(){
    //potrzebne wartości: r,l,t,alfa
    r = document.getElementById("turn_parameters_radius").value;
    l = document.getElementById("turn_parameters_length").value;
    t = document.getElementById("turn_parameters_slant").value;
    alfa = document.getElementById("turn_parameters_angle").value;

    //obliczanie l,t,alfa
    if(r && l){
        computeangle(r,l)
    }else if (r && (alfa||t)){
        computelength(r,alfa,t)
    }else{
        document.getElementById("turn_parameters_slant_result").value = "";
        document.getElementById("turn_parameters_angle_result").value = "";
        document.getElementById("turn_parameters_length_result").value = "";
        return
    }

    //przy l, obliczanie t i alfa
    function computeangle(r,l){
        alfa = 360*l/(2*Math.PI*r);
        t = 1/Math.tan(radians(alfa));

        document.getElementById("turn_parameters_slant_result").value = cround(t,4);
        document.getElementById("turn_parameters_angle_result").value = cround(alfa,4);
    }
    //przy  alfa/t obliczanie l i drugiego
    function computelength(r,alfa,t){
        if (!alfa && t) {
            l = degrees((Math.PI/2)-Math.atan(t))*2*Math.PI*r/360;
            alfa = l*360/(2*Math.PI*r)

            document.getElementById("turn_parameters_length_result").value = cround(l,4);
            document.getElementById("turn_parameters_angle_result").value = cround(alfa,4);

        }else if (alfa && !t){
            t = 1/Math.tan(radians(alfa));
            l = (alfa/360)*2*Math.PI*r;

            document.getElementById("turn_parameters_length_result").value = cround(l,4);
            document.getElementById("turn_parameters_slant_result").value = cround(t,4);
        }
    }   
}

function computeRmin(){

    const vmax = document.getElementById("turn_rmin_vmax").value;
    const calctype = document.getElementById("turn_rmin_calctype").value;

    if(vmax){
        let Dmax = selectDmax(calctype);
        let Idop = selectIdop(calctype);

        let rmin = 11.8*(vmax**2)/(Idop+Dmax);

        if(rmin <= 300){
            Dmax = selectExtendedDmax(calctype, rmin);
            Idop = SelectExtendedIdop(calctype, rmin);
            rmin = 11.8*(vmax**2)/(Idop+Dmax);  
        }

        document.getElementById("turn_rmin_result").value = Math.ceil(rmin);
    }else{
        document.getElementById("turn_rmin_result").value = "";
    }

    function selectDmax(calctype){
        
        const DmaxValueList = {
            "rec": 150, 
            "nrm": 150,
            "ext": 150,
        }

        return DmaxValueList[calctype]
    }

    function selectIdop(calctype){

        const IdopValueList = {
            "rec": 110,
            "nrm": 130,
            "ext": 150,
       }

       return IdopValueList[calctype]
    }

    function selectExtendedDmax(calctype, rmin){
        
        const DmaxValueList = {
            "rec": 0,
            "nrm": rmin >> 200 ? 100: 60,
            "ext": rmin >> 200? 150: 100,
        }

        Dmax = DmaxValueList[calctype]

        if(Dmax >> ((rmin-50)/1.5)){
            return ((rmin-50)/1.5)
        }else{
            return Dmax
        }
    }

    function SelectExtendedIdop(calctype, rmin){

        const IdopValueList = {
            "rec": rmin >> 250 ? 110: rmin >> 200 ? 80 : 50,
            "nrm": rmin >> 250 ? 130: rmin >> 200 ? 100 : 70,
            "ext": rmin >> 250 ? 150: rmin >> 200 ? 100 : 70,
       }

       return IdopValueList[calctype]
    }

}

const calculateMinimalCurveRadiusWithoutTC = (input) => {
    const { calctype, tracktype, vmax } = input;

    calctypeValueList = {
        rec: 0,
        nrm: 1,
        ext: 2,
    }

    const calcTypeIndex = calctypeValueList[calctype]

    deltaIdopValueList = {
        "joint tracks": 
        vmax <= 60  ?  [130,130,130]:
        vmax <= 100 ?  [100,100,125]:
        vmax <= 160 ?  [80,80, 160-0.35*vmax]:
                       [60,60, 160-0.35*vmax],
        "main tracks": 
        vmax <= 70  ?  [50,50,60]:
        vmax <= 160 ?  [0, 64-0.2*vmax, 50]:
        vmax <= 200 ?  [0,30,50]:
                       [0,25,25],
        "side tracks": [50,100,100],
    }

    const deltaIdop = deltaIdopValueList[tracktype][calcTypeIndex];
    const rmin = 11.8*(vmax**2)/deltaIdop;

    vmax ? document.querySelector("#turnwithouttc_rmin_result").value = cround(rmin,2): document.querySelector("#turnwithouttc_rmin_result").value = "";

}

const trackWithoutTCForm = document.querySelector("#turnwithouttc_pamrameters");

trackWithoutTCForm.addEventListener("input", () => {

    const output = {}

    for (const item of trackWithoutTCForm.children){
        if (item.classList.contains("boxline")){

            //pozyskiwanie nazwy klucza do obiektu wejściowego
            const keyNamePrefab = item.firstElementChild.getAttribute("id");
            const endpoint = keyNamePrefab.lastIndexOf("_");
            const keyName = keyNamePrefab.slice(endpoint + 1);

            //generowanie obiektu wyjściowego z parametrów
            output[keyName] = item.firstElementChild.value;
        }
    }
    
    calculateMinimalCurveRadiusWithoutTC(output)
})

