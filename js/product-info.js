if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
    function resetProductID(id) {
        localStorage.setItem("productID", id);
        window.location.reload(true);
    }

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
                        <div class="my-1 mx-3">
                            <input type="radio" class="btn-check" name="displayMode" id="lightBtn" checked>
                            <label class="btn btn-outline-light me-2" for="lightBtn"><i class="fas fa-sun"></i></label>

                            <input type="radio" class="btn-check" name="displayMode" id="darkBtn">
                            <label class="btn btn-outline-light" for="darkBtn"><i class="fa fa-moon"></i></label>
                        </div>
                    </li>
                </ul>
            </div>
        `;

        const listaComentarios = document.getElementById("listaComentarios");
        const productID = localStorage.getItem('productID');
        const commentForm = document.getElementById('commentForm');
        const additionalComments = JSON.parse(localStorage.getItem(productID)) || [];
        const starContainer = document.getElementById('starBtns');
        const stars = Array.from(starContainer.getElementsByTagName('i'));
        let selectedIndex;

        commentForm.reset();

        function showProductInfo(productoSeleccionado) { // Función para mostrar la información del producto seleccionado.
            document.getElementById("productInfo").innerHTML += `
                <h2 class="mb-5">${productoSeleccionado.name}</h2>
                <hr>
                <h5><strong>Precio</strong></h5>
                <p>${productoSeleccionado.currency} ${productoSeleccionado.cost}</p>
                <h5><strong>Descripción</strong></h5>
                <p>${productoSeleccionado.description}</p>
                <h5><strong>Categoría</strong></h5>
                <p>${productoSeleccionado.category}</p>
                <h5><strong>Cantidad de vendidos</strong></h5>
                <p>${productoSeleccionado.soldCount}</p>
                <h5><strong>Imágenes ilustrativas</strong></h5>
                <div id="carousel" class="carousel slide carousel-dark" data-bs-ride="carousel">
                    <div id="btnIndicator" class="carousel-indicators">
                    </div>
                    <div id="imgCarousel" class="carousel-inner">
                    </div>
                    <button class="carousel-control-prev" type="button" data-bs-target="#carousel" data-bs-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Previous</span>
                    </button>
                    <button class="carousel-control-next" type="button" data-bs-target="#carousel" data-bs-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="visually-hidden">Next</span>
                    </button>
                </div>
            `;
        }

        function showImages(productoSeleccionado) { //Función para mostrar las imágenes en el carrusel.
            let i = 1;
            productoSeleccionado.images.forEach(image => {
                if (i === 1) {
                    document.getElementById("imgCarousel").innerHTML += `
                        <div class="carousel-item active">
                            <img src="${image}" class="d-block w-100" alt="Imagen ${i}">
                        </div>
                    `;
                    document.getElementById("btnIndicator").innerHTML += `
                        <button type="button" data-bs-target="#carousel" data-bs-slide-to="${i-1}" class="active" aria-current="true" aria-label="Slide ${i}"></button>
                    `;  
                } else { 
                    document.getElementById("imgCarousel").innerHTML += `
                        <div class="carousel-item">
                            <img src="${image}" class="d-block w-100" alt="Imagen ${i}">
                        </div>
                    `;
                    document.getElementById("btnIndicator").innerHTML += `
                    <button type="button" data-bs-target="#carousel" data-bs-slide-to="${i-1}" aria-label="Slide ${i}"></button>
                    `; 
                }
                i++;
            });
        }

        function showRelatedProducts(productoSeleccionado) { // Función para mostrar los productos relacionados.
            productoSeleccionado.relatedProducts.forEach(relatedProduct => {
                document.getElementById("relatedProducts").innerHTML += `
                    <div class="mt-3 col-4">
                        <div onclick="resetProductID(${relatedProduct.id})" class="card mb-2 shadow-sm custom-card cursor-active">
                            <img src="${relatedProduct.image}"
                                alt="Imagen representativa del producto relacionado" class="m-2">
                            <h6 class="mt-1 mb-3 text-center">${relatedProduct.name}</h6>
                        </div>
                    </div>
                `;
            });
        }

        function showComment(comment) { // Función para mostrar un comentario del producto seleccionado.
            let stars = "";
            for (let i = 1; i <= comment.score; i++)
                stars += `<i class="checked fas fa-star"></i>`; // Estrella checked.
            for (let i = 1; i <= 5 - comment.score; i++)
                stars += `<i class="far fa-star"></i>`; // Estrella unchecked.
            listaComentarios.innerHTML += `
                    <div class="list-group-item list-group-item-action">
                        <p class="mb-1"><strong>${comment.user}</strong> - ${comment.dateTime} - ${stars}</p>
                        <p class="mb-1">${comment.description}</p>
                    </div>
            `;
        }

        function showComments(commentsList) { // Función para mostrar los comentarios del producto seleccionado.
            commentsList.forEach(comment => {
                showComment(comment);
            });
        }

        fetch(`https://japceibal.github.io/emercado-api/products/${productID}.json`)
            .then(response => response.json())
            .then(productoSeleccionado => {
                showProductInfo(productoSeleccionado)
                showImages(productoSeleccionado)
                showRelatedProducts(productoSeleccionado)
            })
            .catch(error => console.error('Error: ', error));

        fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
            .then(response => response.json())
            .then(productComments => {
                showComments(productComments);
                showComments(additionalComments);
            })
            .catch(error => console.error('Error: ', error));

        starContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'I') {
                selectedIndex = stars.indexOf(e.target);
                if (selectedIndex % 2 === 1) // Estrella checked seleccionada
                    for (let i = selectedIndex + 1; i < stars.length; i += 2) {
                        stars[i].style.display = 'inline-block'; // Muestra estrella unchecked
                        stars[i + 1].style.display = 'none'; // Oculta estrella checked
                    }
                else // Estrella unchecked seleccionada
                    for (let i = 0; i <= selectedIndex; i += 2) {
                        stars[i].style.display = 'none'; // Oculta estrella unchecked
                        stars[i + 1].style.display = 'inline-block'; // Muestra estrella checked
                    }
            }
        });

        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const longDateTime = (new Date()).toISOString();
            const comment = {
                product: parseInt(productID),
                score: parseInt(document.querySelector('input[name="selectedScore"]:checked').value),
                description: document.getElementById('commentDescription').value,
                user: email,
                dateTime: `${longDateTime.slice(0, 10)} ${longDateTime.slice(11, 19)}`
            }
            additionalComments.push(comment);
            commentForm.reset();
            for (let i = 0; i <= selectedIndex; i += 2) { // Resetea las estrellas
                stars[i].style.display = 'inline-block'; // Muestra estrella unchecked
                stars[i + 1].style.display = 'none'; // Oculta estrella checked
            }
            showComment(comment);
            localStorage.setItem(productID, JSON.stringify(additionalComments));
        });
    });
}