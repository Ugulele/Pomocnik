import { renderSelectedSectionandHeader, renderInitialAppState, renderFooterContent } from "./domutils.js"
import { superelevationConversionFromMilimetersToDegrees } from "./functions/engineering_functions.js"
import { calculateSuperelevation, superelevationConvert } from "./components/superelevation.js"
import { calculateTCParameters, divideTC, computeMinimalLengthTC, calculateTCforCurves, computeMinimalLengthTCForCurves } from "./components/transitioncurves.js"
import { calculateWideningFirstMethod, calculateWideningSecondMethod, calculateWideningThirdMethod, calculateWideningOnCurve } from "./components/widenings.js"
import { minimalLength, computeCurveMinimalRadius ,calculateMinimalCurveRadiusWithoutTC, computeAngle, computeLengthFromSlant, computeLengthFromAngle } from "./components/turns.js"
import { verticalInclinesFirstMethod, verticalInclinesSecondMethod, convertHeightDifferenceToAngle, minimalVerticalCurveRadius } from "./components/verticalcurves.js"

//app content render
document.querySelector("nav").addEventListener("click", (e) => {
    renderSelectedSectionandHeader(e)
})

window.addEventListener("load", renderInitialAppState)
window.addEventListener("load", renderFooterContent)


//superelevation event handlers
const superelevationEventHandler = () => {
    const curveParameters = {
        "radius": Number(document.querySelector("#superelevation_radius").value),
        "vmax": Number(document.querySelector("#superelevation_vmax").value),
        "vmin": Number(document.querySelector("#superelevation_vmin").value),
        "itype": document.querySelector("#superelevation_idoplist").value,
        "etype": document.querySelector("#superelevation_edoplist").value,
        "isPlatform": document.querySelector("#superelevation_is_platform").value === "true"? true: false,
        "calctype": document.querySelector("#superelevation_calctype").value
    }

    const {radius, vmax, vmin} = curveParameters

    if([radius, vmax || vmin].includes(0)){
        document.querySelector('#dmin_result_in_milimeters').value = ""
        document.querySelector('#dmin_result_in_degrees').value = ""
        document.querySelector('#dreq_result_in_milimeters').value = ""
        document.querySelector('#dreq_result_in_degrees').value = ""
        document.querySelector('#dmed_result_in_milimeters').value = ""
        document.querySelector('#dmed_result_in_degrees').value = ""
        document.querySelector('#deq_result_in_milimeters').value = ""
        document.querySelector('#deq_result_in_degrees').value = "" 
        document.querySelector('#dmax_result_in_milimeters').value = ""
        document.querySelector('#dmax_result_in_degrees').value = "" 
        return
    }

    const {Dmin, Dreq, Dmed, Deq, Dmax} = calculateSuperelevation(curveParameters)

    //poprawka aby funkcja zwracała 10 wartości zamiast pięciu
    //no na razie musi zwracać 5, bo nie umiem w obiekty xdx
    document.querySelector('#dmin_result_in_milimeters').value = Dmin
    document.querySelector('#dmin_result_in_degrees').value = superelevationConversionFromMilimetersToDegrees(Dmin)
    document.querySelector('#dreq_result_in_milimeters').value = Dreq
    document.querySelector('#dreq_result_in_degrees').value = superelevationConversionFromMilimetersToDegrees(Dreq)
    document.querySelector('#dmed_result_in_milimeters').value = Dmed;
    document.querySelector('#dmed_result_in_degrees').value = superelevationConversionFromMilimetersToDegrees(Dmed)
    document.querySelector('#deq_result_in_milimeters').value = Deq
    document.querySelector('#deq_result_in_degrees').value = superelevationConversionFromMilimetersToDegrees(Deq)
    document.querySelector('#dmax_result_in_milimeters').value = Dmax
    document.querySelector('#dmax_result_in_degrees').value = superelevationConversionFromMilimetersToDegrees(Dmax)
}

document.querySelector("#superelevation_compute_input").addEventListener("input", superelevationEventHandler)
document.querySelector("#superelevation_calctype").addEventListener("input", superelevationEventHandler) 

