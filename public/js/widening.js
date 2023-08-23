import { calculateShift, cround, degrees, radians } from "./functions.js";

document.querySelector("#compute_first_widening_method_parameters_input").addEventListener("input", () =>{
    const r1 = Number(document.querySelector("#widening_radius_1").value);
    const r2 = Number(document.querySelector("#widening_radius_2").value);
    const d = Number(document.querySelector("#widening_change").value);
    const alfa = Number(document.querySelector("#widening_angle").value);
    const l1 = Number(document.querySelector("#widening_curve_length_1").value);
    const l2 = Number(document.querySelector("#widening_curve_length_2").value);
    const curvetype = document.querySelector("#widening_curvetype").value;

    if(!r1 || !r2 || !d || !alfa){
        document.querySelector("#widening_inset").value = "";
        document.querySelector("#widening_length").value = "";
        document.querySelector("#widening_curve1").value = "";
        document.querySelector("#widening_curve2").value = "";
        document.querySelector("#widening_shift_1").value = "";
        document.querySelector("#widening_shift_2").value  = "";
        return
    }

    const wideningParameters = liczPoszerzenie(r1,r2,d,alfa,l1,l2,curvetype);
    
    document.querySelector("#widening_inset").value = wideningParameters["inset"];
    document.querySelector("#widening_length").value = wideningParameters["length"];
    document.querySelector("#widening_curve1").value = wideningParameters["firstCurveLength"];
    document.querySelector("#widening_curve2").value = wideningParameters["secondCurveLength"];
    document.querySelector("#widening_shift_1").value = wideningParameters["shiftFirstCurve"];
    document.querySelector("#widening_shift_2").value = wideningParameters["shiftSecondCurve"];

})

const liczPoszerzenie = (r1,r2,d,alfa,l1,l2,curvetype) => {
    //obliczanie wartości wstawki i długości i przesunięć
    const insetLength = d/(Math.sin(radians(alfa))) - r1*Math.tan(radians(alfa/2)) - r2*Math.tan(radians(alfa/2)) - l1/2 - l2/2;

    const output = {
        inset: cround(insetLength,4),
        length: cround(insetLength + 2*l1 + 2*l2 + (alfa/360)*2*Math.PI*((r1)) + (alfa/360)*2*Math.PI*((r2)),4),
        firstCurveLength: cround((alfa/360)*2*Math.PI*((r1)) - l1,4),
        secondCurveLength: cround((alfa/360)*2*Math.PI*((r2)) - l2,4),
        shiftFirstCurve: l1 ? calculateShift(r1,l1,curvetype): "",
        shiftSecondCurve: l2 ? calculateShift(r2,l2,curvetype): "",
    }

    return output
}

document.querySelector("#compute_second_widening_method_parameters_input").addEventListener("input", () => {
    const r = Number(document.querySelector("#widening2_radius").value);
    const l = Number(document.querySelector("#widening2_curve_length").value);
    const d = Number(document.querySelector("#widening2_change").value);
    const curvetype = document.querySelector("#widening2_curvetype").value;
    
    if(!r || !d){
        document.querySelector("#widening2_length").value = "";
        document.querySelector("#widening2_angle").value = "";
        document.querySelector("#widening2_curve").value = "";
        document.querySelector("#widening2_shift").value = "";
        return
    }

    const wideningParameters = liczPoszerzenie2(r,l,d,curvetype);

    document.querySelector("#widening2_length").value = wideningParameters["length"];
    document.querySelector("#widening2_angle").value = wideningParameters["angle"]
    document.querySelector("#widening2_curve").value = wideningParameters["curveLength"]
    document.querySelector("#widening2_shift").value = wideningParameters["shift"]
})

const liczPoszerzenie2 = (r,l,d,curvetype) => {
    //Obliczanie poszerzenia
    let k = (-3*l +  Math.sqrt(l**2 + 4*r*d))/2;
    //Obliczanie kąta łuku
    let alfa = degrees(2*Math.atan((k+l)/(2*r)));

    const output = {
        lenght: cround(2*k + 4*l,2),
        angle: cround(alfa,4),
        curveLength: cround((alfa/360)*2*Math.PI*((r)),4),
        shift: l? calculateShift(r,l,curvetype): "",
    }

    return output
}

