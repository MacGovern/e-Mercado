if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `
            <div class="dropdown">
                <button class="nav-link btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">${email}</button>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
                    <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
                    <li><a class="dropdown-item" href="login.html">Cerrar sesión</a></li>
                    <li>
                        <div id="themeBtns" class="my-1 mx-3">
                            <input type="radio" class="btn-check" name="displayMode" id="lightBtn" checked>
                            <label class="btn btn-outline-light me-2" for="lightBtn"><i class="fas fa-sun"></i></label>

                            <input type="radio" class="btn-check" name="displayMode" id="darkBtn">
                            <label class="btn btn-outline-light" for="darkBtn"><i class="fa fa-moon"></i></label>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

        if (storedTheme) {
            document.documentElement.setAttribute('data-theme', storedTheme);
            if (storedTheme === "dark")
                document.getElementById("darkBtn").checked = true;
        }

        document.getElementById("themeBtns").addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT')
                if (event.target.getAttribute("id") === "darkBtn") {
                    document.documentElement.setAttribute('data-theme', "dark");
                    localStorage.setItem('theme', "dark");
                } else {
                    document.documentElement.setAttribute("data-theme", "light");
                    localStorage.setItem('theme', "light");
                }
        });
    });


    document.addEventListener('DOMContentLoaded', function() {
        fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
          .then(response => response.json())
          .then(cart => {
            console.log(cart);
            const cartContainer = document.getElementById('cart-container');
      
            cart.articles.forEach(article => {
                const articleHTML = `
                <div class="row">
                <div class="col-md-2"></div>
                <div class="col-md-2"><strong>Nombre</strong></div>
                <div class="col-md-2"><strong>Costo</strong></div>
                <div class="col-md-2"><strong>Cantidad</strong></div>
                <div class="col-md-2"><strong>Subtotal</strong></div>
            </div>
            <hr class="bg-black mb-2 my-2">
            
            <div class="row">
                <div class="col-md-2">
                    <img src="${article.image}" alt="Producto" class="img-thumbnail">
                </div>
                <div class="col-md-2 mt-3">
                    <p>${article.name}</p>
                </div>
                <div class="col-md-2 mt-3">
                    <p>${article.currency} ${article.unitCost}</p>
                </div>
                <div class="col-md-2 mt-3">
                <input type="number" id="cantidad-${article.id}" value="${article.count}" min="1">
                </div>
                <div class="col-md-2 mt-3">
                    <strong>  ${article.currency} ${article.unitCost * article.count}</strong>
                </div>
            </div>
            <hr class="bg-black my-4">
            
            
                `;
              cartContainer.innerHTML += articleHTML;
            });
          })
          .catch(error => console.error('Error: ', error));
      });
      