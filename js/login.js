document.getElementById("login").addEventListener("submit", (e) => {
    const email = document.getElementById("floatingInput").value;
    localStorage.setItem("email", email);
    e.preventDefault();
    sessionStorage.setItem("signedIn", "true");
    window.location.href = "index.html";    
});
