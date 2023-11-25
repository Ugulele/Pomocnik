import { calculateShift } from "../functions/engineering_functions.js"
import { radians, degrees, cround } from "../functions/math_functions.js"

export const calculateWideningFirstMethod = (parameters) => {
	const { r1, r2, d, alfa, l1, l2, curvetype } = parameters
	//obliczanie wartości wstawki i długości i przesunięć
	const insetLength =
		d / Math.sin(radians(alfa)) -
		r1 * Math.tan(radians(alfa / 2)) -
		r2 * Math.tan(radians(alfa / 2)) -
		l1 / 2 -
		l2 / 2

	return {
		"inset": cround(insetLength, 4),
		"length": cround(
			insetLength +
				2 * l1 +
				2 * l2 +
				(alfa / 360) * 2 * Math.PI * r1 +
				(alfa / 360) * 2 * Math.PI * r2,
			4
		),
		"firstCurveLength": cround((alfa / 360) * 2 * Math.PI * r1 - l1, 4),
		"secondCurveLength": cround((alfa / 360) * 2 * Math.PI * r2 - l2, 4),
		"shiftFirstCurve": l1 ? calculateShift(r1, l1, curvetype) : "",
		"shiftSecondCurve": l2 ? calculateShift(r2, l2, curvetype) : "",
	}
}

export const calculateWideningSecondMethod = (parameters) => {
	const { r, l, d, curvetype } = parameters
	const k = (-3 * l + Math.sqrt(l ** 2 + 4 * r * d)) / 2
	//Obliczanie kąta łuku
	const alfa = degrees(2 * Math.atan((k + l) / (2 * r)))
	return {
		"length": cround(2 * k + 4 * l, 2),
		"angle": cround(alfa, 4),
		"curveLength": cround((alfa / 360) * 2 * Math.PI * r, 4),
		"shift": l ? cround(calculateShift(r, l, curvetype), 2) : "",
	}
}

export const calculateWideningThirdMethod = (parameters) => {
	const { r, d, curvetype } = parameters
	//obliczanie długości krzywej
	const l = cround(Math.sqrt(d * (8 * r - d)) / 4, 2)
	const p = cround(4 * l, 2)

	//wyprowadzenie wyników
	return {
		wideningLength: p,
		curveLength: l,
		shift: cround(calculateShift(r, l, curvetype), 2),
	}
}

export const calculateWideningOnCurve = (parameters) => {
	const { r1, r2, m1, m2, alfa, l1, l2, curvetype } = parameters
	//obliczanie przesunięć
	const n1 = calculateShift(r1, l1, curvetype)
	const n2 = calculateShift(r2, l2, curvetype)
	const n = n1 - n2

	//przesunięcie środków łuków
	const wt =
		(m1 - n) / Math.sin(radians(alfa)) - (m2 - n) / Math.tan(radians(alfa))

	//poprawka na przesunięcie końców łuków i kp
	const x1 = m1 / Math.sin(radians(alfa)) - m1 / Math.tan(radians(alfa))
	const x2 = m2 / Math.sin(radians(alfa)) - m2 / Math.tan(radians(alfa))
	const x = (x1 + x2) / 2

	//poprawka ze względu na różnicę długości stycznych
	const t1 = r1 * Math.tan(radians(alfa / 2))
	const t2 = r2 * Math.tan(radians(alfa / 2))
	const t = t2 - t1

	//obliczenie wstawki
	const w = -wt + 2 * x - t

	return {
		"inset": cround(w, 4),
		"firstCurveLength": cround((alfa / 360) * 2 * Math.PI * r1 - l1, 4),
		"secondCurveLength": cround((alfa / 360) * 2 * Math.PI * r2 - l2, 4),
		"firstCurveShift": Number(n1) ? cround(n1, 2) : "",
		"secondCurveShift": Number(n2) ? cround(n2, 2) : "",
	}
}