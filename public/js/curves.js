function cround(number, digits){
    return Math.round(number*(10**digits))/(10**digits);
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

function runliczCurvesKP(){
    //deklaracja wartości
    let r1 = document.getElementById("curve_radius_1").value;
    let dir1 = document.getElementById("curve_direction_1").value;
    let r2 = document.getElementById("curve_radius_2").value;
    let dir2 = document.getElementById("curve_direction_2").value;
    let curvetype = document.getElementById("curve_type").value;
    let l = document.getElementById("curve_length_joint").value;
    let l1 = document.getElementById("curve_length_1").value;
    let l2 = document.getElementById("curve_length_2").value;

    //deklaracja case`u
    const curvecase = document.getElementById("curve_case").value;

    if (r1 != 0 && r2 != 0 &&((l1 != 0 && l2 != 0)| l != 0)){
        liczCurvesKP(r1,dir1,r2,dir2,curvetype,l,l1,l2,curvecase);
    }else if(r1 == 0 && r2 == 0){
        if(curvecase == "2kp" || curvecase == "shears"){
            document.getElementById("curve_shift_1").value = "";
            document.getElementById("curve_shift_2").value = "";
            document.getElementById("curve_halflength_1").value = "";
            document.getElementById("curve_halflength_2").value = "";
        }else{
            document.getElementById("curve_shift_joint").value = "";
            document.getElementById("curve_halflength_joint").value = "";
    }}
}

function liczCurvesKP(r1,dir1,r2,dir2,curvetype,l,l1,l2,curvecase){
    
    dir1 === "left" ? r1 = -r1 : r1;
    dir2 === "left" ? r2 = -r2 : r2;

    //obliczanie przechyłki
    let n1, n2, n;
    
    if(curvetype == "3st"){
        if(curvecase == "2kp" || curvecase == "shears"){
            n1 = (l1**2)/(24*Math.abs(r1));
            n2 = (l2**2)/(24*Math.abs(r2));
        }else{
            n = ((l**2)/24)*Math.abs((1/r1)-(1/r2));
        }
    }else if(curvetype == "bloss"){
        if(curvecase == "2kp" || curvecase == "shears"){
            n1 = (l1**2)/(40*Math.abs(r1));
            n2 = (l2**2)/(40*Math.abs(r2));
        }else{
            n = ((l**2)/40)*Math.abs((1/r1)-(1/r2));
        }
    }

    if(curvecase == "2kp" || curvecase == "shears"){
        document.getElementById("curve_shift_1").value = cround(n1,2);
        document.getElementById("curve_shift_2").value = cround(n2,2);
        document.getElementById("curve_halflength_1").value = cround(l1/2,2);
        document.getElementById("curve_halflength_2").value = cround(l2/2,2);
    }else{
        document.getElementById("curve_shift_joint").value = cround(n,2);
        document.getElementById("curve_halflength_joint").value = cround(l/2,2);
    }
}
