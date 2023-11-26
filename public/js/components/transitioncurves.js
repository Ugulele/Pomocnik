import { cround, mround } from "../functions/math_functions.js"
import {
	calculateShift,
	calculateShiftforJointTC,
} from "../functions/engineering_functions.js"

export const calculateTCParameters = (input) => {
	const { radius: r, length: l, curvetype } = input

	return {
		"length": cround(l, 2),
		"shift": cround(calculateShift(r, l, curvetype), 2),
		"halflength": cround(l / 2, 2),
	}
}

export const divideTC = (curveForDivisionParameters) => {
	const {
		radius: r,
		length: l,
		curvetype: curvetype,
		newLength: lprim,
		superelevation: d,
	} = curveForDivisionParameters

	let rprim

	switch (curvetype) {
		case "3st":
			rprim = (r * l) / lprim
			return {
				"firstPartRadius": cround(rprim, 2),
				"firstPartLength": lprim,
				"firstPartShift": cround(calculateShift(rprim, lprim, curvetype), 2),
				"firstPartSuperelevation": mround((d * r) / rprim, 5),
			}
		case "bloss":
			rprim = (r * l ** 3) / (lprim ** 2 * (3 * l - 2 * lprim))
			return {
				"firstPartRadius": cround(rprim, 2),
				"firstPartLength": lprim,
				"firstPartShift": cround(calculateShift(rprim, lprim, curvetype), 2),
				"firstPartSuperelevation": cround(
					d * ((3 * lprim ** 2) / l ** 2 - (2 * lprim ** 3) / l ** 3),
					0
				),
			}
		case "4st":
			const superelevationLastPart =
				d * ((3 * lprim ** 2) / l ** 2 - (2 * lprim ** 3) / l ** 3)
			const { halflength: l2 } = calculateTCParameters({
				"radius": r,
				"length": l,
				"curvetype": curvetype,
			})
			if (lprim > l2) {
				rprim = (r * l ** 2) / (2 * l2 ** 2)
				return {
					"firstPartRadius": cround(rprim, 2),
					"firstPartLength": l2,
					"firstPartShift": cround(calculateShift(rprim, l2, curvetype), 2),
					// "FirstPartSuperelevation": cround(d*(3*(l2**2)/(l**2) - 2*(l2**3)/(l**3)),2),
					"secondPartRadius": cround(
						(r * l2 ** 2) /
							(4 * (lprim - l2) * l2 - 2 * (lprim - l2) ** 2 - l2 ** 2),
						2
					),
					"secondPartLength": lprim - l2,
					"secondPartShift": 0,
					"firstPartSuperelevation": cround(superelevationLastPart, 0),
				}
			} else {
				rprim = (r * l ** 2) / (2 * lprim ** 2)
				return {
					"firstPartRadius": cround(rprim, 2),
					"firstPartLength": lprim,
					"firstPartShift": cround(calculateShift(rprim, lprim, curvetype), 2),
					"firstPartSuperelevation": cround(superelevationLastPart, 0),
				}
			}
	}
}

export const computeMinimalLengthTC = (input) => {
	//pobranie wartości z obiektu wejściowego
	const { radius: r, vmax, superelevation: d, curvetype, calctype } = input

	const type = {
		rec: 0,
		nrm: 1,
		ext: 2,
	}

	const calctypeIndex = type[calctype]

	//obliczanie minimalnej długości KP
	const MinimalTCLengthParameters = {
		qn: curvetype === "3st" ? 1 : 1.5,
		qr: 0.48,
		dddsdop: [1.6, 2.0, 2.5],
		dddtdop: curvetype === "3st" ? [35, 50, 60] : [55, 55, 70],
		didtdop:
			curvetype === "3st"
				? vmax <= 200
					? [55, 70, 80]
					: [55, 55, 70]
				: [90, 90, 100],
	}

	const qn = MinimalTCLengthParameters.qn
	const qr = MinimalTCLengthParameters.qr
	const dddtdop = MinimalTCLengthParameters.dddtdop[calctypeIndex]
	const dddsdop = MinimalTCLengthParameters.dddsdop[calctypeIndex]
	const didtdop = MinimalTCLengthParameters.didtdop[calctypeIndex]

	//deklaracja stałych
	const I = (11.8 * vmax ** 2) / r - d

	const w1 = Number((qn * d) / dddsdop)
	const w2 = Number((qn * (vmax / 3.6) * d) / dddtdop)
	const w3 = Number((qn * (vmax / 3.6) * I) / didtdop)
	const w4 = Number(30)
	const w5 = Number(Math.sqrt(qr * r))

	const minimalLengthPrototype = {
		"rec": Math.max(w1, w2, w3, w4, w5),
		"nrm": Math.max(w1, w2, w3),
		"ext": Math.max(w1, w2, w3),
	}

	const lmin = cround(minimalLengthPrototype[calctype], 0)

	return calculateTCParameters({
		"radius": r,
		"length": lmin,
		"curvetype": curvetype,
	})
}

