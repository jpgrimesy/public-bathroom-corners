const hamburgerBtn = document.querySelector('#hamburger-btn button')
const dropdown = document.querySelector('#links-dropdown')

hamburgerBtn.addEventListener('click', () => {
    let display = dropdown.style.display
    dropdown.style.display = !display || display === 'none' ? 'block' : 'none'  
})