document.querySelector("#compute_third_widening_method_parameters_input").addEventListener("input", () => {
    const r = Number(document.querySelector("#widening3_radius").value);
    const d = Number(document.querySelector("#widening3_change").value);
    const curvetype = document.querySelector("#widening3_curvetype").value;
     
    if(!r || !d){
        document.querySelector("#widening3_length").value = "";
        document.querySelector("#widening3_curve_length").value = "";
        document.querySelector("#widening3_shift").value = "";
        return
    }

    const wideningParametrs = liczPoszerzenie3(r,d,curvetype)

    document.querySelector("#widening3_length").value = wideningParametrs["wideningLength"];
    document.querySelector("#widening3_curve_length").value = wideningParametrs["curveLength"];
    document.querySelector("#widening3_shift").value = wideningParametrs["shift"];
})

function liczPoszerzenie3(r,d,curvetype){
    //obliczanie długości krzywej
    const l = cround(Math.sqrt(d*(8*r-d))/4,2)
    const p = cround(4*l,2)

    //wyprowadzenie wyników
    const output = {
        wideningLength: p,
        curveLength: l,
        shift: calculateShift(r,l,curvetype),
    }
}

document.querySelector("#compute_fourth_widening_method_parameters_input").addEventListener("input", () => {
    const r1 = document.querySelector("#wideningc_radius_1").value;
    const r2 = document.querySelector("#wideningc_radius_2").value;
    const m1 = document.querySelector("#wideningc_gauge_before").value;
    const m2 = document.querySelector("#wideningc_gauge_after").value;
    const alfa = document.querySelector("#wideningc_angle").value;
    const l1 = document.querySelector("#wideningc_curve_length_1").value;
    const l2 = document.querySelector("#wideningc_curve_length_2").value;
    const curvetype = document.querySelector("#wideningc_curvetype").value;
 
    if(!r1 || !r2 || !m1 || !m2 || !alfa ){
        document.querySelector("#wideningc_inset").value = "";
        document.querySelector("#wideningc_curve1").value = "";
        document.querySelector("#wideningc_curve2").value = "";
        document.querySelector("#wideningc_shift1").value = "";
        document.querySelector("#wideningc_shift2").value = "";
        return
    }

    const wideningParameters = liczPoszerzenieluk(r1,r2,m1,m2,alfa,l1,l2,curvetype);

  
     document.querySelector("#wideningc_inset").value = wideningParameters["inset"];
     document.querySelector("#wideningc_curve1").value = wideningParameters["firstCurveLength"];
     document.querySelector("#wideningc_curve2").value = wideningParameters["secondCurveLength"];
     document.querySelector("#wideningc_shift1").value = wideningParameters["firstCurveShift"];
     document.querySelector("#wideningc_shift2").value = wideningParameters["secondCurveShift"];

     // Długość łuku Ł1 [m]:
     document.querySelector("#wideningc_curve1").value = cround((alfa/360)*2*Math.PI*r1 - l1,4);
 
     // Długość Łuku Ł2 [m]: 
     document.querySelector("#wideningc_curve2").value = cround((alfa/360)*2*Math.PI*r2 - l2,4);
 
     // Przesunięcie KP(Ł1) [m]: 
     document.querySelector("#wideningc_shift1").value = cround(n1,2);
 
     // Przesunięcie KP(Ł2) [m]:
     document.querySelector("#wideningc_shift2").value = cround(n2,2);
})

const liczPoszerzenieluk = (r1,r2,m1,m2,alfa,l1,l2,curvetype) => {
    //obliczanie przesunięć
    const n1 = calculateShift(r1,l1,curvetype);
    const n2 = calculateShift(r2,l2,curvetype);
    const n = n1-n2;

    //przesunięcie środków łuków
    const wt = ((m1-n)/(Math.sin(radians(alfa)))) - ((m2-n)/(Math.tan(radians(alfa))))

    //poprawka na przesunięcie końców łuków i kp
    const x1 = (m1/Math.sin(radians(alfa))) - (m1/Math.tan(radians(alfa)));
    const x2 = (m2/Math.sin(radians(alfa))) - (m2/Math.tan(radians(alfa)));
    const x = (x1+x2)/2;

    //poprawka ze względu na różnicę długości stycznych
    const t1 = r1*Math.tan(radians(alfa/2));
    const t2 = r2*Math.tan(radians(alfa/2));
    const t = t2-t1;

    //obliczenie wstawki
    const w = - wt +2*x - t;

    const output = {
        inset: cround(w, 4),
        firstCurveLength: cround((alfa/360)*2*Math.PI*r1 - l1,4),
        secondCurveLength: cround((alfa/360)*2*Math.PI*r2 - l2,4),
        firstCurveShift: Number(n1)? cround(n1,2): "",
        secondCurveShift: Number(n2)? cround(n2,2): "",
    }

    return output
}