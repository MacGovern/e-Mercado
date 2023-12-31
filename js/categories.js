const ORDER_ASC_BY_NAME = "AZ";
const ORDER_DESC_BY_NAME = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
let currentCategoriesArray = [];
let currentSortCriteria = undefined;
let minCount = undefined;
let maxCount = undefined;

function sortCategories(criteria, array) {
    let result = [];
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function (a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html"
}

function showCategoriesList() {
    let htmlContentToAppend = "";
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3 d-flex align-items-center">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col-9">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-body-secondary d-none d-sm-block">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `
        }
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria;

    const elementArray = Array.from(document.getElementById('sortingBtns').children);

    function darkToLight() { // Para cada elemento del arreglo elementArray, si tiene la clase btn-dark, la remplaza por la clase btn-light. btn-dark lo utilizamos como indicador visual para mostrar cuál de los botones de sort está seleccionado. En otras palabras, esta función deselecciona el botón de sort seleccionado.
        elementArray.forEach(element => {
            element.classList.replace('btn-dark', 'btn-light');
        });
    }

    switch (currentSortCriteria) {
        case 'AZ':
            darkToLight();
            elementArray[1].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortAsc" como seleccionado.
            break;
        case 'ZA':
            darkToLight();
            elementArray[3].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortDesc" como seleccionado.
            break;
        case 'Cant.':
            darkToLight();
            elementArray[5].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortByRelevance" como seleccionado.
    }

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showCategoriesList();
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

        getJSONData(CATEGORIES_URL).then(function (resultObj) {
            if (resultObj.status === "ok") {
                currentCategoriesArray = resultObj.data
                //showCategoriesList()
                sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data);
            }
        });

        document.getElementById("sortAsc").addEventListener("click", function () {
            sortAndShowCategories(ORDER_ASC_BY_NAME);
        });

        document.getElementById("sortDesc").addEventListener("click", function () {
            sortAndShowCategories(ORDER_DESC_BY_NAME);
        });

        document.getElementById("sortByCount").addEventListener("click", function () {
            sortAndShowCategories(ORDER_BY_PROD_COUNT);
        });

        document.getElementById("clearRangeFilter").addEventListener("click", function () {
            document.getElementById("rangeFilterCountMin").value = "";
            document.getElementById("rangeFilterCountMax").value = "";

            minCount = undefined;
            maxCount = undefined;

            showCategoriesList();
        });

        document.getElementById("rangeFilterCount").addEventListener("click", function () {
            //Obtengo el mínimo y máximo de los intervalos para filtrar por cantidad
            //de productos por categoría.
            minCount = document.getElementById("rangeFilterCountMin").value;
            maxCount = document.getElementById("rangeFilterCountMax").value;

            if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
                minCount = parseInt(minCount);
            }
            else {
                minCount = undefined;
            }

            if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
                maxCount = parseInt(maxCount);
            }
            else {
                maxCount = undefined;
            }

            showCategoriesList();
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