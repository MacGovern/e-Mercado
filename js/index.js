if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", function () {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `
            <div class="dropdown">
                <button class="nav-link btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">${email}</button>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="#">Mi carrito</a></li>
                    <li><a class="dropdown-item" href="#">Mi perfil</a></li>
                    <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
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
        document.getElementById("autos").addEventListener("click", function () {
            localStorage.setItem("catID", 101);
            window.location = "products.html"
        });
        document.getElementById("juguetes").addEventListener("click", function () {
            localStorage.setItem("catID", 102);
            window.location = "products.html"
        });
        document.getElementById("muebles").addEventListener("click", function () {
            localStorage.setItem("catID", 103);
            window.location = "products.html"
        });

        const storedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        if (storedTheme === "dark") {
            document.documentElement.setAttribute('data-theme', "dark");
            document.getElementById("darkBtn").setAttribute("checked", true);
            document.getElementById("lightBtn").setAttribute("checked", false);
        }
        document.getElementById("themeBtns").addEventListener('click', (event) => {
            if (event.target.tagName === 'INPUT');
            if (event.target.getAttribute("id") === "darkBtn") {
                document.documentElement.setAttribute('data-theme', "dark");
                localStorage.setItem('theme', "dark");
            } else {
                document.documentElement.removeAttribute("data-theme");
                localStorage.removeItem("theme");
            }
        });

    });


