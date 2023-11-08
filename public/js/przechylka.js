import { calculateShift, mround, cround, degrees, radians, IdopValueList, EdopValueList, DmaxValueList} from "./functions.js";

const calculateSuperelevation = (input) => {
    //destructering of input object
    const {radius: r, vmax, vmin, etype,isPlatform, calctype} = input
    let {itype} = input

    //DmaxType declaration
    let DmaxType = itype

    //DmaxType and itype corrrection for small radius curves
    if(r<200){
        itype = "extra small curve radius"
        DmaxType = "extra small curve radius"
    }else if(r<250){
        itype = "small curve radius"
        DmaxType = "small curve radius"
    }else if(r<300){
        DmaxType = "small curve radius"
    }

    //calculating Edop, Idop values
    const Idop = IdopValueList(itype, calctype)
    const Edop = EdopValueList(etype, calctype)

    //Cacluclating highest value of superelevation
    let DmaxLimit = DmaxValueList(DmaxType, calctype, r)
    if(isPlatform){
        DmaxLimit = cround(Math.min(DmaxValueList(DmaxType, calctype, r),DmaxValueList( "tracks with platform", calctype, r)),2)
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

    document.querySelector('#dmin_result_in_milimeters').value = Dmin
    document.querySelector('#dmin_result_in_degrees').value = cround(degrees(Math.atan(Dmin/1435)),1)
    document.querySelector('#dreq_result_in_milimeters').value = Dreq
    document.querySelector('#dreq_result_in_degrees').value = cround(degrees(Math.atan(Dreq/1435)),1);
    document.querySelector('#dmed_result_in_milimeters').value = Dmed;
    document.querySelector('#dmed_result_in_degrees').value = cround(degrees(Math.atan(Dmed/1435)),1); 
    document.querySelector('#deq_result_in_milimeters').value = Deq
    document.querySelector('#deq_result_in_degrees').value = cround(degrees(Math.atan(Deq/1435)),1);  
    document.querySelector('#dmax_result_in_milimeters').value = mround(Dmax,5);
    document.querySelector('#dmax_result_in_degrees').value = cround(degrees(Math.atan(mround(Dmax,5)/1435)),1); 
}

document.querySelector("#superelevation_compute_input").addEventListener("input", superelevationEventHandler)
document.querySelector("#superelevation_calctype").addEventListener("input", superelevationEventHandler) 

const calculateTCParameters = (input) => {
   const {radius: r, length: l, curvetype} = input 

   return {
        "shift": cround(calculateShift(r, l, curvetype),2),
        "halflength": cround(l/2, 2)
   }
}

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
                "firstPartSuperelevation": mround(d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3)),5)
            }
        case "4st":
            const dprim = d*(3*(lprim**2)/(l**2) - 2*(lprim**3)/(l**3));
            const {halflength: l2} = calculateTCParameters({"radius": r, "length": l, "curvetype": curvetype})
            if(lprim > l2){
                rprim = (r*l**2)/(2*l2**2);
                return {
                    "firstPartRadius": cround(rprim,2),
                    "firstPartLength": l2,
                    "firstPartShift": cround(calculateShift(rprim, l2, curvetype),2),
                    "secondPartRadius": cround((r*l2**2)/((4*(lprim-l2)*l2)-(2*(lprim-l2)**2)-(l2**2)),2),
                    "secondPartLength": lprim - l2,
                    "secondPartShift": 0,
                    "superelevationSecondPart": mround(dprim,5)
                }
            }else{
                rprim = (r*l**2)/(2*lprim**2);
                return{
                    "firstPartRadius": cround(rprim,2),
                    "firstPartLength": lprim,
                    "firstPartShift": cround(calculateShift(rprim, lprim, curvetype),2),
                    "firstPartSuperelevation": mround(dprim,5)
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

    const {radius: r, length: l, newLength: newL} = curveForDivisionParameters

    if([r, l, newL].includes(0)){
        return
    }

    const curveAfterDivisionParameters = divideTC(curveForDivisionParameters)

    console.table(curveAfterDivisionParameters)
}

document.querySelector("#tc_division_input").addEventListener("input", tcDivisionEventHandler)

const superelevation_degrees_element =  document.querySelector("#superelevation_in_degrees");
const superelevation_milimeters_element = document.querySelector("#superelevation_in_milimeters");
const superelevation_case_element = document.querySelector("#superelevation_case");

const elevationcase = () => {
    const d1 = superelevation_degrees_element.value
    const d2 = superelevation_milimeters_element.value
    const supercase = superelevation_case_element.value

    if (supercase == "degrees"){
        document.getElementById("superelevation_in_milimeters_result").parentElement.classList.add("invisible");
        document.getElementById("superelevation_in_degrees_result").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_in_milimeters").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_in_degrees").parentElement.classList.add("invisible");
    }else{
        document.getElementById("superelevation_in_milimeters_result").parentElement.classList.remove("invisible");
        document.getElementById("superelevation_degrees_result").parentElement.classList.add("invisible");
        document.getElementById("superelevation_in_milimeters").parentElement.classList.add("invisible");
        document.getElementById("superelevation_in_degrees").parentElement.classList.remove("invisible");
    }

    if (!d1 && !d2){
        document.getElementById("superelevation_in_degrees_result").value  = "";
        document.getElementById("superelevation_in_milimeters_result").value = "";
    }else if(d1||d2){
        superelevationconvert(d1,d2);
    }
}

window.addEventListener("load",elevationcase);
[superelevation_degrees_element, superelevation_milimeters_element, superelevation_case_element].forEach(element => element.addEventListener('input', elevationcase))

const superelevationconvert = (d1,d2) => {

    const degreestomilimeters = (angle) => {
        return Math.tan(radians(angle))*1435;
    }

    const milimeterstodegrees = (milimeters) => {
        return degrees(Math.atan(milimeters/1435));
    }

    let dres = ""
    
    if (Number(d1)) {
        dres = degreestomilimeters(d1);
    }else if (Number(d2)){
        dres = milimeterstodegrees(d2);
    }

    document.getElementById("superelevation_degrees_result").value  = cround(dres,2);
    document.getElementById("superelevation_milimeters_result").value = cround(dres,2);
    
}

const computeMinimalLengthTC = (input) => {

    //pobranie wartości z obiektu wejściowego
    const {r, vmax, d, curvetype, calctype} = input

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

    const lmin = minimalLengthPrototype[calctype]

    const output = {
        l: cround(lmin,2),
        l2: cround(lmin/2,2),
        n: cround(calculateShift(r,lmin,curvetype),2),
    }
    
    return output
}

const tc_min_length_input_form = document.querySelector("#minimal_tc_length_input");

tc_min_length_input_form.addEventListener("input", () => {

    const curveParametersInput = {
        r: document.getElementById("minimal_tc_length_radius").value,
        vmax: document.getElementById("minimal_tc_length_velocity").value,
        d: document.getElementById("minimal_tc_length_superelevation").value,
        curvetype: document.getElementById("minimal_tc_length_curvetype").value,
        calctype: document.getElementById("minimal_tc_length_calctype").value,
    }

    if(curveParametersInput.r && curveParametersInput.vmax){
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