const tcParametersEventHandler = () => {
    const curveParameters = {
        "radius": Number(document.querySelector("#tc_radius").value),
        "length": Number(document.querySelector("#tc_length").value),
        "curvetype": document.querySelector("#tc_curvetype").value
    }

    const {radius: r, length: l} = curveParameters

    if([r, l].includes(0)){
        document.querySelector("#tc_halflength").value = ""
        document.querySelector("#tc_shift").value = ""
        return
    }

    const {halflength: l2, shift: n} = calculateTCParameters(curveParameters)

    document.querySelector("#tc_halflength").value = l2
    document.querySelector("#tc_shift").value = n
}

document.querySelector("#tc_parameters_input").addEventListener("input", tcParametersEventHandler)

const tcDvisionRenderAdditionalInputs = () => {
    const curvetype = document.querySelector("#tc_curvetype").value
    const tcDivisionOutputForm = document.querySelector("#tc_division_output")

    switch(curvetype){
        case "3st":
        case "bloss": {

            tcDivisionOutputForm.querySelectorAll("input").forEach((element) => {
                if(element.getAttribute("data-cut")){
                    element.classList.remove("half")
                }
            })
            document.querySelector("#tc_division_second_part_radius").classList.add("invisible")
            document.querySelector("#tc_division_second_part_length").classList.add("invisible")
            document.querySelector("#tc_divison_second_part_shift").classList.add("invisible")

        }
            break
        case "4st": {
            tcDivisionOutputForm.querySelectorAll("input").forEach((element) => {
                if(element.classList.contains("invisible")){
                    element.classList.toggle("invisible")
                }
                if(!element.classList.contains("half")){
                    element.classList.toggle("half")
                }
            })
            break
        }
    }
}

document.querySelector("#tc_curvetype").addEventListener("input", tcDvisionRenderAdditionalInputs)

const tcDivisionEventHandler = () => {
    const curveForDivisionParameters = {
        "radius": Number(document.querySelector("#tc_radius").value),
        "length": Number(document.querySelector("#tc_length").value),
        "curvetype": document.querySelector("#tc_curvetype").value,
        "newLength": Number(document.querySelector("#tc_division_new_length").value),
        "superelevation": Number(document.querySelector("#tc_division_superelevation").value)
    }

    const {radius: r, length: l, newLength: newL, curvetype} = curveForDivisionParameters

    if([r, l, newL].includes(0)){
        document.querySelector("#tc_division_first_part_radius").value = ""
        document.querySelector("#tc_division_first_part_length").value = ""
        document.querySelector("#tc_division_first_part_shift").value = ""
        document.querySelector("#tc_divison_first_part_superelevation_in_milimeters").value = ""
        document.querySelector("#tc_divsion_first_part_superelevation_in_degrees").value = ""
        document.querySelector("#tc_division_second_part_radius").value = ""
        document.querySelector("#tc_division_second_part_length").value = ""
        document.querySelector("#tc_divison_second_part_shift").value = ""
        return
    }

    const curveAfterDivisionParameters = divideTC(curveForDivisionParameters)

    const {secondPartRadius, secondPartLength, secondPartShift} = curveAfterDivisionParameters
    document.querySelector("#tc_division_second_part_radius").value = secondPartRadius ? secondPartRadius : ""
    document.querySelector("#tc_division_second_part_length").value = secondPartLength ? secondPartLength : ""
    document.querySelector("#tc_divison_second_part_shift").value = secondPartShift != 0 ? secondPartShift : 0

    const {firstPartRadius, firstPartLength, firstPartShift, firstPartSuperelevation} = curveAfterDivisionParameters
    document.querySelector("#tc_division_first_part_radius").value = firstPartRadius
    document.querySelector("#tc_division_first_part_length").value = firstPartLength
    document.querySelector("#tc_division_first_part_shift").value = firstPartShift
    document.querySelector("#tc_divison_first_part_superelevation_in_milimeters").value = firstPartSuperelevation ? firstPartSuperelevation : ""
    document.querySelector("#tc_divsion_first_part_superelevation_in_degrees").value = firstPartSuperelevation? superelevationConversionFromMilimetersToDegrees(firstPartSuperelevation): ""
}

