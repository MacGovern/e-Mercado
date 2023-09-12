if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;

        const listaComentarios = document.getElementById("listaComentarios");
        const productID = localStorage.getItem('productID');
        const commentForm = document.getElementById('commentForm');
        let additionalComments = JSON.parse(localStorage.getItem(productID));
        const starContainer = document.getElementById('starBtns');
        const stars = Array.from(starContainer.getElementsByTagName('i'));
        let selectedIndex;

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
            .then(productoSeleccionado => showProductInfo(productoSeleccionado))
            .catch(error => console.error('Error: ', error));

        fetch(`https://japceibal.github.io/emercado-api/products_comments/${productID}.json`)
            .then(response => response.json())
            .then(productComments => {
                showComments(productComments);
                if (additionalComments !== null)
                    showComments(additionalComments);
                else
                    additionalComments = [];
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
            const d = new Date();
            const longDateTime = d.toISOString();
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
        })
    });