const contenido = document.querySelector('#products');
const searchBar = document.querySelector('#searchBar');
const btnClearSearch = document.querySelector('#clearSearchFilter');
const btnRangePriceFilter = document.getElementById("rangeFilterCount");
const btnClearPriceFilter = document.getElementById("clearRangeFilter");
const minPriceInput = document.getElementById("rangeFilterCountMin");
const maxPriceInput = document.getElementById("rangeFilterCountMax");

let productsFilteredByPrice = [];

function showData(dataArray) {
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

function removeDiacritics(str) {
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
  if (!isNaN(minPrice) && !isNaN(maxPrice)) {
    return array.filter((product) => {
      return product.cost >= minPrice && product.cost <= maxPrice;
    });
  } else if (!isNaN(maxPrice)) {
    return array.filter((product) => {
      return product.cost <= maxPrice;
    });
  } else {
    return array.filter((product) => {
      return product.cost >= minPrice;
    });
  }
}

if (sessionStorage.getItem('signedIn') !== 'true')
  window.location.href = 'login.html';
else {
  searchBar.value = '';
  document.addEventListener('DOMContentLoaded', () => {
    const storedCatID = localStorage.getItem("catID");
    const DATA_URL = `https://japceibal.github.io/emercado-api/cats_products/${storedCatID}.json`;
    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        document.querySelector('#catName').textContent = data.catName;
        let productsArray = data.products;
        showData(productsArray);

        searchBar.addEventListener('input', (e) => {
          const searchInput = e.target.value;
          if (searchInput === '') {
            if (productsFilteredByPrice.length === 0)
              showData(productsArray);
            else {
              productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              showData(productsFilteredByPrice);
            }
          } else {
            if (productsFilteredByPrice.length === 0)
              showData(filterByText(productsArray, searchInput));
            else {
              productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              showData(filterByText(productsFilteredByPrice, searchInput));
            }
          }
        });

        btnClearSearch.addEventListener('click', () => {
          searchBar.value = '';
          if (productsFilteredByPrice.length === 0)
            showData(productsArray);
          else {
            productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
            showData(productsFilteredByPrice);
          }
        });

        btnRangePriceFilter.addEventListener('click', () => {
          const minPrice = minPriceInput.valueAsNumber;
          const maxPrice = maxPriceInput.valueAsNumber;
          if ((isNaN(minPrice) || minPrice < 0) && (isNaN(maxPrice) || maxPrice < 0))
            alert('Por favor ingrese valores válidos.');
          else if (searchBar.value === '') {
            productsFilteredByPrice = filterByPrice(productsArray, minPrice, maxPrice);
            showData(productsFilteredByPrice);
          } else {
            productsFilteredByPrice = filterByPrice(filterByText(productsArray, searchBar.value), minPrice, maxPrice);
            showData(productsFilteredByPrice);
          }
        });

        btnClearPriceFilter.addEventListener('click', () => {
          minPriceInput.value = '';
          maxPriceInput.value = '';
          productsFilteredByPrice = [];
          if (searchBar.value === '')
            showData(productsArray);
          else
            showData(filterByText(productsArray, searchBar.value));
        });

      })
      .catch(error => console.error('Error fetching data:', error));
  });
}

window.addEventListener("load", () => {
  let email = localStorage.getItem("email");
  let nav = document.querySelector("nav.navbar");
  let navItems = nav.getElementsByClassName("nav-item");
  let ultimoNav = navItems[navItems.length - 1];
  ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;
});