document.querySelector("#tc_division_input").addEventListener("input", tcDivisionEventHandler)
document.querySelector("#tc_parameters_input").addEventListener("input", tcDivisionEventHandler)

const superelevationCaseRender = () => {
    const currentState = document.querySelector("#superelevation_case").value
    document.querySelectorAll("[data-superelevation-type]").forEach((element) => {
        if(element.getAttribute("data-superelevation-type") === currentState){
            element.classList.remove("invisible")
        }else{
            element.classList.add("invisible")
        }
    })
}

const superelevationConvertEventHandler = () => {

    const superelevationInMilimeters = Number(document.querySelector("#superelevation_in_milimeters").value)
    const superelevationInDegrees = Number(document.querySelector("#superelevation_in_degrees").value)
    const superelevationCase = document.querySelector("#superelevation_case").value

    if (!superelevationInMilimeters && !superelevationInDegrees){
        document.querySelector("#superelevation_in_degrees_result").value  = ""
        document.querySelector("#superelevation_in_milimeters_result").value = ""
        return
    }

    const superelevationToConvert = superelevationCase === "degrees" ? superelevationInMilimeters : superelevationInDegrees
    const superelevationResult = superelevationConvert(superelevationToConvert,superelevationCase)

    if(superelevationCase === "degrees"){
        document.querySelector("#superelevation_in_degrees_result").value = superelevationResult
    }else{
        document.querySelector("#superelevation_in_milimeters_result").value = superelevationResult
    }
}

window.addEventListener("load", superelevationCaseRender);
document.querySelector("#superelevation_case").addEventListener("change", superelevationCaseRender)
document.querySelector("#superelevation_conversion_input").addEventListener('input', superelevationConvertEventHandler)

const minimalTCLengthEventHandler = () => {

    const curveParametersInput = {
        radius: Number(document.querySelector("#minimal_tc_length_radius").value),
        vmax: Number(document.querySelector("#minimal_tc_length_velocity").value),
        superelevation: Number(document.querySelector("#minimal_tc_length_superelevation").value),
        curvetype: document.querySelector("#minimal_tc_length_curvetype").value,
        calctype: document.querySelector("#minimal_tc_length_calctype").value,
    }

    const {radius, vmax} = curveParametersInput

    if([radius, vmax].includes(0)){
        document.querySelector("#minimal_tc_length_length").value = ""
        document.querySelector("#minimal_tc_length_halflength").value = ""
        document.querySelector("#minimal_tc_length_shift").value = ""
        return
    }
        
    const {length, halflength, shift} = computeMinimalLengthTC(curveParametersInput)
    document.querySelector("#minimal_tc_length_length").value = length;
    document.querySelector("#minimal_tc_length_halflength").value = halflength;
    document.querySelector("#minimal_tc_length_shift").value = shift;
}

document.querySelector("#minimal_tc_length_input").addEventListener("input", minimalTCLengthEventHandler)

const CurveTCInputsVisibility = () => {
    const currentCase = document.querySelector("#curve_case").value;
    const currentState = currentCase === "1kp"? "joint": "separated"

    document.querySelectorAll("[data-arc-tc-curvetype]").forEach((element) => {
        if(element.getAttribute("data-arc-tc-curvetype") === currentState){
            element.classList.remove("invisible")
        }else{
            element.classList.add("invisible")
        }
    })
}

