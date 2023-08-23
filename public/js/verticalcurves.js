import { cround, degrees, radians } from "./functions.js";

const p = 0.05728586;
const vcaseElement = document.querySelector("#vertical_case")

function verticalVis(){
    const vcase = vcaseElement.value
    if(vcase === "radius"){
       document.getElementById("vertical_radius").parentElement.classList.add("invisible");
       document.getElementById("vertical_radius_result").parentElement.classList.remove("invisible");
       document.getElementById("vertical_length").parentElement.classList.remove("invisible");
       document.getElementById("vertical_length_result").parentElement.classList.add("invisible");
        //document.getElementById("vertical_button").value = "Oblicz długość";
    }else if(vcase === "length"){
        document.getElementById("vertical_radius").parentElement.classList.remove("invisible");
        document.getElementById("vertical_radius_result").parentElement.classList.add("invisible");
        document.getElementById("vertical_length").parentElement.classList.add("invisible");
        document.getElementById("vertical_length_result").parentElement.classList.remove("invisible");
        // document.getElementById("vertical_button").value = "Oblicz promień";
    }
}

window.addEventListener("load",verticalVis);
vcaseElement.addEventListener("change", verticalVis);

document.querySelector('#vertical_inclines_1_input').addEventListener("input", () =>{
    const verticalInclines1InputObject = {
        r: document.querySelector("#vertical_radius").value,
        l: document.querySelector("#vertical_length").value,
        i1: document.querySelector("#vertical_inclination_1").value,
        i2: document.querySelector("#vertical_inclination_2").value,
        vcase: document.querySelector("#vertical_case").value,
    }

    if(!Number(verticalInclines1InputObject.r) && !Number(verticalInclines1InputObject.l)){
        document.querySelector("#vertical_length_result").value = "";
        document.querySelector("#vertical_radius_result").value = "";
        return 
    }
   
    const result = verticalInclines1(verticalInclines1InputObject);
    document.querySelector("#vertical_length_result").value = cround(result,4);
    document.querySelector("#vertical_radius_result").value = cround(result,4);
})

function verticalInclines1(inputObject){
    const {r, l , i1, i2, vcase} = inputObject;

    //obliczanie wartości
    const deltai = Math.abs(i2 - i1);

    return vcase === "radius"?  l/(Math.PI*deltai*(p/180)) :  r*Math.PI*deltai*p/180;
}

document.querySelector('#vertical_inclines_2_input').addEventListener('input', () => {
    const l = document.getElementById("vertical_length_3").value;
    const i = document.getElementById("vertical_inclination_3").value;

    if(!Number(i) && !Number(l)){
        document.getElementById("vertical_length_3_result").value = "";
    }
    const result = verticalInclines2(l,i);
    document.getElementById("vertical_length_3_result").value = cround(result,6);
})

function verticalInclines2(l,i){
    //obliczanie wartości
    const lprim = l/Math.cos(radians(i*p));

    return lprim - l;
}

const convertHeightDifferenceToAngle = (h1, h2, l) => {
    //obliczanie wartości różnicy wysokości
    const h = h2 - h1;

    //obliczenie kąta
    const alfa = degrees(Math.atan(h/l));

    //obliczanie pochylenia
    return cround(alfa/p,2);
}

document.querySelector("#convert_height_difference_to_angle_input").addEventListener('input', () => {
     //deklaracja wartości
     const h1 = document.getElementById("vertical_height_4_before").value;
     const h2 = document.getElementById("vertical_height_4_after").value;
     const l = document.getElementById("vertical_length_4").value;
 
     if(!h1 || !h2 || !Number(l)){
         document.getElementById("vertical_inclination_4_result").value = "";
         return
     }
     const result = convertHeightDifferenceToAngle(h1, h2, l)
     document.getElementById("vertical_inclination_4_result").value = result;
})