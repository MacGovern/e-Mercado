const contenido = document.getElementById('products'); // Aquí es donde se insertan los list group items (https://getbootstrap.com/docs/5.3/components/list-group/) correspondientes a los productos de la categoría seleccionada.
const searchBar = document.getElementById('searchBar'); // Barra de búsqueda donde el usuario puede filtrar productos por texto (título y descripción de los productos) en tiempo real.
const sortingBtns = document.getElementById('sortingBtns'); // div que engloba a los botones de sort (inputs y labels).
const elementArray = Array.from(sortingBtns.children); // Arreglo que contiene todos los elementos HTML que se encuentran dentro "sortingBtns".
// Inputs donde el usuario puede filtrar productos por rango de precio al apretar el botón de filtrar.
const minPriceInput = document.getElementById("rangeFilterMin");
const maxPriceInput = document.getElementById("rangeFilterMax");

let productsFilteredByPrice;
let productsFilteredByText;
let productsFilteredByBoth;

let sortingBtn = 'sortByRelevance'; // Sort seleccionado cuando el usuario hace clic en cualquiera de los botones de sort. Inicializado con un sort por relevancia (cantidad de productos vendidos), de mayor a menor.

function changeSortingBtn(newSortingBtn) { // btn-dark lo utilizamos como indicador visual para mostrar cuál de los botones de sort está seleccionado. Esta función marca como deseleccionado al botón de sort que se muestra como seleccionado, y marca un nuevo botón de sort como seleccionado.
  switch (sortingBtn) { // Deselecciona
    case 'sortDescByCost':
      elementArray[1].classList.replace('btn-dark', 'btn-light'); 
      break;
    case 'sortAscByCost':
      elementArray[3].classList.replace('btn-dark', 'btn-light');
      break;
    case 'sortByRelevance':
      elementArray[5].classList.replace('btn-dark', 'btn-light');
  }
  switch (newSortingBtn) { // Selecciona
    case 'sortDescByCost':
      elementArray[1].classList.replace('btn-light', 'btn-dark'); 
      break;
    case 'sortAscByCost':
      elementArray[3].classList.replace('btn-light', 'btn-dark');
      break;
    case 'sortByRelevance':
      elementArray[5].classList.replace('btn-light', 'btn-dark');
  }
  sortingBtn = newSortingBtn; // Actualiza sortingBtn.
}

function applySorting(array) {
  switch (sortingBtn) {
    case 'sortDescByCost':
      array.sort((a, b) => b.cost - a.cost);
      break;
    case 'sortAscByCost':
      array.sort((a, b) => a.cost - b.cost);
      break;
    case 'sortByRelevance':
      array.sort((a, b) => b.soldCount - a.soldCount);
  }
}


function setProductID(id) {
  localStorage.setItem("productID", id);
  window.location = "product-info.html";
}

function showData(dataArray) { // Inserta en "contenido" los productos que se le pasan por parámetro (dataArray).
  contenido.innerHTML = '';
  for (const item of dataArray) {
    contenido.innerHTML += `
            <div onclick="setProductID(${item.id})"class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${item.image}" alt="Imagen del producto" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${item.name} - ${item.currency} ${item.cost}</h4>
                            <small class="text-muted">${item.soldCount} vendidos</small>
                        </div>
                        <p class="mb-1">${item.description}</p>
                    </div>
                </div>
            </div>
        `;
  }
}

function sortAndShowData(array) {
  applySorting(array);
  showData(array);
}

function filterByPrice(array) {
  const minPrice = minPriceInput.valueAsNumber;
  const maxPrice = maxPriceInput.valueAsNumber;
  if (!isNaN(minPrice) && !isNaN(maxPrice)) { // Caso 1: El usario filtra habiendo establecido un mínimo y un máximo.
    return array.filter((product) => {
      return product.cost >= minPrice && product.cost <= maxPrice;
    });
  } else if (!isNaN(maxPrice)) { // Caso 2: El usario filtra habiendo establecido un máximo.
    return array.filter((product) => {
      return product.cost <= maxPrice;
    });
  } else { // Caso 3: El usario filtra habiendo establecido un mínimo.
    return array.filter((product) => {
      return product.cost >= minPrice;
    });
  }
}

function filterByBothAndSortAndShowData() {
  productsFilteredByBoth = filterByPrice(productsFilteredByText);
  sortAndShowData(productsFilteredByBoth);
}

function removeDiacritics(str) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript (primera respuesta).
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

if (sessionStorage.getItem('signedIn') !== 'true') // En caso de que el usuario no esté logueado, te redirige a login.html.
  window.location.href = 'login.html';
