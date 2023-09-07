if(sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else
    document.addEventListener("DOMContentLoaded", () => {
        let email = localStorage.getItem("email");
        let nav = document.querySelector("nav.navbar");
        let navItems = nav.getElementsByClassName("nav-item");
        let ultimoNav = navItems[navItems.length - 1];
        ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;
    
        function showProductsInfo(productoSeleccionado) { //función para mostrar la información de los productos.
            const divcont = document.getElementById("listaProductos");
            divcont.innerHTML += `
            <h2>${productoSeleccionado.name}</h2>
                <hr>
            <h5>Precio</h5>
                <p>${productoSeleccionado.cost}</p>
            <h5>Descripción</h5>
                <p>${productoSeleccionado.description}</p>
            <h5>Categoría</h5>
                <p>${productoSeleccionado.category}</p>
            <h5>Cantidad de vendidos</h5>
                <p>${productoSeleccionado.soldCount}</p>
            <h5>Imágenes ilustrativas</h5>
            <div class="row">
                <div class="col-3">
                    <img src="${productoSeleccionado.images[0]}" alt="Imagen 1" class="img-fluid">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[1]}" alt="Imagen 2" class="img-fluid">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[2]}" alt="Imagen 3" class="img-fluid">
                </div>
                <div class="col-3">
                    <img src="${productoSeleccionado.images[3]}" alt="Imagen 4" class="img-fluid">
                </div>
            </div>
                `;
        }

        fetch(`https://japceibal.github.io/emercado-api/products/${localStorage.getItem('productID')}.json`)
            .then(response => response.json())
            .then(productoSeleccionado => {
                showProductsInfo(productoSeleccionado);
            })

            .catch(error => {
                console.error('Error: ', error);
            });

    });
