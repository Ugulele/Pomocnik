//Preferencje użytkownika
const preferenceOpeningCheckbox = document.querySelector("#preference_opening_checkbox");
const preferenceClosingCheckbox = document.querySelector("#preference_closing_checkbox");

const userPreferencesList = [preferenceOpeningCheckbox,preferenceClosingCheckbox]

userPreferencesList.forEach(item => {

    const itemId = item.getAttribute("id");
   
    window.addEventListener('load', () =>{
        const itemSavedState = localStorage.getItem(itemId);
        item.checked = itemSavedState === "checked" ? true : false;
    })

    item.addEventListener('change', () => {
        const itemState = item.checked ? "checked" : "unchecked";
        localStorage.setItem(itemId,itemState);  
    })

})

//rozwijanie poszczególnych sekcji
const sections = document.querySelectorAll("section");
const labels = document.querySelectorAll(".label");

const sectionOpening = () => {
    sections.forEach(section => {
        section.setAttribute('data-visible', preferenceOpeningCheckbox.checked ? 'open': 'close');
    })
}

window.addEventListener('load', sectionOpening)
preferenceOpeningCheckbox.addEventListener('change', () => {
    sectionOpening();
})

const sectionsInvisibility = () => {
    sections.forEach(section => {
        if(section.getAttribute('data-visible') !== 'close'){
            section.setAttribute('data-visible', 'close')
        } 
    })
}

const sectionsVisibility = (source) =>{
    const nextElement = source.target.nextElementSibling;
    if(nextElement.getAttribute('data-visible') === 'close'){
        if(!preferenceClosingCheckbox.checked){
            sectionsInvisibility();
        }
        nextElement.setAttribute('data-visible', 'open');
    }else{
        nextElement.setAttribute('data-visible', 'close');
    }
}

document.querySelectorAll('.label').forEach(label => {
    label.addEventListener('click', (e) => {
        sectionsVisibility(e);

        e.target.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
    })
})


//automatyczna zmiana roku
const date = new Date();
document.getElementById("year").innerHTML = date.getFullYear();


