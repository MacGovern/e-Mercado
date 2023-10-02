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
                <button class="btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">${email}</button>
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

