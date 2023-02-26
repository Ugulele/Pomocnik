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

    console.log("zaczynam liczyć")
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