import { calculateShift, mround, cround, degrees, radians, IdopValueList, EdopValueList, DmaxValueList, SuperelevationConversionFromMilimetersToDegrees} from "./functions.js";

const correctionForItypeAndDmaxValues = (itype, radius, vmax) => {
    //correction for switches
    if(["switches", "arc switches"].includes[itype]){
       return {
        "itype": vmax < 160 ? `switches under 160`: `switches under 200`,
        "DmaxType": itype
       }
    }

    //correction for small radius
    if(radius < 200){
        return {
            "itype": "extra small curve radius",
            "DmaxType": "extra small curve radius"
        }
    }else if(radius < 250){
        return {
            "itype": "small curve radius",
            "DmaxType": "small curve radius"
        }
    }else if(radius < 300){
        return {
            "itype": itype,
            "DmaxType": "small curve radius"
        }
    }

    //defualt correction
    return {
        "itype": itype,
        "DmaxType": itype
    }
}

const calculateSuperelevation = (input) => {
    //destructering of input object
    const {radius: r, vmax, vmin, etype,isPlatform, calctype} = input
    const {itype: ItypeBeforeCorrection} = input

    //corrections for itype and choosing DmaxType
    const {itype, DmaxType} =  correctionForItypeAndDmaxValues(ItypeBeforeCorrection, r, vmax)

    //calculating Edop, Idop values
    const Idop = IdopValueList(itype, calctype)
    const Edop = EdopValueList(etype, calctype)

    //Cacluclating highest value of superelevation
    let DmaxLimit = DmaxValueList(DmaxType, calctype, r)
    if(isPlatform){
        DmaxLimit = mround(Math.min(DmaxValueList(DmaxType, calctype, r),DmaxValueList( "tracks with platform", calctype, r)),5)
    }
    const Dmax = Math.min(11.8*((vmin**2)/r)+Edop, DmaxLimit)

    //Calculating lowest value of superelevation
    const Dmin = Math.max(20, (11.8*(vmax**2)/r)-Idop)
    
    return {
        "Dmin": mround(Dmin,5),
        "Dreq": mround(6.5*(vmax**2)/r,5),
        "Dmed": mround((Dmax+Dmin)/2,5),
        "Deq": mround((11.8*(vmax**2)/r),5),
        "Dmax": mround(Dmax,5),
    }
}

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
    document.querySelector('#dmin_result_in_degrees').value = SuperelevationConversionFromMilimetersToDegrees(Dmin)
    document.querySelector('#dreq_result_in_milimeters').value = Dreq
    document.querySelector('#dreq_result_in_degrees').value = SuperelevationConversionFromMilimetersToDegrees(Dreq)
    document.querySelector('#dmed_result_in_milimeters').value = Dmed;
    document.querySelector('#dmed_result_in_degrees').value = SuperelevationConversionFromMilimetersToDegrees(Dmed)
    document.querySelector('#deq_result_in_milimeters').value = Deq
    document.querySelector('#deq_result_in_degrees').value = SuperelevationConversionFromMilimetersToDegrees(Deq)
    document.querySelector('#dmax_result_in_milimeters').value = mround(Dmax,5);
    document.querySelector('#dmax_result_in_degrees').value = SuperelevationConversionFromMilimetersToDegrees(Dmax)
}

document.querySelector("#superelevation_compute_input").addEventListener("input", superelevationEventHandler)
document.querySelector("#superelevation_calctype").addEventListener("input", superelevationEventHandler) 

const calculateTCParameters = (input) => {
   const {radius: r, length: l, curvetype} = input 

   return {
        "length": cround(l,2),
        "shift": cround(calculateShift(r, l, curvetype),2),
        "halflength": cround(l/2, 2)
   }
}

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

const divideTC = (curveForDivisionParameters) => {
    const {radius: r, length: l, curvetype: curvetype, newLength: lprim, superelevation: d} = curveForDivisionParameters

    let rprim

    switch(curvetype){
        case "3st":
            rprim = r*l/lprim
            return {
                "firstPartRadius": cround(rprim,2),
                "firstPartLength": lprim,
                "firstPartShift": cround(calculateShift(rprim, lprim, curvetype),2),
                "firstPartSuperelevation": mround(d*r/rprim,5)
            }
        case "bloss":
            rprim = r*(l**3)/((lprim**2)*(3*l-2*lprim))
            return {
                "firstPartRadius": cround(rprim,2),
                "firstPartLength": lprim,
                "firstPartShift": cround(calculateShift(rprim, lprim, curvetype),2),
                "firstPartSuperelevation": cround(d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3)),0)
            }
        case "4st":
            const superelevationLastPart = d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3))
            const {halflength: l2} = calculateTCParameters({"radius": r, "length": l, "curvetype": curvetype})
            if(lprim > l2){
                rprim = (r*l**2)/(2*l2**2);
                return {
                    "firstPartRadius": cround(rprim,2),
                    "firstPartLength": l2,
                    "firstPartShift": cround(calculateShift(rprim, l2, curvetype),2),
                    // "FirstPartSuperelevation": cround(d*(3*(l2**2)/(l**2) - 2*(l2**3)/(l**3)),2),
                    "secondPartRadius": cround((r*l2**2)/((4*(lprim-l2)*l2)-(2*(lprim-l2)**2)-(l2**2)),2),
                    "secondPartLength": lprim - l2,
                    "secondPartShift": 0,
                    "firstPartSuperelevation": cround(superelevationLastPart,0)
                }
            }else{
                rprim = (r*l**2)/(2*lprim**2);
                return{
                    "firstPartRadius": cround(rprim,2),
                    "firstPartLength": lprim,
                    "firstPartShift": cround(calculateShift(rprim, lprim, curvetype),2),
                    "firstPartSuperelevation": cround(superelevationLastPart,0)
                }
            }
    }
}

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
    document.querySelector("#tc_divsion_first_part_superelevation_in_degrees").value = firstPartSuperelevation? SuperelevationConversionFromMilimetersToDegrees(firstPartSuperelevation): ""

   
    console.table(curveAfterDivisionParameters)
}

