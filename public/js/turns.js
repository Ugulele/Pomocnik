import { radians, cround, degrees, EdopValueList, deltaIdopValueList, IdopValueList, DmaxValueList, lawMinimalRadius } from "./functions.js";

const minimalLength = (vmax,turncase) => {

    const minimalLengthPrototype = {
        "rec": vmax >> 200 ? 0.65*vmax : vmax >> 120 ? 0.40*vmax : Math.max(0.35*vmax, 30),
        "nrm": vmax >> 200 ? 0.65*vmax : vmax >> 120 ? 0.40*vmax : Math.max(0.35*vmax, 30),
        "ext": vmax >> 200 ? 0.55*vmax : vmax >> 120 ? 0.30*vmax : Math.max(0.25*vmax, 20),
    }

    return minimalLengthPrototype[turncase]
}

const turnLength = () => {
    //potrzebne wartości: vmax i turncase
    const vmax = Number(document.querySelector("#turn_max_velocity").value);
    const turncase = document.querySelector("#turn_case").value;

    if(!vmax){
        document.querySelector("#turn_minimal_length").value = "";
        return
    }

    //drukowanie wyniku
    const lmin = cround(minimalLength(vmax, turncase),2);
    document.querySelector("#turn_minimal_length").value = lmin; 
}

document.querySelector("#turn_lenght_compute_input").addEventListener('input', turnLength);

const turnparams = () => {
    //potrzebne wartości: r,l,t,alfa    
    const r = Number(document.querySelector("#turn_parameters_radius").value);
    const l = Number(document.querySelector("#turn_parameters_length").value);
    const t = Number(document.querySelector("#turn_parameters_slant").value);
    const alfa = Number(document.querySelector("#turn_parameters_angle").value) 

    //przy l, obliczanie t i alfa
    const computeAngle = (r,l) => {
        return {
            "angle": cround(360*l/(2*Math.PI*r),4),
            slant() {
                return cround(1/Math.tan(radians(this.angle)),4)
            }
        }
    }

    const computeLengthFromSlant = (r, t) => {
        return {
            "length": cround(degrees((Math.PI/2)-Math.atan(t))*2*Math.PI*r/360,4),
            angle() {
                return cround(this.length*360/(2*Math.PI*r),4)
            }
        }
    }

    const computeLengthFromAngle = (r, alfa) =>  {
        return {
            "slant": cround(1/Math.tan(radians(alfa)),4),
            "length": cround((alfa/360)*2*Math.PI*r,4)
        }
    }

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

const computeCurveMinimalRadius = (trackParameters) => {

    
    const minimalRadiusInIteration = (itype, DmaxType, rmin) => {
        Dmax = DmaxValueList(DmaxType, calctype, rmin)
        Idop = IdopValueList(itype, calctype)
        return Number(11.8*(vmax**2)/(Idop+Dmax))
    }


    const iterationForMinimalRadius = (rmin) => {
        let rminAfterCorrections
        if(rmin < 300){
            itype = "main tracks"
            DmaxType = "small curve radius"
            rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
        }
        if(rmin < 250){
            itype = "small curve radius"
            DmaxType = "small curve radius"
            rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
        }
        if(rmin < 200){
            itype = "extra small curve radius"
            DmaxType = "extra small curve radius"
            rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
        }

        return rminAfterCorrections
    }

    const {vmax, calctype} = trackParameters

    let itype = "main tracks"
    let DmaxType = "main tracks"
    const tracktype = "main tracks"

    let Dmax = DmaxValueList("main tracks", calctype)
    let Idop = IdopValueList("main tracks", calctype)
    let rmin = Number(11.8*(vmax**2)/(Idop+Dmax))
    let rminAfterCorrections

    if(rmin < 300){
        itype = "main tracks"
        DmaxType = "small curve radius"
        rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
        rminAfterCorrections = iterationForMinimalRadius(rmin)
    }
    if(rmin < 250){
        itype = "small curve radius"
        DmaxType = "small curve radius"
        rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
        rminAfterCorrections = iterationForMinimalRadius(rmin)
    }
    if(rmin < 200){
        itype = "extra small curve radius"
        DmaxType = "extra small curve radius"
        rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
        rminAfterCorrections = iterationForMinimalRadius(rmin)
    }

    

    const lawLimitedRadius = lawMinimalRadius(tracktype, calctype)
    const rminResult = rminAfterCorrections ? Math.max(rminAfterCorrections, lawLimitedRadius) : Math.max(rmin, lawLimitedRadius)

    console.table({
        "result": rminResult,
        "minimal": rmin,
        "correction": rminAfterCorrections
    })

    return Math.ceil(rminResult)
    // rminAfterCorrection = rminAfterCorrection ? Math.max(rminAfterCorrection, 180): Math.max(rmin, 180); 
    // document.getElementById("turn_rmin_result").value = Math.ceil(rminAfterCorrection)
}

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

const calculateMinimalCurveRadiusWithoutTC = (curveParameters) => {
    const { calctype, tracktype, vmax } = curveParameters;

    const deltaIdop = deltaIdopValueList(calctype, tracktype);
    const rmin = 11.8*(vmax**2)/deltaIdop;

   return cround(rmin,2)
}

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

    document.querySelector("#turnwithouttc_rmin_result").value = minimalRadius
}

const trackWithoutTCForm = document.querySelector("#turnwithouttc_pamrameters");
trackWithoutTCForm.addEventListener("input", minimalRadiusWithoutTCEventHandler)
