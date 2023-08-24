if(sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else{
    document.addEventListener("DOMContentLoaded", function(){
        document.getElementById("autos").addEventListener("click", function() {
            localStorage.setItem("catID", 101);
            window.location = "products.html"
        });
        document.getElementById("juguetes").addEventListener("click", function() {
            localStorage.setItem("catID", 102);
            window.location = "products.html"
        });
        document.getElementById("muebles").addEventListener("click", function() {
            localStorage.setItem("catID", 103);
            window.location = "products.html"
        });
    });
}

window.addEventListener("load", () => {
  let email = localStorage.getItem("email");
  let nav = document.querySelector("nav.navbar");
  let navItems = nav.getElementsByClassName("nav-item");
  let ultimoNav = navItems[navItems.length - 1];
  ultimoNav.textContent = email;
});
