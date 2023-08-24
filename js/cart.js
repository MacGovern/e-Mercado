if(sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";

window.addEventListener("load", () => {
    let email = localStorage.getItem("email");
    let nav = document.querySelector("nav.navbar");
    let navItems = nav.getElementsByClassName("nav-item");
    let ultimoNav = navItems[navItems.length - 1];
    ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;
});