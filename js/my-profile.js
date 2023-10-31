if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
    function formatContactNumber(element) {
        element.value = element.value.replace(/[^0-9-+ ]/g, ""); // Todo lo que no sea un digito, lo elimina (lo remplaza con un "vacio").
    }

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

    const storedTheme =
        localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    if (storedTheme) {
        document.documentElement.setAttribute("data-theme", storedTheme);
        if (storedTheme === "dark")
        document.getElementById("darkBtn").checked = true;
    }

    document.getElementById("themeBtns").addEventListener("click", (event) => {
        if (event.target.tagName === "INPUT")
        if (event.target.getAttribute("id") === "darkBtn") {
            document.documentElement.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    });

    const profileForm = document.getElementById("profileForm");

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (profileForm.checkValidity()) {
            profileForm.classList.add("was-validated");
            localStorage.setItem("profileData", JSON.stringify({
                email: document.getElementById("readOnlyEmail").value,
                data: {
                    name: document.getElementById("name").value,
                    lastName: document.getElementById("lastName").value,
                    secondName: document.getElementById("secondName").value,
                    secondLastName: document.getElementById("secondLastName").value,
                    contactNumber: document.getElementById("contactNumber").value
                }
            }));
        }
    });
}