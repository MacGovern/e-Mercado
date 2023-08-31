const contenido = document.getElementById('products'); // Aquí es donde se insertan los list group items (https://getbootstrap.com/docs/5.3/components/list-group/) correspondientes a los productos de la categoría seleccionada.
const searchBar = document.getElementById('searchBar'); // Barra de búsqueda donde el usuario puede filtrar productos por texto (título y descripción de los productos) en tiempo real.
const sortingBtns = document.getElementById('sortingBtns'); // div que engloba a los botones de sort (inputs y labels).
// Inputs donde el usuario puede filtrar productos por rango de precio al apretar el botón de filtrar.
const minPriceInput = document.getElementById("rangeFilterMin");
const maxPriceInput = document.getElementById("rangeFilterMax");

let productsFilteredByPrice;
let productsFilteredByText;
let productsFilteredByBoth;

let sortingBtn = 'sortByRelevance'; // Sort seleccionado cuando el usuario hace clic en cualquiera de los botones de sort. Inicializado con un sort por relevancia (cantidad de productos vendidos), de mayor a menor.

function showData(dataArray) { // Inserta en "contenido" los productos que se le pasan por parámetro (dataArray).
  contenido.innerHTML = '';
  for (const item of dataArray) {
    contenido.innerHTML += `
            <div class="list-group-item list-group-item-action cursor-active">
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

function removeDiacritics(str) { // https://stackoverflow.com/questions/990904/remove-accents-diacritics-in-a-string-in-javascript (primera respuesta).
  return str.normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

function filterByText(array, text) {
  const searchInput = removeDiacritics(text).toLowerCase();
  return array.filter((product) => {
    const productName = removeDiacritics(product.name).toLowerCase();
    const productDescription = removeDiacritics(product.description).toLowerCase();
    return productName.includes(searchInput) || productDescription.includes(searchInput);
  });
}

function filterByPrice(array, minPrice, maxPrice) {
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

function applySorting(array, sortFunction) {
  switch (sortFunction) {
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

if (sessionStorage.getItem('signedIn') !== 'true') // En caso de que el usuario no esté logueado, te redirige a login.html.
  window.location.href = 'login.html';
else { // Si el usuario está logueado, hace lo siguiente:

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.navbar-nav').lastElementChild.innerHTML = `<a class="nav-link" href="my-profile.html">${localStorage.getItem("email")}</a>`; // Agrega a la barra de navegación una manera de acceder al perfil del usuario.
    searchBar.value = '';
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem("catID")}.json`)
      .then((response) => response.json())
      .then((data) => {

        document.getElementById('catName').textContent = data.catName; // "Verás aquí todos los productos de la categoría ${categoría_seleccionada}".

        const productsArray = data.products.sort((a, b) => b.soldCount - a.soldCount); // Productos ordenados por relevancia.
        showData(productsArray);

        function sortAndShowData(sortingBtn) {
          if (searchBar.value === '') {
            if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 1: Ningún filtro activo.
              applySorting(productsArray, sortingBtn);
              showData(productsArray);
            } else { // Caso 2: Filtro por precio activo.
              applySorting(productsFilteredByPrice, sortingBtn);
              showData(productsFilteredByPrice);
            }
          } else {
            if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 3: Filtro de búsqueda por texto activo.
              applySorting(productsFilteredByText, sortingBtn);
              showData(productsFilteredByText);
            } else { // Caso 4: Ambos filtros activos.
              applySorting(productsFilteredByBoth, sortingBtn);
              showData(productsFilteredByBoth);
            }
          }
        }

        sortingBtns.addEventListener('click', (e) => { // Cuando el usuario hace clic en cualquiera de los botones de sort.
          if (e.target.tagName === 'INPUT') { // Dado que hay varios elementos HTML superpuestos, cuando el usuario hace clic, técnicamente está cliqueando múltiples elementos, por lo que nos quedamos sólo con el input, pues este es el que contiene en su atributo id el tipo de sort que se aplicará.
            sortingBtn = e.target.getAttribute('id');
            const elementArray = Array.from(sortingBtns.children); // Arreglo que contiene todos los elementos HTML que se encuentran dentro "sortingBtns".

            function darkToLight() { // Para cada elemento del arreglo elementArray, si tiene la clase btn-dark, la remplaza por la clase btn-light. btn-dark lo utilizamos como indicador visual para mostrar cuál de los botones de sort está seleccionado. En otras palabras, esta función deselecciona el botón de sort seleccionado.
              elementArray.forEach(element => {
                element.classList.replace('btn-dark', 'btn-light');
              });
            }

            switch (sortingBtn) {
              case 'sortDescByCost':
                darkToLight();
                elementArray[1].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortDescByCost" como seleccionado.
                sortAndShowData(sortingBtn);
                break;
              case 'sortAscByCost':
                darkToLight();
                elementArray[3].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortAscByCost" como seleccionado.
                sortAndShowData(sortingBtn);
                break;
              case 'sortByRelevance':
                darkToLight();
                elementArray[5].classList.replace('btn-light', 'btn-dark'); // Marca el botón de sort "sortByRelevance" como seleccionado.
                sortAndShowData(sortingBtn);
            }
          }
        })

        searchBar.addEventListener('input', (e) => {
          const searchInput = e.target.value;
          if (searchInput === '') {
            if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 1: Ningún filtro activo.
              applySorting(productsArray, sortingBtn);
              showData(productsArray);
            } else { // Caso 2: Filtro por precio activo.
              productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              applySorting(productsFilteredByPrice, sortingBtn);
              showData(productsFilteredByPrice);
            }
          } else {
            if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 3: Filtro de búsqueda por texto activo.
              productsFilteredByText = filterByText(productsArray, searchInput);
              applySorting(productsFilteredByText, sortingBtn);
              showData(productsFilteredByText);
            } else { // Caso 4: Ambos filtros activos.
              productsFilteredByText = filterByText(productsArray, searchInput);
              productsFilteredByBoth = filterByPrice(productsFilteredByText, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              applySorting(productsFilteredByBoth, sortingBtn);
              showData(productsFilteredByBoth);
            }
          }
        });

        document.getElementById('clearSearchFilterBtn').addEventListener('click', () => {
          searchBar.value = '';
          if (minPriceInput.value === '' && maxPriceInput.value === '') { // Caso 1: Filtro por precio no activo.
            applySorting(productsArray, sortingBtn);
            showData(productsArray);
          } else { // Caso 2: Filtro por precio activo.
            productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
            applySorting(productsFilteredByPrice, sortingBtn);
            showData(productsFilteredByPrice);
          }
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
          else if (searchBar.value === '') { // Caso 1: Filtro de búsqueda por texto no activo.
            productsFilteredByPrice = filterByPrice(productsArray, minPrice, maxPrice);
            applySorting(productsFilteredByPrice, sortingBtn);
            showData(productsFilteredByPrice);
          } else { // Caso 2: Filtro de búsqueda por texto activo.
            productsFilteredByBoth = filterByPrice(productsFilteredByText, minPrice, maxPrice);
            applySorting(productsFilteredByBoth, sortingBtn);
            showData(productsFilteredByBoth);
          }
        });

        document.getElementById("clearRangeFilterBtn").addEventListener('click', () => {
          minPriceInput.value = '';
          maxPriceInput.value = '';
          if (searchBar.value === '') { // Caso 1: Filtro de búsqueda por texto no activo. 
            applySorting(productsArray, sortingBtn);
            showData(productsArray);
          } else // Caso 2: Filtro de búsqueda por texto activo.
            showData(productsFilteredByText);
        });

      })
      .catch(error => console.error('Error fetching data:', error));
  });
}