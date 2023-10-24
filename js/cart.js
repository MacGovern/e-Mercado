if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
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

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContent = document.getElementById('cartContent');
    let originalValue;

    //const cartAndCartFromAPI = [...cart];
    //const placeHolder = [];
    //const cartAndCartFromAPI = placeHolder.concat(cart);
    //console.log('cart', cart);
    //console.log('cartAndCartFromAPI', cartAndCartFromAPI);

    async function setConversionRate() {
        const nextUpdate = localStorage.getItem('nextUpdate');

        if (!nextUpdate || new Date() >= new Date(nextUpdate)) {
            try {
                const response = await fetch(`https://v6.exchangerate-api.com/v6/e45807accf924ce9fedaa32e/pair/UYU/USD`);

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                localStorage.setItem('nextUpdate', data.time_next_update_utc);
                localStorage.setItem('conversionRate', data.conversion_rate);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

    setConversionRate();
    const conversionRate = localStorage.getItem('conversionRate') || 0.025;

    function emptyCart() {
        if (cart.length === 0) {
            cartContent.innerHTML = `
                <p class="lead my-4">Actualmente no tiene ningún artículo seleccionado.</p>
            `;
            return true;
        } else
            return false
    }

    function updateOriginalValue(value) {
        originalValue = value;
    }

    function displayCosts() {
        let subtotal = 0;

        cart.forEach(article => {
            if (article.currency === 'UYU')
                subtotal += article.count * article.unitCost * conversionRate;
            else
                subtotal += article.count * article.unitCost;
        });

        const costoEnvio = document.querySelector('input[name="tipoDeEnvio"]:checked').value * subtotal;

        document.getElementById("subtotalCosto").textContent = `${parseFloat(subtotal).toFixed(2)}`;
        document.getElementById("costoEnvio").textContent = `${parseFloat(costoEnvio).toFixed(2)}`;
        document.getElementById("totalCosto").textContent = `${(subtotal + costoEnvio).toFixed(2)}`;
    }

    function updateSubtotal(inputElement, id) { // Función para recalcular el subtotal de un artículo.
        if (inputElement.value < 1)
            inputElement.value = originalValue;
        else {
            const subtotal = document.getElementById(id);
            const value = inputElement.value
            subtotal.textContent = subtotal.getAttribute('data-articleUnitCost') * value;

            let index = 0;

            while (index < cart.length && id !== cart[index].id)
                index++;

            cart[index].count = value;
            localStorage.setItem('cart', JSON.stringify(cart));
            cart = JSON.parse(localStorage.getItem('cart'));
        }

        displayCosts(cart);
    }

    function addToCart(article) {
        let index = 0;

        while (index < cart.length && article.id !== cart[index].id)
            index++;

        if (index >= cart.length) {
            cart.push({
                id: article.id,
                name: article.name,
                count: article.count,
                unitCost: article.unitCost,
                currency: article.currency,
                image: article.image
            });
        } //else {
        //cart[index].count = parseInt(cart[index].count) + article.count;
        //}
        localStorage.setItem('cart', JSON.stringify(cart));
        cart = JSON.parse(localStorage.getItem('cart'));
    }

    function removeFromCart(index, id) {
        //Itera sobre el carrito en el local storage hasta encontrar el producto a eliminar
        let i = 0;
        while (i < cart.length && id !== cart[i].id)
            i++;

        //Elimina el producto del carrito en el local storage
        cart.splice(i, 1);

        //Actualiza el carrito en el localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        cart = JSON.parse(localStorage.getItem('cart'));

        //Si el carrito no esta vacio
        if (!emptyCart()) {
            const element = document.getElementById(index);
            const nextElement = element.nextElementSibling;

            //Si el hr que esta debajo del producto que se va a eliminar, no es el ultimo, se elimina
            if (!nextElement.classList.contains('mb-4'))
                cartContent.removeChild(nextElement);
            //Si no, se elimina el hr que esta encima
            else
                cartContent.removeChild(element.previousElementSibling);

            //Elimina el producto del carrito visual
            cartContent.removeChild(element);

            displayCosts();
        }
    }

    // function addToCart(article) {
    //     let index = 0;

    //     while (index < (JSON.parse(localStorage.getItem('cart') || [])).length && article.id !== (JSON.parse(localStorage.getItem('cart') || []))[index].id)
    //         index++;

    //     if (index < (JSON.parse(localStorage.getItem('cart') || [])).length)
    //     (JSON.parse(localStorage.getItem('cart') || []))[index].count = article.count;
    //     else
    //         (JSON.parse(localStorage.getItem('cart') || [])).push({
    //             id: article.id,
    //             name: article.name,
    //             count: article.count,
    //             unitCost: article.unitCost,
    //             currency: article.currency,
    //             image: article.image
    //         });
    // }

    fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
        .then(response => response.json())
        .then(userCartFromAPI => {
            if (localStorage.getItem('userCartFromAPI_fetchFlag') || true) {
                //console.log('entro. Solo deberia aparecer una vez')
                userCartFromAPI.articles.forEach(article => addToCart(article));
                localStorage.setItem('userCartFromAPI_fetchCounter', false)
            }

            if (!emptyCart()) {
                cartContent.innerHTML = `
                    <h3 class="my-4">Artículos a Comprar</h3>
                    <div class="row d-flex flex-nowrap">
                        <div class="col col-lg-2 me-lg-3 me-xl-4 me-xxl-5" id="colNoImage">
                            <!-- Espacio vacio que se corresponde con la posicion vertical de la imagen del producto -->
                        </div>
                        <div class="col rowNoImage">
                            <strong>Nombre</strong>
                        </div>
                        <div class="col rowNoImage">
                            <strong>Costo</strong>
                        </div>
                        <div class="col rowNoImage">
                            <strong>Cantidad</strong>
                        </div>
                        <div class="col rowNoImage">
                            <strong>Subtotal</strong>
                        </div>
                        <div class="col">
                            <!-- Espacio vacio que se corresponde con el trash can-->
                        </div>
                    </div>

                    <hr style="opacity: 1;">
                `;

                cart.forEach((article, index) => {
                    cartContent.innerHTML += `                        
                        <div class="row d-flex align-items-center flex-nowrap" id="${index}">
                            <div class="col col-lg-2 me-lg-3 me-xl-4 me-xxl-5" id="colImage">
                                <img src="${article.image}" alt="Producto" class="img-thumbnail">
                            </div>
                            <div class="col rowImage">
                                <span>${article.name}</span>
                            </div>
                            <div class="col rowImage">
                                <span>${article.currency} ${article.unitCost}</span>
                            </div>
                            <div class="col rowImage">
                                <input type="number" value="${article.count}" min="1" style="width: 51px;" onclick="updateOriginalValue(this.value)" onchange="updateSubtotal(this, ${article.id})">
                            </div>
                            <div class="col rowImage">
                                <strong> ${article.currency} <span id="${article.id}" data-articleUnitCost="${article.unitCost}">${article.unitCost * article.count}</span></strong>
                            </div>
                            <div class="col">
                                <button class="btn btn-outline-danger" onclick="removeFromCart(${index}, ${article.id})" ><i class="fas fa-trash-alt"></i></button>
                            </div>
                        </div>
                    `;

                    if (index !== cart.length - 1)
                        cartContent.innerHTML += `<hr>`;
                    else
                        cartContent.innerHTML += '<hr style="opacity: 1;" class="mb-4">';
                });

                cartContent.innerHTML += `
                    <hr>

                    <h3 class="my-4">Tipo de envío</h3>

                    <form>
                        <div onchange="displayCosts()">                          
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="premium" name="tipoDeEnvio" value="0.15" checked />
                                <label class="form-check-label" for="premium">Premium - 2 a 5 días (15%)</label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="radio" id="express" name="tipoDeEnvio" value="0.07"/>
                                <label class="form-check-label" for="express">Express - 5 a 8 días (7%)</label>
                            </div>
                            <div class="form-check mb-4">
                                <input class="form-check-input" type="radio" id="standard" name="tipoDeEnvio" value="0.05"/>
                                <label class="form-check-label" for="standard">Standard - 12 a 15 días (5%)</label>
                            </div>
                        </div>
                    
                        <h3 class="mb-3">Dirección de envío</h3>

                        <div class="row">
                            <div class="col-sm-9 col-md-7 col-lg-5 col-xl-4 mb-3">
                                <label class="form-label" for="calle">Calle</label>
                                <input type="text" class="form-control" id="calle" />
                            </div>

                            <div class="col-sm-9 col-md-5 col-lg-4 col-xxl-3 mb-3">
                                <label class="form-label" for="numero">Número</label>
                                <input type="text" class="form-control" id="numero" />
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-9 col-md-7 col-lg-5 col-xl-4 mb-4">
                                <label class="form-label" for="esquina">Esquina</label>
                                <input type="text" class="form-control" id="esquina" />
                            </div>
                        </div>
                    </form>

                    <hr>

                    <div class="mt-4" id="infoCost">
                        <h2 class="mb-4">Costos</h2>

                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="my-2">Subtotal general</h5>
                                <div>
                                    <span>USD</span>
                                    <span id="subtotalCosto"></span>
                                </div>
                            </div>
                        </div>

                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="my-2">Costo de envío</h5>
                                <div>
                                    <span>USD</span>
                                    <span id="costoEnvio"></span>
                                </div>
                            </div>
                        </div>

                        <div class="list-group-item">
                            <div class="d-flex justify-content-between align-items-center">
                                <h5 class="my-2">Total</h5>
                                <div>
                                    <strong>USD</strong>
                                    <strong id="totalCosto"></strong>
                                </div>
                            </div>
                        </div>
                        
                        <hr class="mt-5">
                    </div>
                `;

                displayCosts();
            }
        })
        .catch(error => console.error('Error: ', error));
}