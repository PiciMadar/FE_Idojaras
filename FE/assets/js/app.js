const SERVER_URL = "http://localhost:5501"

let  loggedUser;

let main = document.querySelector('main')
let mainNavbar = document.querySelector('#mainMenu')
let userNavbar = document.querySelector('#userMenu')


/*------------------Téma-----------*/

let currentTheme = "dark"

let lightBTN = document.querySelector('#lightModeBTN')
let darkBTN = document.querySelector('#darkModeBTN')
lightBTN.addEventListener('click', ( ) => {
    setTheme('light');
    saveTheme('light');
})
darktBTN.addEventListener('click', ( ) => {
    setTheme('dark');
    saveTheme('dark');
})


function loadTheme() {
    if (localStorage.getItem('SCTheme')) {
        theme = localStorage.getItem('SCTheme');
        saveTheme(theme);
    }
    setTheme(theme);
}

function saveTheme(theme) {
    localStorage.setItem('SCTheme', theme);
}




function setTheme(theme) {
    if (theme === 'auto') {
        document.documentElement.setAttribute('data-bs-theme', (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
    } else {
        document.documentElement.setAttribute('data-bs-theme', theme)
    }
    setThemeBTN(theme);
}
function setThemeBTN(theme) {
    if (theme == 'light') {
        lightBTN.classList.add('hide');
        darkBTN.classList.remove('hide');
    }
    else {
        lightBTN.classList.remove('hide');
        darkBTN.classList.add('hide');

    }
}
/*-------------------------------------------*/

async function render(view) {
    main.innerHTML = await (await fetch(`./view/${view}.html`)).text()
    
    switch (view) {
        case "profile":
            break;
        case "main":
            break;
        case "statistics":
            break;
        case "calendar":
            break;
        case "register":
            break;
        case "login":
            break;
        default:
            break;
    }
}


async function getLoggedUser(){
    if(sessionStorage.getItem("loggedUser")){
        loggedUser = JSON.parse(sessionStorage.getItem("loggedUser"));
        mainNavbar.classList.add("hide")
        userNavbar.classList.remove("hide")

        await render("main")
    }
    else{
        loggedUser = null;
        userNavbar.classList.add("hide")
        mainNavbar.classList.remove("hide")

        await render("login")
    }
}


/*------------------*/
getLoggedUser()
loadTheme()