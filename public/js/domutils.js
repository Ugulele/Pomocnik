const sections = document.querySelectorAll("section")
const headers = document.querySelectorAll(".primary-header")

export const renderSelectedSectionandHeader = (e) => {
    e.preventDefault()
    if(!e.target.getAttribute("data-contains")){
        return
    }
    sections.forEach(element => {
        if(!element.classList.contains("invisible")){
            element.classList.add("invisible")
        }
        if(element.getAttribute("data-contains") === e.target.getAttribute("data-contains")){
            element.classList.remove("invisible")
        }
    })
    headers.forEach(element => {
        if(!element.classList.contains("invisible")){
            element.classList.add("invisible")
        }
        if(element.getAttribute("data-contains") === e.target.getAttribute("data-contains")){
            element.classList.remove("invisible")
        }
    })
    // e.target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' })
} 

export const renderInitialAppState = () => {
    headers.forEach(element => {
        if(element.getAttribute("data-contains") /* !== "landing-page" --preparation for landingpage*/ ){
            element.classList.add("invisible")
        }
        if(element.getAttribute("data-contains") === "tc_arc_arc"){
            element.classList.remove("invisible")
        }
    })
    sections.forEach(element => {
        if(element.getAttribute("data-contains")/* !== "landing-page" --preparation for landingpage*/){
            element.classList.add("invisible")
        }
        if(element.getAttribute("data-contains") === "tc_arc_arc"){
            element.classList.remove("invisible")
        }
    })
}

const navButton = document.querySelector("nav button")

const changeIconFromHamburgerToCross = () => {
    const currentIcon = navButton.getAttribute("data-background")
    document.querySelector(".nav_menu").classList.toggle("active")
    navButton.setAttribute("data-background", currentIcon === "hamburger" ? "cross" : "hamburger")
}

export const renderFooterContent = () => {
    const date = new Date();
    document.querySelector("#a_footer").innerHTML = `&copy; Ugulele ${date.getFullYear()}`
}
navButton.addEventListener("click", changeIconFromHamburgerToCross)