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

        fetch(`https://japceibal.github.io/emercado-api/user_cart/25801.json`)
            .then(response => response.json())
            .then(cart => {
                if (cart.articles.length === 0)
                    document.getElementById('cartContent').innerHTML += `
                        <p class="lead my-4">Actualmente no tiene ningún artículo seleccionado.</p>
                    `;
                else {
                    const cartContent = document.getElementById('cartContent');
                    cartContent.innerHTML += `
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
                        </div>
                        <hr style="opacity: 1;">
                    `;
                    cart.articles.forEach((article, index) => {
                        cartContent.innerHTML += `                        
                            <div class="row d-flex align-items-center flex-nowrap">
                                <div class="col col-lg-2 me-lg-3 me-xl-4 me-xxl-5" id="colImage">
                                    <img src="${article.image}" alt="Producto" class="img-thumbnail">
                                </div>
                                <div class="col rowImage">
                                    <span>${article.name}</span>
                                </div>
                                <div class="col rowImage">
                                    <span id="currency-${article.id}">${article.currency}</span> <span id="unitCost-${article.id}">${article.unitCost}</span>
                                </div>
                                <div class="col rowImage">
                                    <input id="inputCount-${article.id}" type="number" data-articleID ="${article.id}" value="${article.count}" min="1" style="width: 51px;" oninput="subtotalArticle(${article.id})">
                                </div>
                                <div id="subtotal-${article.id}" class="col rowImage">
                                    <strong data-articleID ="${article.id}"> ${article.currency} ${article.unitCost * article.count}</strong>
                                </div>
                            </div>
                        `;
                        if (index !== cart.articles.length - 1)
                            cartContent.innerHTML += '<hr>';
                        else
                            cartContent.innerHTML += '<hr style="opacity: 1;" class="mb-4">';
                    });
                    cartContent.innerHTML += `
                        <hr>
                        <h3 class="my-4">Tipo de envío</h3>
                        <form>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" id="premium" name="tipoDeEnvio" checked />
                            <label class="form-check-label" for="premium">Premium - 2 a 5 días (15%)</label>
                          </div>
                          <div class="form-check">
                            <input class="form-check-input" type="radio" id="express" name="tipoDeEnvio" />
                            <label class="form-check-label" for="express">Express - 5 a 8 días (7%)</label>
                          </div>
                          <div class="form-check mb-4">
                            <input class="form-check-input" type="radio" id="standard" name="tipoDeEnvio" />
                            <label class="form-check-label" for="standard">Standard - 12 a 15 días (5%)</label>
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
                        `;
                }
            })
            .catch(error => console.error('Error: ', error));
    });


    function subtotalArticle(articleId){ // Función para calcular el subtotal de un artículo
        let count = document.getElementById("inputCount-" + articleId).value; 
        let currency = document.getElementById("currency-" + articleId).innerHTML;
        let unitCost = document.getElementById("unitCost-" + articleId).innerHTML;
        document.getElementById("subtotal-" + articleId).innerHTML = `
        <strong data-articleID ="${articleId}"> ${currency} ${parseInt(count) * parseFloat(unitCost)}</strong>
        `
    };