if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;


        const starContainer = document.getElementById('starBtns');
        const stars = Array.from(starContainer.getElementsByTagName('i'));
        let selectedIndex;
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
        // Empezamos con un puntaje seleccionado inicial de 0.
        let selectedScore = 0;

        stars.forEach((star, index) => {
            star.addEventListener('click', () => {
                if (selectedScore === index + 1) { // Si el puntaje seleccionado es igual al índice de la estrella + 1.
                    selectedScore = 0;   // Reinicia el puntaje seleccionado a 0.
                } else {
                    selectedScore = index + 1; // Establece el puntaje seleccionado como el índice de la estrella + 1.

                }

                stars.forEach((star, i) => {
                    if (i < selectedScore) { // Si el índice de la estrella actual es menor que el puntaje seleccionado, Cambia la clase de la estrella para mostrarla como llena.
                        star.classList.remove('far');
                        star.classList.add('fas');
                        star.style.color = 'orange';// Establece el color de la estrella en naranja.

                    } else { // Cambia la clase de la estrella para mostrarla como vacía
                        star.classList.remove('fas');
                        star.classList.add('far');
                        star.style.color = ''; // Restablece el color de la estrella a su valor predeterminado.
                    }
                });
                // actualizamos el valor del elemento HTML 'selectedScore' con el puntaje seleccionado.
                const selectedScoreInput = document.getElementById('selectedScore');
                if (selectedScoreInput) {
                    selectedScoreInput.value = selectedScore;
                }
            });

        });
        starContainer.addEventListener('mouseover', (e) => {
            selectedIndex = stars.indexOf(e.target);
            for (let i = 0; i <= selectedIndex; i += 2) {
                stars[i].style.display = 'none'; // Oculta estrella unchecked
                stars[i + 1].style.display = 'inline-block'; // Muestra estrella checked
            }
        });

        starContainer.addEventListener('mouseout', () => {
            for (let i = 0; i <= selectedIndex; i += 2) {
                stars[i].style.display = 'inline-block'; // Muestra estrella unchecked
                stars[i + 1].style.display = 'none'; // Oculta estrella checked
            }
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
            // La siguiente linea esta comentada porque, hasta que showComments() no exista, las demas lineas posteriores a la invocacion de la funcion no se ejecutaran.
            // showComments(additionalComments);
        });
    });