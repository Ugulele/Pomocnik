import {
	degrees,
	radians,
	cround,
	mround,
} from "../functions/math_functions.js"
import {
	IdopValueList,
	EdopValueList,
	DmaxValueList,
} from "../functions/engineering_functions.js"

const correctionForItypeAndDmaxValues = (itype, radius, vmax) => {
	//correction for switches
	if (["switches", "arc switches"].includes(itype)) {
		return {
			"itype": vmax < 160 ? `switches under 160` : `switches under 200`,
			"DmaxType": itype,
		}
	}

	//correction for small radius
	if (radius < 200) {
		return {
			"itype": "extra small curve radius",
			"DmaxType": "extra small curve radius",
		}
	} else if (radius < 250) {
		return {
			"itype": "small curve radius",
			"DmaxType": "small curve radius",
		}
	} else if (radius < 300) {
		return {
			"itype": itype,
			"DmaxType": "small curve radius",
		}
	}

	//defualt correction
	return {
		"itype": itype,
		"DmaxType": itype,
	}
}

export const calculateSuperelevation = (input) => {
	//destructering of input object
	const { radius: r, vmax, vmin, etype, isPlatform, calctype } = input
	const { itype: ItypeBeforeCorrection } = input

	//corrections for itype and choosing DmaxType
	const { itype, DmaxType } = correctionForItypeAndDmaxValues(
		ItypeBeforeCorrection,
		r,
		vmax
	)

	//calculating Edop, Idop values
	const Idop = IdopValueList(itype, calctype)
	const Edop = EdopValueList(etype, calctype)

	//Cacluclating highest value of superelevation
	let DmaxLimit = DmaxValueList(DmaxType, calctype, r)
	if (isPlatform) {
		DmaxLimit = mround(
			Math.min(
				DmaxValueList(DmaxType, calctype, r),
				DmaxValueList("tracks with platform", calctype, r)
			),
			5
		)
	}
	const Dmax = Math.min(11.8 * (vmin ** 2 / r) + Edop, DmaxLimit)

	//Calculating lowest value of superelevation
	const Dmin = Math.max(20, (11.8 * vmax ** 2) / r - Idop)

	return {
		"Dmin": mround(Dmin, 5),
		"Dreq": mround((6.5 * vmax ** 2) / r, 5),
		"Dmed": mround((Dmax + Dmin) / 2, 5),
		"Deq": mround((11.8 * vmax ** 2) / r, 5),
		"Dmax": mround(Dmax, 5),
	}
}

export const superelevationConvert = (
	superelevationToConvert,
	superelevationCase
) => {
	const degreesToMilimeters = (angle) => {
		return Math.tan(radians(angle)) * 1435
	}

	const milimetersToDegrees = (milimeters) => {
		return degrees(Math.atan(milimeters / 1435))
	}

	switch (superelevationCase) {
		case "degrees":
			return cround(milimetersToDegrees(superelevationToConvert), 2)
		case "milimeters":
			return cround(degreesToMilimeters(superelevationToConvert), 2)
	}
}