else { // Si el usuario está logueado, hace lo siguiente:
  document.addEventListener('DOMContentLoaded', () => {
    // document.querySelector('.navbar-nav').lastElementChild.innerHTML = `<a class="nav-link" href="my-profile.html">${localStorage.getItem("email")}</a>`; // Agrega a la barra de navegación una manera de acceder al perfil del usuario.
    
    let email = localStorage.getItem("email");
    let nav = document.querySelector("nav.navbar");
    let navItems = nav.getElementsByClassName("nav-item");
    let ultimoNav = navItems[navItems.length - 1];
    ultimoNav.innerHTML = `
            <div class="dropdown">
                <button class="nav-link btn btn-dark dropdown-toggle" data-bs-toggle="dropdown" data-bs-auto-close="outside">${email}</button>
                <ul class="dropdown-menu dropdown-menu-dark">
                    <li><a class="dropdown-item" href="#">Mi carrito</a></li>
                    <li><a class="dropdown-item" href="#">Mi perfil</a></li>
                    <li><a class="dropdown-item" href="#">Cerrar sesión</a></li>
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
    
    searchBar.value = '';
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem("catID")}.json`)
      .then((response) => response.json())
      .then((data) => {

        document.getElementById('catName').textContent = data.catName; // "Verás aquí todos los productos de la categoría ${categoría_seleccionada}".

        const productsArray = data.products.sort((a, b) => b.soldCount - a.soldCount); // Productos ordenados por relevancia.
        showData(productsArray);

        function filterByPriceAndSortAndShowData() {
          productsFilteredByPrice = filterByPrice(productsArray);
          sortAndShowData(productsFilteredByPrice);
        }

        sortingBtns.addEventListener('click', (e) => { // Cuando el usuario hace clic en cualquiera de los botones de sort.
          if (e.target.tagName === 'INPUT' && sortingBtn !== e.target.getAttribute('id')) { // Dado que hay varios elementos HTML superpuestos, cuando el usuario hace clic, técnicamente está cliqueando múltiples elementos, por lo que nos quedamos sólo con el input, pues este es el que contiene en su atributo id el tipo de sort que se aplicará. Adicionalmente, sólo se entra al cuerpo del if si el botón de sort que fue cliqueado no es el mismo que ya está marcado como seleccionado. 
            changeSortingBtn(e.target.getAttribute('id'));           
            if (searchBar.value === '') {
              if (minPriceInput.value === '' && maxPriceInput.value === '')// Caso 1: Ningún filtro activo.
                sortAndShowData(productsArray);
              else // Caso 2: Filtro por precio activo.
                sortAndShowData(productsFilteredByPrice);
            } else {
              if (minPriceInput.value === '' && maxPriceInput.value === '') // Caso 3: Filtro de búsqueda por texto activo.
                sortAndShowData(productsFilteredByText);
              else // Caso 4: Ambos filtros activos.
                sortAndShowData(productsFilteredByBoth);
            }
          }
        });

        searchBar.addEventListener('input', () => {
          const searchInput = searchBar.value;

          function filterByText() {
            const text = removeDiacritics(searchInput).toLowerCase();
            return productsArray.filter((product) => {
              const productName = removeDiacritics(product.name).toLowerCase();
              const productDescription = removeDiacritics(product.description).toLowerCase();
              return productName.includes(text) || productDescription.includes(text);
            });
          }

          if (searchInput === '') {
            if (minPriceInput.value === '' && maxPriceInput.value === '') // Caso 1: Ningún filtro activo.
              sortAndShowData(productsArray);
            else // Caso 2: Filtro por precio activo.
              filterByPriceAndSortAndShowData();
          } else {
            if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 3: Filtro de búsqueda por texto activo.
              productsFilteredByText = filterByText();
              sortAndShowData(productsFilteredByText);
            } else { // Caso 4: Ambos filtros activos.
              productsFilteredByText = filterByText();
              filterByBothAndSortAndShowData();
            }
          }
        });

        document.getElementById('clearSearchFilterBtn').addEventListener('click', () => {
          searchBar.value = '';
          if (minPriceInput.value === '' && maxPriceInput.value === '') // Caso 1: Filtro por precio no activo.
            sortAndShowData(productsArray);
          else // Caso 2: Filtro por precio activo.
            filterByPriceAndSortAndShowData();
        });

        document.getElementById("rangeFilterBtn").addEventListener('click', () => {
          const minPrice = minPriceInput.valueAsNumber;
          const maxPrice = maxPriceInput.valueAsNumber;
          // Validación de datos:
          if (isNaN(minPrice) && isNaN(maxPrice))
            alert('Por favor, ingrese valores numéricos.');
          else if (minPrice < 0 || maxPrice < 0)
            alert('Por favor, ingrese valores positivos.');
          else if (minPrice > maxPrice)
            alert('Por favor, ingrese un rango válido.');
          // Si los datos son válidos:
          else if (searchBar.value === '') // Caso 1: Filtro de búsqueda por texto no activo.
            filterByPriceAndSortAndShowData();
          else // Caso 2: Filtro de búsqueda por texto activo.
            filterByBothAndSortAndShowData();
        });

        document.getElementById("clearRangeFilterBtn").addEventListener('click', () => {
          minPriceInput.value = '';
          maxPriceInput.value = '';
          if (searchBar.value === '') // Caso 1: Filtro de búsqueda por texto no activo. 
            sortAndShowData(productsArray);
          else // Caso 2: Filtro de búsqueda por texto activo.
            showData(productsFilteredByText);
        });

      })
      .catch(error => console.error('Error fetching data:', error));
  });
}
