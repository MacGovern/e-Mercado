if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;

        const commentForm = document.getElementById('commentForm');

        function showProductInfo(productoSeleccionado) { // Función para mostrar la información del producto seleccionado.
            document.getElementById("listaProductos").innerHTML += `
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
                <div class="row mt-3">
                <div class="col-3">
                    <img src="${productoSeleccionado.images[0]}" alt="Imagen 1" class="img-fluid img-thumbnail">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[1]}" alt="Imagen 2" class="img-fluid img-thumbnail">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[2]}" alt="Imagen 3" class="img-fluid img-thumbnail">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[3]}" alt="Imagen 4" class="img-fluid img-thumbnail">
                </div>
                </div>
            `;
        }

        fetch(`https://japceibal.github.io/emercado-api/products/${localStorage.getItem('productID')}.json`)
            .then(response => response.json())
            .then(productoSeleccionado => {
                showProductInfo(productoSeleccionado);
            })

            .catch(error => {
                console.error('Error: ', error);
            });

        function showComments(commentsList) {
            for (const comment of commentsList) {
                let stars = "";
                for (let i = 0; i < comment.score; i++) {
                    stars += `
                        <span class="fa fa-star" style="color: orange;"></span>
                    `
                }
                for (let i = 0; i < 5 - comment.score; i++) {
                    stars += `
                        <span class="unchecked far fa-star"></span>
                    `
                }
                document.getElementById("listaComentarios").innerHTML += `
                    <div class="list-group-item list-group-item-action cursor-active">
                        <div class="row">
                            <div class="col">
                                <div class="d-flex w-100 justify-content-between">
                                    <p class="mb-1"><strong>${comment.user}</strong> - ${comment.dateTime} - ${stars} </p>
                                </div>
                                <p class="mb-1">${comment.description}</p>
                            </div>
                        </div>
                    </div>
                `
            }
        }

        fetch(`https://japceibal.github.io/emercado-api/products_comments/${localStorage.getItem('productID')}.json`)
            .then(response => response.json())
            .then(productComments => {
                showComments(productComments);
            })

            .catch(error => {
                console.error('Error: ', error);
            });

        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const d = new Date();
            const longDateTime = d.toISOString();
            let additionalComments = JSON.parse(localStorage.getItem(localStorage.getItem('productID')));
            if (additionalComments === null)
                additionalComments = [];
            additionalComments.push({
                product: parseInt(localStorage.getItem('productID')),
                score: parseInt(document.querySelector('input[name="commentScore"]:checked').value),
                description: document.getElementById('commentDescription').value,
                user: email,
                dateTime: `${longDateTime.slice(0, 10)} ${longDateTime.slice(11, 19)}`
            });
            commentForm.reset();
            showComments(additionalComments);
            localStorage.setItem(localStorage.getItem('productID'), JSON.stringify(additionalComments));
        })
    });