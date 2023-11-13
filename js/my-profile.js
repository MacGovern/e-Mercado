if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
    const email = localStorage.getItem("email");
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

    function mostrarAlerta() { // Muestra una alerta que indica que los cambios se han guardado con éxito.
        const alerta = document.getElementById('changesSavedAlert');
        alerta.classList.replace('d-none', 'd-block');
        setTimeout(() => alerta.classList.replace('d-block', 'd-none'), 3000);
    }

    function formatContactNumber(element) {
        element.value = element.value.replace(/[^0-9-+() ]/g, ""); // Todo lo que no sea un digito, "+", "-", "(", ")" o un espacio, lo elimina (lo remplaza con un "vacio").
    }

    function validateContactNumber(element) {
        try {
            if (element.value === "" || libphonenumber.isValidNumber(libphonenumber.parse(element.value))) {
                element.classList.remove('is-invalid');
                element.classList.add('is-valid');
            } else {
                element.classList.remove("is-valid");
                element.classList.add("is-invalid");
            }
        } catch (error) {
            console.error("Error: " + error.message);
        }
    }

    function validate(element) { // Si el elemento es valido, se le pone un tick verde (Bootstrap), si no, se visualiza un mensaje de error debajo del input (Bootstrap).
        if (!element.checkValidity()) {
            element.classList.remove("is-valid");
            element.classList.add("is-invalid");
        } else {
            element.classList.remove("is-invalid");
            element.classList.add("is-valid");
        }

        element.addEventListener('input', () => {
            if (!element.checkValidity()) {
                element.classList.add("is-invalid");
                element.classList.remove("is-valid");
            } else {
                element.classList.remove("is-invalid");
                element.classList.add("is-valid");
            }
        });
    };

    document.getElementById('readOnlyEmail').value = email;

    const profileForm = document.getElementById("profileForm");
    const name = document.getElementById("name");
    const lastName = document.getElementById("lastName");
    const secondName = document.getElementById("secondName");
    const secondLastName = document.getElementById("secondLastName");
    const contactNumber = document.getElementById("contactNumber");
    const profilePicture = document.getElementById('profilePicture');
    const fileInput = document.getElementById('fileInput');
    let profilePictureURL = '';
    const profileData = localStorage.getItem(email);

    if (profileData) {
        const profileDataParsed = JSON.parse(profileData);
        if (profileDataParsed.profilePicture !== '') {
            profilePictureURL = profileDataParsed.profilePicture;
            profilePicture.src = profilePictureURL;
        }
        name.value = profileDataParsed.name;
        lastName.value = profileDataParsed.lastName;
        secondName.value = profileDataParsed.secondName;
        secondLastName.value = profileDataParsed.secondLastName;
        contactNumber.value = profileDataParsed.contactNumber;
    };

    profilePicture.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(fileInput.files[0]);
        fileReader.addEventListener('load', () => {
            profilePictureURL = fileReader.result;
            profilePicture.src = profilePictureURL;
        });
    });

    profileForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (profileForm.checkValidity() && (contactNumber.value === "" || libphonenumber.isValidNumber(libphonenumber.parse(contactNumber.value)))) {
            localStorage.setItem(email, JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                secondName: secondName.value,
                secondLastName: secondLastName.value,
                contactNumber: contactNumber.value,
                profilePicture: profilePictureURL
            }));
            mostrarAlerta();
        } else {
            Array.from(document.getElementsByClassName('easy-validation')).forEach(element => validate(element));
            validateContactNumber(contactNumber);
            contactNumber.setAttribute('oninput', 'formatContactNumber(this); validateContactNumber(this)');
        }
    });
}