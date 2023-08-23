//funkcja do zaokrąglania liczb
export const cround = (number, digits) =>
  Math.round(number * 10 ** digits) / 10 ** digits;

//funkcja zaokrąglania liczb do wielokrotności danej wartości
export const mround = (number, multiple) =>
  multiple * Math.round(number / multiple);

//funkcja przeliczania radianów na stopnie
export const degrees = (angle) => angle * (180 / Math.PI);

//funkcja przeliczająca stopnie na radiany
export const radians = (angle) => (angle * Math.PI) / 180;

//obliczanie przesunięcia w krzywej przejściowej
export const calculateShift = (r, l, curvetype) => {
  const shiftPrototype = {
    "3st": l ** 2 / (24 * Math.abs(r)),
    bloss: l ** 2 / (48 * Math.abs(r)),
    "4st": l ** 2 / (40 * Math.abs(r)),
  };

  return shiftPrototype[curvetype];
};