export const calculateTCforCurves = (
	firstCurveParameters,
	secondCurveParameters,
	TCParameters
) => {
	//dekonstrukcja pierwszego obiektu
	const { radius1, direction1 } = firstCurveParameters
	//dekonstrukcja drugiego obiektu
	const { radius2, direction2 } = secondCurveParameters
	//dekonstrukcja parametrów krzywej
	const { curvetype, curvecase, lengths } = TCParameters

	const directionValue = {
		"left": -1,
		"right": 1,
	}

	const r1 = radius1 * directionValue[direction1]
	const r2 = radius2 * directionValue[direction2]

	if (curvecase === "1kp") {
		return {
			l: lengths,
			n: cround(calculateShiftforJointTC(r1, r2, lengths, curvetype), 2),
			l2: cround(lengths / 2, 2),
		}
	} else {
		return {
			l1: lengths[0],
			l2: lengths[1],
			n1: cround(calculateShift(r1, lengths[0], curvetype), 2),
			n2: cround(calculateShift(r2, lengths[1], curvetype), 2),
			l21: cround(lengths[0] / 2, 2),
			l22: cround(lengths[1] / 2, 2),
		}
	}
}

export const computeMinimalLengthTCForCurves = (
	firstCurveParameters,
	secondCurveParameters
) => {
	const {
		radius: r1,
		vmax,
		superelevation: d1,
		curvetype,
		calctype,
	} = firstCurveParameters
	const { radius: r2, superelevation: d2 } = secondCurveParameters

	const type = {
		rec: 0,
		nrm: 1,
		ext: 2,
	}

	const calctypeIndex = type[calctype]

	const MinimalTCLengthParameters = {
		qn: curvetype === "3st" ? 1 : 1.5,
		qr: 0.48,
		dddsdop: [1.6, 2.0, 2.5],
		dddtdop: curvetype === "3st" ? [35, 50, 60] : [55, 55, 70],
		didtdop:
			curvetype === "3st"
				? vmax <= 200
					? [55, 70, 80]
					: [55, 55, 70]
				: [90, 90, 100],
	}

	const qn = MinimalTCLengthParameters.qn
	const qr = MinimalTCLengthParameters.qr
	const dddtdop = MinimalTCLengthParameters.dddtdop[calctypeIndex]
	const dddsdop = MinimalTCLengthParameters.dddsdop[calctypeIndex]
	const didtdop = MinimalTCLengthParameters.didtdop[calctypeIndex]

	const I = Math.max((11.8 * vmax ** 2) / r1 - d1, (11.8 * vmax ** 2) / r2 - d2)
	const d = Math.abs(d2 - d1)

	const w1 = Number((qn * d) / dddsdop)
	const w2 = Number((qn * (vmax / 3.6) * d) / dddtdop)
	const w3 = Number((qn * (vmax / 3.6) * I) / didtdop)
	const w4 = Number(30)
	const w5 = Number(Math.sqrt(qr * Math.abs(r2 - r1)))

	const minimalLengthPrototype = {
		"rec": Math.max(w1, w2, w3, w4, w5),
		"nrm": Math.max(w1, w2, w3),
		"ext": Math.max(w1, w2, w3),
	}

	const lmin = cround(minimalLengthPrototype[calctype], 0)

	return calculateTCforCurves(
		{ radius1: r1, direction1: "right" },
		{ radius2: r2, direction2: "right" },
		{ curvetype: curvetype, curvecase: "1kp", lengths: lmin }
	)
}