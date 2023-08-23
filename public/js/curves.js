import { calculateShift, cround } from "./functions.js"

const calculateShiftforJointTC = (r1, r2, l, curvetype) => {
   
    const shiftPrototype = {
        "3st":((l**2)/24)*Math.abs((1/r1) - (1/r2)),
        "bloss":((l**2)/48)*Math.abs((1/r1) - (1/r2)),
        "4st":((l**2)/40)*Math.abs((1/r1) - (1/r2)),
    }

    return shiftPrototype[curvetype]
}

const CurveTCInputs = [
    document.querySelector("#curve_length_joint"),
    document.querySelector("#curve_shift_joint"),
    document.querySelector("#curve_halflength_joint"),
    document.querySelector("#curve_shift_1"),
    document.querySelector("#curve_shift_2"),
    document.querySelector("#curve_length_1"),
    document.querySelector("#curve_length_2"),
    document.querySelector("#curve_halflength_1"),
    document.querySelector("#curve_halflength_2"),
]

const inputVisibility = (inputs, visibilityState) => {
    inputs.forEach(input => {
        const endpoint = input.getAttribute("id").lastIndexOf("_");
        if(visibilityState == "invisible"){
            if(input.getAttribute("id").slice(endpoint + 1) === "joint"){
                input.parentElement.classList.remove("invisible");
            }else{
                input.parentElement.classList.add("invisible");
            }
        }else{
            if(input.getAttribute("id").slice(endpoint + 1) === "joint"){
                input.parentElement.classList.add("invisible");
            }else{
                input.parentElement.classList.remove("invisible");
            }
        }
    })
}

const CurveTCInputsVisibility = () => {
    const curvecase = document.getElementById("curve_case").value;
    const visibilityState = curvecase == "1kp" ? "invisible" : "visible";
    inputVisibility(CurveTCInputs, visibilityState);
}

document.querySelector("#curve_case").addEventListener("change", CurveTCInputsVisibility)
window.addEventListener('load', CurveTCInputsVisibility)

const firstCurveElement = document.querySelector("#curve_tc_input_1st_curve");
const secondCurveElement = document.querySelector("#curve_tc_input_2nd_curve");
const parametersElement = document.querySelector("#curve_tc_input_tc_parameters")
const curveInputsArray = 
[
    firstCurveElement,
    secondCurveElement,
    parametersElement,
]

const calculateTCforCurves = (firstCurveParameters, secondCurveParameters, TCParameters) => {
    //dekonstrukcja pierwszego obiektu
    const {radius1, direction1} = firstCurveParameters;
    //dekonstrukcja drugiego obiektu
    const {radius2, direction2} = secondCurveParameters;
    //dekonstrukcja parametrów krzywej
    const {curvetype, curvecase, lengths} = TCParameters;

    const directionValue = {
        'left': -1,
        'right': 1,
    }

    const r1 = radius1*directionValue[direction1];
    const r2 = radius2*directionValue[direction2];

    if(curvecase === "1kp"){
        return {
            n: cround(calculateShiftforJointTC(r1, r2, lengths, curvetype),2),
            l2: cround(lengths/2,2),
        }
    }else{
        return {
            n1: cround(calculateShift(r1, lengths[0], curvetype),2),
            n2: cround(calculateShift(r2, lengths[1], curvetype),2),
            l21: cround(lengths[0]/2,2),
            l22: cround(lengths[1]/2,2),
        }
    }    
}
 
const CurveTCEventHandler = () => {
    //Definicja wstępnch parametrów
    const radiusFirstCurve = Number(firstCurveElement.querySelector('input').value);
    const radiusSecondCurve = Number(secondCurveElement.querySelector('input').value);
    const curvecase = document.querySelector("#curve_case").value;
    const lengths = curvecase === '1kp'? Number(document.querySelector("#curve_length_joint").value): [Number(document.querySelector("#curve_length_1").value), Number(document.querySelector("#curve_length_2").value)];

    //Sprawdzenie warunku sensu obsługi handlera
    if(!radiusFirstCurve  || !radiusSecondCurve || (Array.isArray(lengths) ? lengths.includes(0) : lengths === 0)){
            document.querySelector("#curve_shift_1").value = "";
            document.querySelector("#curve_shift_2").value = "";
            document.querySelector("#curve_halflength_1").value = "";
            document.querySelector("#curve_halflength_2").value = "";
            document.querySelector("#curve_shift_joint").value = "";
            document.querySelector("#curve_halflength_joint").value = "";
        return
    }
    //Obiekt łuk 1
    const firstCurveParameters = {
        radius1: radiusFirstCurve,
        direction1: firstCurveElement.querySelector('select').value,  
    }
    //Obiekt łuk 2
    const secondCurveParameters = {
        radius2: radiusSecondCurve,
        direction2: secondCurveElement.querySelector('select').value,  
    }
    //Obiekt parametry krzywej/krzywych
    const TCParameters = {
        curvetype: document.querySelector("#curve_type").value,
        curvecase: curvecase,
        lengths: lengths,
    } 

    const result = calculateTCforCurves(firstCurveParameters, secondCurveParameters, TCParameters);
    
    if(curvecase == '1kp'){
        const {n, l2} = result
        document.querySelector("#curve_shift_joint").value = n;
        document.querySelector("#curve_halflength_joint").value = l2;
    }else{
        const {n1,n2,l21, l22} = result
        document.querySelector("#curve_shift_1").value = n1;
        document.querySelector("#curve_shift_2").value = n2;
        document.querySelector("#curve_halflength_1").value = l21;
        document.querySelector("#curve_halflength_2").value = l22;
    }
}

curveInputsArray.forEach(element => element.addEventListener('input', CurveTCEventHandler))