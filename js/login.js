sessionStorage.removeItem('signedIn');

document.getElementById("login").addEventListener("submit", (e) => {
    localStorage.setItem("email", document.getElementById("floatingInput").value);
    e.preventDefault();
    sessionStorage.setItem("signedIn", "true");
    window.location.href = "index.html";    
});
