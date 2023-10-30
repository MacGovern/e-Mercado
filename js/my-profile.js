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

    profileContent.innerHTML += ` 
    <form>
        <h3 class="mb-5">Perfil</h3>
        <hr>
        <div class="row">
            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="Name">Primer Nombre*</label>
                    <input type="text" class="form-control" minlength="3" required>
                </div>

                <div class="form-group mb-3">
                    <label for="lastName">Primer Apellido*</label>
                    <input type="text" class="form-control" minlength="3" required>
                </div>

                <div class="form-group mb-5">
                    <label for="exampleInputEmail1" class="form-label">E-mail </label>
                    <input type="email" class="form-control">
                </div>
            </div>

            <div class="col-md-6">
                <div class="form-group mb-3">
                    <label for="secondName">Segundo Nombre</label>
                    <input type="text" class="form-control" minlength="3">
                </div>

                <div class="form-group mb-3">
                    <label for="secondlastName">Segundo Apellido</label>
                    <input type="text" class="form-control" minlength="3">
                </div>

                <div class="form-group mb-5">
                    <label for="telephone">Teléfono de Contacto*</label>
                    <input type="text" class="form-control" maxlength="9" pattern="[0-9]{9}" required>
                </div>
            </div>
        </div>

        <hr>

        <button type="button" class="btn btn-primary mb-3" data-bs-dismiss="modal">Guardar cambios</button>
    </form>
`;