const minimalLengthCurveTCEventHandler = () => {

    const currentCase = document.querySelector("#minimal_tc_length_curve_case").value;
    const currentState = currentCase === "1kp" ? "joint": "separated"

    const firstArcParameters = {
        "radius": Number(document.querySelector("#minimal_tc_length_curve_radius_1").value),
        "direction": document.querySelector("#minimal_tc_length_curve_direction_1").value,
        "vmax": Number(document.querySelector("#minimal_tc_length_curve_velocity").value),
        "superelevation": Number(document.querySelector("#minimal_tc_length_curve_superelevation_1").value),
        "curvetype": document.querySelector("#minimal_tc_length_curve_type").value,
        "calctype": document.querySelector("#minimal_tc_length_curve_valuelist").value
        
    }
    const {radius: firstCurveRadius, vmax} = firstArcParameters

    const secondArcParameters = {
        "radius": Number(document.querySelector("#minimal_tc_length_curve_radius_2").value),
        "direction": document.querySelector("#minimal_tc_length_curve_direction_1").value,
        "vmax": Number(document.querySelector("#minimal_tc_length_curve_velocity").value),
        "superelevation": Number(document.querySelector("#minimal_tc_length_curve_superelevation_2").value),
        "curvetype": document.querySelector("#minimal_tc_length_curve_type").value,
        "calctype": document.querySelector("#minimal_tc_length_curve_valuelist").value
    }
    const {radius: secondCurveRadius} = secondArcParameters

    if([firstCurveRadius, secondCurveRadius, vmax].includes(0)){
        document.querySelector("#minimal_tc_length_curve_output").querySelectorAll("input").forEach((input) => input.value = "")
        return
    }

    if(currentState === "separated"){
        const{"length": firstCurveLength, "halflength": firstCurveHalflength, "shift": firstCurveShift} = computeMinimalLengthTC(firstArcParameters)
        const{"length": secondCurveLength, "halflength": secondCurveHalflength, "shift": secondCurveShift} = computeMinimalLengthTC(secondArcParameters)
        document.querySelector("#minimal_tc_curve_length_1").value = firstCurveLength
        document.querySelector("#minimal_tc_curve_halflength_1").value = firstCurveHalflength
        document.querySelector("#minimal_tc_curve_shift_1").value = firstCurveShift
        document.querySelector("#minimal_tc_curve_length_2").value = secondCurveLength
        document.querySelector("#minimal_tc_curve_halflength_2").value = secondCurveHalflength
        document.querySelector("#minimal_tc_curve_shift_2").value = secondCurveShift

    }else if(currentState === "joint"){
        const {l: length, n: shift, l2: halflength} = computeMinimalLengthTCForCurves(firstArcParameters, secondArcParameters)
        document.querySelector("#minimal_tc_curve_length_joint").value = length
        document.querySelector("#minimal_tc_curve_halflength_joint").value = halflength
        document.querySelector("#minimal_tc_curve_shift_joint").value = shift
    }

}

[
    document.querySelector("#curve_tc_minimal_length_input_1st_curve"),
    document.querySelector("#curve_tc_minimal_length_input_2nd_curve"),
    document.querySelector("#curve_tc_minimal_length_input_tc_parameters")
].forEach((item) => item.addEventListener("input", minimalLengthCurveTCEventHandler))

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
 
