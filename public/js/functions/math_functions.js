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