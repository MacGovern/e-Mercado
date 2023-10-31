sessionStorage.removeItem('signedIn');

document.getElementById("login").addEventListener("submit", (e) => {
    localStorage.setItem("email", document.getElementById("floatingInput").value);
    e.preventDefault();
    sessionStorage.setItem("signedIn", "true");
    window.location.href = "index.html";
});

const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

if (storedTheme)
    document.documentElement.setAttribute('data-theme', storedTheme);

fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
    .then(response => response.json())
    .then(userCartFromAPI => {
        const cart = [];
        userCartFromAPI.articles.forEach(article => {
            cart.push({
                id: article.id,
                name: article.name,
                count: article.count,
                unitCost: article.unitCost,
                currency: article.currency,
                image: article.image
            });
        });
        localStorage.setItem('cart', JSON.stringify(cart));
    })
    .catch(error => console.error('Error: ', error));