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

    function creditCardSelected() {
        document.getElementById('cardNumber').removeAttribute('disabled');
        document.getElementById('securityCode').removeAttribute('disabled');
        document.getElementById('expirationDate').removeAttribute('disabled');

        document.getElementById('accountNumber').setAttribute('disabled', true);

        document.getElementById('paymentMethod').innerHTML = 'Tarjeta de crédito. <a role="button" href="" data-bs-toggle="modal" data-bs-target="#paymentModal">¿Desea seleccionar otra forma de pago?</a>';
        document.getElementById('accountNumber').value = "";
    }

    function wireTransferSelected() {
        document.getElementById('accountNumber').removeAttribute('disabled');

        document.getElementById('cardNumber').setAttribute('disabled', true);
        document.getElementById('securityCode').setAttribute('disabled', true);
        document.getElementById('expirationDate').setAttribute('disabled', true);

        document.getElementById('paymentMethod').innerHTML = 'Transferencia bancaria. <a role="button" href="" data-bs-toggle="modal" data-bs-target="#paymentModal">¿Desea seleccionar otra forma de pago?</a>';
        document.getElementById('cardNumber').value = "";
        document.getElementById('securityCode').value = "";
        document.getElementById('expirationDate').value = "";
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
                    <h3 class="my-4">Tipo de envío</h3>
                    <form id="purchaseForm" class="needs-validation" novalidate>
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
                    
                        <h3 class="my-4">Dirección de envío</h3>

                        <div class="row">
                            <div class="col-sm-9 col-md-7 col-lg-5 col-xl-4 mb-3">
                                <label class="form-label" for="calle">Calle</label>
                                <input type="text" class="form-control deliveryAddress" id="calle" required/>
                                <div class="invalid-feedback">
                                    Ingresa una calle
                                </div>
                            </div>

                            <div class="col-sm-9 col-md-5 col-lg-4 col-xxl-3 mb-3">
                                <label class="form-label" for="numero">Número</label>
                                <input type="text" class="form-control deliveryAddress" id="numero" required/>
                                <div class="invalid-feedback">
                                    Ingresa un número
                                </div>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-sm-9 col-md-7 col-lg-5 col-xl-4">
                                <label class="form-label" for="esquina">Esquina</label>
                                <input type="text" class="form-control deliveryAddress" id="esquina" required/>
                                <div class="invalid-feedback">
                                    Ingresa una esquina
                                </div>
                            </div>
                        </div>                    
                    
                        <hr class="mt-4">

                        <div id="infoCost">
                            <h3 class="my-4">Costos</h3>

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
                        </div>

                        <hr class="mt-4">
                        
                        <h3 class="my-4">Forma de pago</h3>                    
                        <span id="paymentMethod">No ha seleccionado ninguna forma de pago. <a role="button" href="" data-bs-toggle="modal" data-bs-target="#paymentModal">Seleccione una opción.</a></span>   
                    
                        <!-- Modal -->
                        <div class="modal fade" id="paymentModal" tabindex="-1" role="dialog" aria-labelledby="paymentModalLabel" aria-hidden="true">
                            <div class="modal-dialog" role="document">
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="paymentModalLabel">Forma de Pago</h5>
                                        
                                    </div>
                                    <div class="modal-body">                                        
                                        <div class="form-group">
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault1" onclick="creditCardSelected()">
                                                <label class="form-check-label" for="flexRadioDefault1">
                                                    Tarjeta de crédito
                                                </label>
                                            </div>

                                            <hr>
                                            
                                            <div class="row">
                                                <div class="form-group col-sm-6 col-md-6 ">
                                                    <label for="cardNumber">Número de tarjeta</label>
                                                    <input type="text" id="cardNumber" class="form-control mb-3 validCard " maxlength="16" minlength="16" disabled required>
                                                    <div class="invalid-feedback">
                                                        Ingrese un número de tarjeta válido
                                                    </div>
                                                </div>
                                
                                                <div class="form-group col-sm-4 col-md-4 ">
                                                    <label for="securityCode">Código de seg.</label>
                                                    <input type="text" id="securityCode" class="form-control mb-3 validCard" maxlength="3" minlength="3" disabled required>
                                                    <div class="invalid-feedback">
                                                        Ingrese un código de seguridad válido
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="row">
                                            <div class="form-group col-sm-6 col-md-6 ">
                                                <label for="expirationDate">Vencimiento (MM/AA)</label>
                                                <input type="date" id="expirationDate" class="form-control mb-3 validCard" disabled required>
                                                <div class="invalid-feedback">
                                                    Ingrese una fecha de vencimiento válida
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2" onclick="wireTransferSelected()">
                                            <label class="form-check-label" for="flexRadioDefault2">                                            
                                                Transferencia bancaria
                                            </label>
                                        </div>

                                        <hr>

                                        <div class="row">
                                            <div class="form-group col-sm-6 col-md-6">
                                                <label for="accountNumber">Número de cuenta</label>
                                                <input type="text" id="accountNumber" class="form-control" disabled required>
                                                <div class="invalid-feedback">
                                                    Ingrese un número de cuenta válido
                                                </div>
                                            </div>
                                        </div>                                        
                                    </div>

                                    <div class="modal-footer">                                    
                                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Cerrar</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="invalid-feedback" id="errorMessage"></div>
                        
                        <input type="submit" class="w-100 btn btn-primary btn-lg mt-5" value="Finalizar compra" />
                    </form>
                `;

                displayCosts();

                document.getElementById("purchaseForm").addEventListener("submit", (e) => {
                    e.preventDefault();
                    Array.from(document.getElementsByClassName('deliveryAddress')).forEach(element => {
                        validation (element);
                    });
                         
                    const cardRadio = document.getElementById("flexRadioDefault1");
                    const cardNumber = document.getElementById("cardNumber");
                    const securityCode = document.getElementById("securityCode");
                    const expirationDate = document.getElementById("expirationDate");
                    const transferenceRadio = document.getElementById("flexRadioDefault2");
                    const accountNumber = document.getElementById("accountNumber");
                    const modal = document.getElementById("paymentModal");
                    
                    if (!cardRadio.checked && !transferenceRadio.checked) {
                        document.getElementById("errorMessage").innerHTML = `Debe seleccionar una forma de pago`;
                        modal.classList.add("is-invalid");
                        modal.classList.remove("is-valid");
                    } else {
                        if (cardRadio.checked && (cardNumber.value.length != 16 || securityCode.value.length != 3 || expirationDate.value === "")) {
                            if (cardNumber.value.length != 16) {
                                document.getElementById("errorMessage").innerHTML = `Debe seleccionar un número de tarjeta válido`;
                            } else {
                                if (securityCode.value.length != 3) {
                                    document.getElementById("errorMessage").innerHTML = `Debe seleccionar un código de seguridad válido`;
                                } else {
                                    document.getElementById("errorMessage").innerHTML = `Debe seleccionar una fecha de vencimiento válida`;
                                }
                            }
                            modal.classList.add("is-invalid");
                            modal.classList.remove("is-valid");
                            
                            Array.from(document.getElementsByClassName('validCard')).forEach(element => {
                                validation (element);
                            });
                        } else {
                            if (transferenceRadio.checked && accountNumber.value === "") {
                                document.getElementById("errorMessage").innerHTML = `Debe seleccionar un número de cuenta válido`
                                modal.classList.add("is-invalid");
                                modal.classList.remove("is-valid");
                                validation(accountNumber);
                            } else {
                                modal.classList.remove("is-invalid");
                                modal.classList.add("is-valid");
                                if (cardRadio.checked) {
                                    Array.from(document.getElementsByClassName('validCard')).forEach(element => {
                                        validation (element);
                                    });
                                } else {
                                    if (transferenceRadio.checked) {
                                        validation(accountNumber);
                                    }
                                }
                            }
                        }               
                    }                 
                });
            }
        })
        
        .catch(error => console.error('Error: ', error));
}

function validation (element) { 
    if (!element.checkValidity()) {
        element.classList.add("is-invalid");
        element.classList.remove("is-valid");
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