document.querySelector("#tc_division_input").addEventListener("input", tcDivisionEventHandler)
document.querySelector("#tc_parameters_input").addEventListener("input", tcDivisionEventHandler)

document.querySelector("#superelevation_conversion_input")
document.querySelector("#superelevation_case")

const superelevationCaseLoadRender = () => {
    document.querySelector("#superelevation_in_milimeters_result").parentElement.classList.add("invisible");
    document.querySelector("#superelevation_in_degrees").parentElement.classList.add("invisible");
}

const superelevationCaseRender = () => {
    document.querySelector("#superelevation_in_milimeters_result").parentElement.classList.toggle("invisible");
    document.querySelector("#superelevation_in_degrees_result").parentElement.classList.toggle("invisible");
    document.querySelector("#superelevation_in_milimeters").parentElement.classList.toggle("invisible");
    document.querySelector("#superelevation_in_degrees").parentElement.classList.toggle("invisible");
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

window.addEventListener("load",superelevationCaseLoadRender);
document.querySelector("#superelevation_case").addEventListener("change", superelevationCaseRender)
document.querySelector("#superelevation_conversion_input").addEventListener('input', superelevationConvertEventHandler)

const superelevationConvert = (superelevationToConvert,superelevationCase) => {

    const degreesToMilimeters = (angle) => {
        return Math.tan(radians(angle))*1435;
    }

    const milimetersToDegrees = (milimeters) => {
        return degrees(Math.atan(milimeters/1435));
    }

    switch(superelevationCase){
        case "degrees":
            return cround(milimetersToDegrees(superelevationToConvert),2)
        case "milimeters":
            return cround(degreesToMilimeters(superelevationToConvert),2)
    }

}

const computeMinimalLengthTC = (input) => {

    //pobranie wartości z obiektu wejściowego
    const {radius: r, vmax, superelevation: d, curvetype, calctype} = input

    const type = {
        rec: 0,
        nrm: 1,
        ext: 2,
    }

    const calctypeIndex = type[calctype];

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
    const w4 = Number(30);
    const w5 = Number(Math.sqrt(qr*r));

    const minimalLengthPrototype = {
        "rec":Math.max(w1,w2,w3,w4,w5),
        "nrm":Math.max(w1,w2,w3),
        "ext":Math.max(w1,w2,w3),
    }

    const lmin = cround(minimalLengthPrototype[calctype],0)

    return calculateTCParameters({"radius": r, "length": lmin, "curvetype": curvetype})
}

const minimalTCLengthEventHandler = () => {

    const curveParametersInput = {
        radius: Number(document.querySelector("#minimal_tc_length_radius").value),
        vmax: Number(document.querySelector("#minimal_tc_length_velocity").value),
        superelevation: Number(document.querySelector("#minimal_tc_length_superelevation").value),
        curvetype: document.querySelector("#minimal_tc_length_curvetype").value,
        calctype: document.querySelector("#minimal_tc_length_calctype").value,
    }

    const {radius, vmax} = curveParametersInput

    console.log(curveParametersInput)

    if([radius, vmax].includes[0]){
        document.querySelector("#minimal_tc_length_length").value = "";
        document.querySelector("#minimal_tc_length_halflength").value = "";
        document.querySelector("#minimal_tc_length_shift").value = "";
        return
    }
        
    const {length, halflength, shift} = computeMinimalLengthTC(curveParametersInput)
    console.log(length, halflength, shift)

    document.querySelector("#minimal_tc_length_length").value = length;
    document.querySelector("#minimal_tc_length_halflength").value = halflength;
    document.querySelector("#minimal_tc_length_shift").value = shift;
}

document.querySelector("#minimal_tc_length_input").addEventListener("input", minimalTCLengthEventHandler)