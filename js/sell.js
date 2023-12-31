let productCost = 0;
let productCount = 0;
let comissionPercentage = 0.13;
let MONEY_SYMBOL = "$";
let DOLLAR_CURRENCY = "Dólares (USD)";
let PESO_CURRENCY = "Pesos Uruguayos (UYU)";
let DOLLAR_SYMBOL = "USD ";
let PESO_SYMBOL = "UYU ";
let PERCENTAGE_SYMBOL = '%';
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA";

//Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts() {
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    let unitCostToShow = MONEY_SYMBOL + productCost;
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL;
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
    document.addEventListener("DOMContentLoaded", function (e) {
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

        document.getElementById("productCountInput").addEventListener("change", function () {
            productCount = this.value;
            updateTotalCosts();
        });

        document.getElementById("productCostInput").addEventListener("change", function () {
            productCost = this.value;
            updateTotalCosts();
        });

        document.getElementById("goldradio").addEventListener("change", function () {
            comissionPercentage = 0.13;
            updateTotalCosts();
        });

        document.getElementById("premiumradio").addEventListener("change", function () {
            comissionPercentage = 0.07;
            updateTotalCosts();
        });

        document.getElementById("standardradio").addEventListener("change", function () {
            comissionPercentage = 0.03;
            updateTotalCosts();
        });

        document.getElementById("productCurrency").addEventListener("change", function () {
            if (this.value == DOLLAR_CURRENCY) {
                MONEY_SYMBOL = DOLLAR_SYMBOL;
            }
            else if (this.value == PESO_CURRENCY) {
                MONEY_SYMBOL = PESO_SYMBOL;
            }

            updateTotalCosts();
        });


        //Configuraciones para el elemento que sube archivos
        let dzoptions = {
            url: "/",
            autoQueue: false
        };
        let myDropzone = new Dropzone("div#file-upload", dzoptions);


        //Se obtiene el formulario de publicación de producto
        let sellForm = document.getElementById("sell-info");

        //Se agrega una escucha en el evento 'submit' que será
        //lanzado por el formulario cuando se seleccione 'Vender'.
        sellForm.addEventListener("submit", function (e) {

            e.preventDefault();
            e.preventDefault();

            let productNameInput = document.getElementById("productName");
            let productCategory = document.getElementById("productCategory");
            let productCost = document.getElementById("productCostInput");
            let infoMissing = false;

            //Quito las clases que marcan como inválidos
            productNameInput.classList.remove('is-invalid');
            productCategory.classList.remove('is-invalid');
            productCost.classList.remove('is-invalid');

            //Se realizan los controles necesarios,
            //En este caso se controla que se haya ingresado el nombre y categoría.
            //Consulto por el nombre del producto
            if (productNameInput.value === "") {
                productNameInput.classList.add('is-invalid');
                infoMissing = true;
            }

            //Consulto por la categoría del producto
            if (productCategory.value === "") {
                productCategory.classList.add('is-invalid');
                infoMissing = true;
            }

            //Consulto por el costo
            if (productCost.value <= 0) {
                productCost.classList.add('is-invalid');
                infoMissing = true;
            }

            if (!infoMissing) {
                //Aquí ingresa si pasó los controles, irá a enviar
                //la solicitud para crear la publicación.

                getJSONData(PUBLISH_PRODUCT_URL).then(function (resultObj) {
                    let msgToShowHTML = document.getElementById("resultSpan");
                    let msgToShow = "";

                    //Si la publicación fue exitosa, devolverá mensaje de éxito,
                    //de lo contrario, devolverá mensaje de error.
                    //FUNCIONALIDAD NO IMPLEMENTADA
                    if (resultObj.status === 'ok') {
                        msgToShow = MSG;
                        document.getElementById("alertResult").classList.add('alert-primary');
                    }
                    else if (resultObj.status === 'error') {
                        msgToShow = MSG;
                        document.getElementById("alertResult").classList.add('alert-primary');
                    }

                    msgToShowHTML.innerHTML = msgToShow;
                    document.getElementById("alertResult").classList.add("show");
                });
            }
        });

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
}