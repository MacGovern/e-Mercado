document.getElementById("login").addEventListener("submit", (e) => {
    e.preventDefault();
    sessionStorage.setItem("signedIn", "true");
    window.location.href = "index.html";    
});