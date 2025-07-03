import {
	deltaIdopValueList,
	IdopValueList,
	DmaxValueList,
	lawMinimalRadius,
} from "../functions/engineering_functions.js"
import { cround, radians, degrees } from "../functions/math_functions.js"

export const minimalLength = (vmax, turncase) => {
	const minimalLengthPrototype = {
		"rec": vmax >> 200 ? 0.65 * vmax : vmax >> 120 ? 0.4 * vmax : Math.max(0.35 * vmax, 30),
		"nrm": vmax >> 200 ? 0.65 * vmax : vmax >> 120 ? 0.4 * vmax : Math.max(0.35 * vmax, 30),
		"ext": vmax >> 200 ? 0.55 * vmax : vmax >> 120 ? 0.3 * vmax : Math.max(0.25 * vmax, 20),
	}

	return cround(minimalLengthPrototype[turncase], 2)
}

export const computeCurveMinimalRadius = (trackParameters) => {
	const minimalRadiusInIteration = (itype, DmaxType, rmin) => {
		Dmax = DmaxValueList(DmaxType, calctype, rmin)
		Idop = IdopValueList(itype, calctype)
		return Number((11.8 * vmax ** 2) / (Idop + Dmax))
	}

	const iterationForMinimalRadius = (rmin) => {
		let rminAfterCorrections
		if (rmin < 300) {
			itype = "main tracks"
			DmaxType = "small curve radius"
			rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
		}
		if (rmin < 250) {
			itype = "small curve radius"
			DmaxType = "small curve radius"
			rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
		}
		if (rmin < 200) {
			itype = "extra small curve radius"
			DmaxType = "extra small curve radius"
			rminAfterCorrections = minimalRadiusInIteration(itype, DmaxType, rmin)
		}

		return rminAfterCorrections
	}

	const { vmax, calctype } = trackParameters

	let itype = "main tracks"
	let DmaxType = "main tracks"
	const tracktype = "main tracks"

	let Dmax = DmaxValueList("main tracks", calctype)
	let Idop = IdopValueList("main tracks", calctype)
	let rmin = Number((11.8 * vmax ** 2) / (Idop + Dmax))
	let rminAfterCorrections

	if (rmin < 300) {
		itype = "main tracks"
		DmaxType = "small curve radius"
		rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
		rminAfterCorrections = iterationForMinimalRadius(rmin)
	}
	if (rmin < 250) {
		itype = "small curve radius"
		DmaxType = "small curve radius"
		rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
		rminAfterCorrections = iterationForMinimalRadius(rmin)
	}
	if (rmin < 200) {
		itype = "extra small curve radius"
		DmaxType = "extra small curve radius"
		rmin = minimalRadiusInIteration(itype, DmaxType, rmin)
		rminAfterCorrections = iterationForMinimalRadius(rmin)
	}

	const lawLimitedRadius = lawMinimalRadius(tracktype, calctype)
	const rminResult = rminAfterCorrections
		? Math.max(rminAfterCorrections, lawLimitedRadius)
		: Math.max(rmin, lawLimitedRadius)

	return Math.ceil(rminResult)
}

export const calculateMinimalCurveRadiusWithoutTC = (curveParameters) => {
	const { calctype, tracktype, vmax } = curveParameters

	const deltaIdop = deltaIdopValueList(calctype, tracktype, vmax)
	const rmin = (11.8 * vmax ** 2) / deltaIdop

	return cround(rmin, 2)
}

export const computeAngle = (r, l) => {
	return {
		"angle": cround((360 * l) / (2 * Math.PI * r), 4),
		slant() {
			return cround(1 / Math.tan(radians(this.angle)), 4)
		},
	}
}

export const computeLengthFromSlant = (r, t) => {
	return {
		"length": cround(
			(degrees(Math.PI / 2 - Math.atan(t)) * 2 * Math.PI * r) / 360,
			4
		),
		angle() {
			return cround((this.length * 360) / (2 * Math.PI * r), 4)
		},
	}
}

export const computeLengthFromAngle = (r, alfa) => {
	return {
		"slant": cround(1 / Math.tan(radians(alfa)), 4),
		"length": cround((alfa / 360) * 2 * Math.PI * r, 4),
	}
}