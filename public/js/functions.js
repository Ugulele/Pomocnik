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

const calctypeToIndex = (calctype) => {
  const calctypeIndexPrototype = {
    "rec": 0,
    "nrm": 1,
    "ext": 2
  }

  return calctypeIndexPrototype[calctype]
}

export const IdopValueList = (itype, calctype) => {
  const calctypeIndex = calctypeToIndex(calctype)

  const IdopValueListPrototype = {
    "main tracks": [110,130,150],
    "side tracks": [80,100,110],
    "small curve radius": [80,100,100],
    "extra small curve radius": [50,70,70],
    "switches under 160": [90,110,110],
    "switches under 200": [60,90,90],
    "double switches": [0,0,80]
  }

  return IdopValueListPrototype[itype][calctypeIndex]
}

export const EdopValueList = (etype, calctype) => {
  const calctypeIndex = calctypeToIndex(calctype)

  const EdopValueList = {
    "freight under 5": [90,110,110],
    "freight under 10": [95,95,110],
    "freigth under 15": [80,95,110],
    "freight under 20": [65,80,110],
    "freight above 20": [50,80,110]
  }

  return EdopValueList[etype][calctypeIndex]
}

export const DmaxValueList = (DmaxType ,calctype, radius) => {
  const calctypeIndex = calctypeToIndex(calctype)

  const DmaxValueList = {
      "main tracks": [150,150,150],
      "side tracks": [60, 100, 110],
      "tracks with platform": [60, 100, 110],
      "small curve radius": [0, 100, 150],
      "extra small curve radius": [0, 60, 100]
  }

  if(["small curve radius", "extra small curve radius"].includes(DmaxType)){
    return DmaxValueList[DmaxType][calctypeIndex] > 0 ? Math.min(DmaxValueList[DmaxType][calctypeIndex], (radius-50)/1.5): 0
  }
  return DmaxValueList[DmaxType][calctypeIndex]
}

export const lawMinimalRadius = (tracktype, calctype) => {
  const calctypeIndex = calctypeToIndex(calctype)

  const lawMinimalRadiusPrototype = {
    "main tracks": [600,300,180],
    "side tracks": [450, 180, 180],
    "tracks with platform": [500, 500, 300]
  }

  return lawMinimalRadiusPrototype[tracktype][calctypeIndex]
}

export const deltaIdopValueList = (calctype, tracktype) => {
  const calctypeIndex = calctypeToIndex(calctype)

  const deltaIdopValueListPrototype = {
    "joint tracks": 
    vmax <= 60  ?  [130,130,130]:
    vmax <= 100 ?  [100,100,125]:
    vmax <= 160 ?  [80,80, 160-0.35*vmax]:
                   [60,60, 160-0.35*vmax],
    "main tracks": 
    vmax <= 70  ?  [50,50,60]:
    vmax <= 160 ?  [0, 64-0.2*vmax, 50]:
    vmax <= 200 ?  [0,30,50]:
                   [0,25,25],
    "side tracks": [50,100,100],
  }

  return deltaIdopValueListPrototype[tracktype][calctypeIndex]
}