const curveTCEventHandler = () => {
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

curveInputsArray.forEach(element => element.addEventListener('input', curveTCEventHandler))

const minimalLengthCurveTCInputsVisibility = () => {
    const currentCase = document.querySelector("#minimal_tc_length_curve_case").value;
    const currentState = currentCase === "1kp"? "joint": "separated"

    document.querySelectorAll("[data-arc-tc-minimal-length-curvetype]").forEach((element) => {
        if(element.getAttribute("data-arc-tc-minimal-length-curvetype") === currentState){
            element.classList.remove("invisible")
        }else{
            element.classList.add("invisible")
        }
    })
}
window.addEventListener("load", minimalLengthCurveTCInputsVisibility)
document.querySelector("#minimal_tc_length_curve_case").addEventListener("change", minimalLengthCurveTCInputsVisibility)

//widenings Event Handlers
const wideningFirstMethodEventHandler = () => {
    const CurveParametersForWideningWithTwoCurvesAndInset = {
        "r1": Number(document.querySelector("#widening_radius_1").value),
        "r2": Number(document.querySelector("#widening_radius_2").value),
        "d": Number(document.querySelector("#widening_change").value),
        "alfa": Number(document.querySelector("#widening_angle").value),
        "l1": Number(document.querySelector("#widening_curve_length_1").value),
        "l2": Number(document.querySelector("#widening_curve_length_2").value),
        "curvetype": document.querySelector("#widening_curvetype").value
    }
    
    const {r1, r2, d, alfa} = CurveParametersForWideningWithTwoCurvesAndInset

    if(!r1 || !r2 || !d || !alfa){
        document.querySelector("#widening_inset").value = ""
        document.querySelector("#widening_length").value = ""
        document.querySelector("#widening_curve1").value = ""
        document.querySelector("#widening_curve2").value = ""
        document.querySelector("#widening_shift_1").value = ""
        document.querySelector("#widening_shift_2").value  = ""
        return
    }

    const {inset, length, firstCurveLength, secondCurveLength, shiftFirstCurve, shiftSecondCurve} = calculateWideningFirstMethod(CurveParametersForWideningWithTwoCurvesAndInset);
    
    document.querySelector("#widening_inset").value = inset
    document.querySelector("#widening_length").value = length
    document.querySelector("#widening_curve1").value = firstCurveLength
    document.querySelector("#widening_curve2").value = secondCurveLength
    document.querySelector("#widening_shift_1").value = shiftFirstCurve
    document.querySelector("#widening_shift_2").value = shiftSecondCurve
}

document.querySelector("#compute_first_widening_method_parameters_input").addEventListener("input", wideningFirstMethodEventHandler)

const wideningSecondMethodEventHandler = () => {
    const curvesForWideningParameters = {
        "r": Number(document.querySelector("#widening2_radius").value),
        "l": Number(document.querySelector("#widening2_curve_length").value),
        "d": Number(document.querySelector("#widening2_change").value),
        "curvetype": document.querySelector("#widening2_curvetype").value
    }

    const {r, d} = curvesForWideningParameters

    if(!r || !d){
        document.querySelector("#widening2_length").value = ""
        document.querySelector("#widening2_angle").value = ""
        document.querySelector("#widening2_curve").value = ""
        document.querySelector("#widening2_shift").value = ""
        return
    }

    const {length, angle, curveLength, shift} = calculateWideningSecondMethod(curvesForWideningParameters);

    document.querySelector("#widening2_length").value = length
    document.querySelector("#widening2_angle").value = angle
    document.querySelector("#widening2_curve").value = curveLength
    document.querySelector("#widening2_shift").value = shift
}

document.querySelector("#compute_second_widening_method_parameters_input").addEventListener("input", wideningSecondMethodEventHandler)

const wideningThirdMethodEventHandler = () => {
    const tcsForWideningParameters = {
        "r": Number(document.querySelector("#widening3_radius").value),
        "d": Number(document.querySelector("#widening3_change").value),
        "curvetype": document.querySelector("#widening3_curvetype").value
    }
    
    const {r, d} = tcsForWideningParameters

    if(!r || !d){
        document.querySelector("#widening3_length").value = ""
        document.querySelector("#widening3_curve_length").value = ""
        document.querySelector("#widening3_shift").value = ""
        return
    }

    const {wideningLength, curveLength, shift} = calculateWideningThirdMethod(tcsForWideningParameters)

    document.querySelector("#widening3_length").value = wideningLength
    document.querySelector("#widening3_curve_length").value = curveLength
    document.querySelector("#widening3_shift").value = shift
}

document.querySelector("#compute_third_widening_method_parameters_input").addEventListener("input", wideningThirdMethodEventHandler)

const wideningOnCurveEventHandler = () => {
    const curvesParametersForWidening = {
        "r1": Number(document.querySelector("#wideningc_radius_1").value),
        "r2": Number(document.querySelector("#wideningc_radius_2").value),
        "m1": Number(document.querySelector("#wideningc_gauge_before").value),
        "m2": Number(document.querySelector("#wideningc_gauge_after").value),
        "alfa": Number(document.querySelector("#wideningc_angle").value),
        "l1": Number(document.querySelector("#wideningc_curve_length_1").value),
        "l2": Number(document.querySelector("#wideningc_curve_length_2").value),
        "curvetype": document.querySelector("#wideningc_curvetype").value
    }

    const {r1, r2, m1, m2, alfa} = curvesParametersForWidening

    if([r1,r2,m1,m2,alfa].some(parameter => !parameter) ){
        document.querySelector("#wideningc_inset").value = ""
        document.querySelector("#wideningc_curve1").value = ""
        document.querySelector("#wideningc_curve2").value = ""
        document.querySelector("#wideningc_shift1").value = ""
        document.querySelector("#wideningc_shift2").value = ""
        return
    }

    const {inset, firstCurveLength, secondCurveLength, firstCurveShift, secondCurveShift} = calculateWideningOnCurve(curvesParametersForWidening);
  
     document.querySelector("#wideningc_inset").value = inset
     // Długość łuku Ł1 [m]:
     document.querySelector("#wideningc_curve1").value = firstCurveLength
     // Długość Łuku Ł2 [m]: 
     document.querySelector("#wideningc_curve2").value = secondCurveLength
     // Przesunięcie KP(Ł1) [m]: 
     document.querySelector("#wideningc_shift1").value = firstCurveShift
     // Przesunięcie KP(Ł2) [m]:
     document.querySelector("#wideningc_shift2").value = secondCurveShift
}

document.querySelector("#compute_fourth_widening_method_parameters_input").addEventListener("input", wideningOnCurveEventHandler)

//vertical curves event handlers
const verticalCurveInputsVisibilityState = () => {
    const currentState = document.querySelector("#vertical_case").value;
    
    document.querySelectorAll("[data-vertical-arc-case]").forEach((element) => {
        if(element.getAttribute("data-vertical-arc-case") === currentState){
            element.classList.remove("invisible")
        }else{
            element.classList.add("invisible")
        }
    })
}

window.addEventListener("load",verticalCurveInputsVisibilityState);
document.querySelector("#vertical_case").addEventListener("change", verticalCurveInputsVisibilityState);

const minimalVerticalCuvreRadiusEventHander = () => {
    const trackParameters = {
        "velocity": Number(document.querySelector("#minimal_vertical_radius_velocity").value),
        "tracktype": document.querySelector("#minimal_vertical_radius_tracktype").value,
        "calctype": document.querySelector("#minimal_vertical_radius_caltype").value
    }

    const {velocity} = trackParameters
    
    if(!velocity){
        document.querySelector("#minimal_vertical_radius_result").value = ""
        return
    }

    const verticalCurveRadius = minimalVerticalCurveRadius(trackParameters)
    document.querySelector("#minimal_vertical_radius_result").value = verticalCurveRadius
}

document.querySelector("#minimal_vertical_curve_radius_input").addEventListener("input", minimalVerticalCuvreRadiusEventHander)

const verticalInclinesFirstMethodEventHandler = () => {
    const verticalInclines1InputObject = {
        r: document.querySelector("#vertical_radius").value,
        l: document.querySelector("#vertical_length").value,
        i1: document.querySelector("#vertical_inclination_1").value,
        i2: document.querySelector("#vertical_inclination_2").value,
        vcase: document.querySelector("#vertical_case").value,
    }

    const {r, l} = verticalInclines1InputObject

    if(!Number(r) && !Number(l)){
        document.querySelector("#vertical_length_result").value = "";
        document.querySelector("#vertical_radius_result").value = "";
        return 
    }

    const result = verticalInclinesFirstMethod(verticalInclines1InputObject);
    document.querySelector("#vertical_length_result").value = result
    document.querySelector("#vertical_radius_result").value = result
}

document.querySelector('#vertical_inclines_1_input').addEventListener('input', verticalInclinesFirstMethodEventHandler)

const verticalInclinesSecondMethodEventHandler = () => {
    const l = document.querySelector("#vertical_length_3").value;
    const i = document.querySelector("#vertical_inclination_3").value;

    if(!Number(i) && !Number(l)){
        document.querySelector("#vertical_length_3_result").value = "";
    }

    const result = verticalInclinesSecondMethod(l,i);
    document.querySelector("#vertical_length_3_result").value = result;
}

document.querySelector('#vertical_inclines_2_input').addEventListener('input', verticalInclinesSecondMethodEventHandler)

const convertHeightDifferenceToAngleEventHandler = () => {
     //deklaracja wartości
     const h1 = document.querySelector("#vertical_height_4_before").value;
     const h2 = document.querySelector("#vertical_height_4_after").value;
     const l = document.querySelector("#vertical_length_4").value;
 
     if(!h1 || !h2 || !Number(l)){
         document.querySelector("#vertical_inclination_4_result").value = "";
         return
     }
     const result = convertHeightDifferenceToAngle(h1, h2, l)
     document.querySelector("#vertical_inclination_4_result").value = result;
}

document.querySelector("#convert_height_difference_to_angle_input").addEventListener('input', convertHeightDifferenceToAngleEventHandler)

//turns event handlers
const turnLength = () => {
    //potrzebne wartości: vmax i turncase
    const vmax = Number(document.querySelector("#turn_max_velocity").value)
    const turncase = document.querySelector("#turn_case").value

    if(!vmax){
        document.querySelector("#turn_minimal_length").value = ""
        return
    }

    //drukowanie wyniku
    const lmin = cround(minimalLength(vmax, turncase),2)
    document.querySelector("#turn_minimal_length").value = lmin
}

document.querySelector("#turn_lenght_compute_input").addEventListener('input', turnLength)

const computeCurveMinimalRadiusEventHandler = () => {
    const trackParameters = {
        "vmax": Number(document.querySelector("#turn_rmin_vmax").value),
        "calctype": document.querySelector("#turn_rmin_calctype").value,
    }
    
    const {vmax} = trackParameters

    if(!vmax){
        document.querySelector("#turn_rmin_result").value = "";
        return
    }

    const result = computeCurveMinimalRadius(trackParameters)

    document.querySelector("#turn_rmin_result").value = result
}

document.querySelector("#compute_minimal_radius_input").addEventListener('input', computeCurveMinimalRadiusEventHandler);

const minimalRadiusWithoutTCEventHandler = () => {
    const curveParameters = {
        "tracktype": document.querySelector("#turnwithouttc_rmin_tracktype").value,
        "calctype": document.querySelector("#turnwithouttc_rmin_calctype").value,
        "vmax": Number(document.querySelector("#turnwithouttc_rmin_vmax").value)
    }
    
    const {vmax} = curveParameters

    if(!vmax){
        document.querySelector("#turnwithouttc_rmin_result").value = ""
        return
    }

    const minimalRadius = calculateMinimalCurveRadiusWithoutTC(curveParameters)

    document.querySelector("#turnwithouttc_rmin_result").value = minimalRadius != Infinity ? minimalRadius :"Łuk niemożliwy"
}

document.querySelector("#turnwithouttc_pamrameters").addEventListener("input", minimalRadiusWithoutTCEventHandler)

const turnparams = () => {
    //potrzebne wartości: r,l,t,alfa    
    const r = Number(document.querySelector("#turn_parameters_radius").value);
    const l = Number(document.querySelector("#turn_parameters_length").value);
    const t = Number(document.querySelector("#turn_parameters_slant").value);
    const alfa = Number(document.querySelector("#turn_parameters_angle").value) 

    if([r,l ||t || alfa].includes(0)){
        document.querySelector("#turn_parameters_slant_result").value = "";
        document.querySelector("#turn_parameters_angle_result").value = "";
        document.querySelector("#turn_parameters_length_result").value = "";
        return
    }
    
    //obliczanie l,t,alfa
    if(l){
        const angleParameters = computeAngle(r,l)
        document.querySelector("#turn_parameters_slant_result").value = angleParameters.slant()
        document.querySelector("#turn_parameters_angle_result").value = angleParameters.angle
        return
    }else if (alfa){
        const output = computeLengthFromAngle(r, alfa)
        document.querySelector("#turn_parameters_length_result").value = output.length;
        document.querySelector("#turn_parameters_slant_result").value = output.slant;
        return
    }else if(t){
        const output = computeLengthFromSlant(r, t)
        document.querySelector("#turn_parameters_length_result").value = output.length;
        document.querySelector("#turn_parameters_angle_result").value = output.angle();
        return
    }
}

document.querySelector("#turn_parameters_input").addEventListener('input', turnparams);