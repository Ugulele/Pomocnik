import { textForMainPageContainer } from "./components/textsformainpage.js"

//main page changing text content
document
	.querySelector("#clickable_elements_container")
	.addEventListener("click", function (e) {
		if (
			e.target.getAttribute("data-text-type") ||
			e.target.parentElement.getAttribute("data-text-type")
		) {
			const textType =
				e.target.getAttribute("data-text-type") ||
				e.target.parentElement.getAttribute("data-text-type")

			const generatedText = textForMainPageContainer(textType)

			document.querySelector("#generated_text_output").innerText = generatedText
		}
	})
//sections visibility

const sections = document.querySelectorAll("section")
const headers = document.querySelectorAll(".primary-header")

export const renderSelectedSectionandHeader = (e) => {
	e.preventDefault()
	if (!e.target.getAttribute("data-contains")) {
		return
	}
	sections.forEach((element) => {
		if (!element.classList.contains("invisible")) {
			element.classList.add("invisible")
		}
		if (
			element.getAttribute("data-contains") ===
			e.target.getAttribute("data-contains")
		) {
			element.classList.remove("invisible")
		}
	})
	headers.forEach((element) => {
		if (!element.classList.contains("invisible")) {
			element.classList.add("invisible")
		}
		if (
			element.getAttribute("data-contains") ===
			e.target.getAttribute("data-contains")
		) {
			element.classList.remove("invisible")
		}
	})
}

export const renderInitialAppState = () => {
	headers.forEach((element) => {
		if (element.getAttribute("data-contains") !== "main_page") {
			element.classList.add("invisible")
		}
	})
	sections.forEach((element) => {
		if (element.getAttribute("data-contains") !== "main_page") {
			element.classList.add("invisible")
		}
	})
}

const navButton = document.querySelector("nav button")

const changeIconFromHamburgerToCross = () => {
	const currentIcon = navButton.getAttribute("data-background")
	document.querySelector(".nav_menu").classList.toggle("active")
	navButton.setAttribute(
		"data-background",
		currentIcon === "hamburger" ? "cross" : "hamburger"
	)
}

export const renderFooterContent = () => {
	const date = new Date()
	document.querySelector(
		"#a_footer"
	).innerHTML = `&copy; Ugulele ${date.getFullYear()}`
}
navButton.addEventListener("click", changeIconFromHamburgerToCross)
