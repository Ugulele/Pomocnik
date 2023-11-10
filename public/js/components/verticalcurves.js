import { cround, radians, degrees } from "../functions/math_functions.js";

const p = 0.05728586

export const verticalInclinesFirstMethod = (inputObject) => {
    const {r, l , i1, i2, vcase} = inputObject;

    //obliczanie wartości
    const deltai = Math.abs(i2 - i1);

    return vcase === "radius"?  cround(l/(Math.PI*deltai*(p/180)),4) :  cround(r*Math.PI*deltai*p/180,4);
}

export const verticalInclinesSecondMethod = (l,i) => {
    //obliczanie wartości
    const lprim = l/Math.cos(radians(i*p));

    return cround(lprim - l,6);
}

export const convertHeightDifferenceToAngle = (h1, h2, l) => {
    //obliczanie wartości różnicy wysokości
    const h = h2 - h1;

    //obliczenie kąta
    const alfa = degrees(Math.atan(h/l));

    //obliczanie pochylenia
    return cround(alfa/p,2);
}