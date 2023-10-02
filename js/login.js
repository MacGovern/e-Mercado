document.getElementById("login").addEventListener("submit", (e) => {
    localStorage.setItem("email", document.getElementById("floatingInput").value);
    e.preventDefault();
    sessionStorage.setItem("signedIn", "true");
    window.location.href = "index.html";
});

const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme);