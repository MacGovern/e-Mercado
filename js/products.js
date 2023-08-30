const contenido = document.querySelector('#products');
const searchBar = document.querySelector('#searchBar');
const btnClearSearch = document.querySelector('#clearSearchFilter');
const btnRangePriceFilter = document.getElementById("rangeFilterCount");
const btnClearPriceFilter = document.getElementById("clearRangeFilter");
const minPriceInput = document.getElementById("rangeFilterCountMin");
const maxPriceInput = document.getElementById("rangeFilterCountMax");
const sortingBtns = document.querySelector('#sortingBtns');

let productsFilteredByPrice = [];
let productsFilteredByText;
let productsFilteredByBoth;

let sortingBtn = 'sortByRelevance';

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
        let productsArray = data.products.sort((a, b) => b.soldCount - a.soldCount);
        showData(productsArray);

        function sortAndShowData(sortingBtn) {
          if (searchBar.value === '') {
            if (minPriceInput.value === '' && maxPriceInput.value === '') {
              applySorting(productsArray, sortingBtn);
              showData(productsArray);
            } else {
              applySorting(productsFilteredByPrice, sortingBtn);
              showData(productsFilteredByPrice);
            }
          } else {
            if (minPriceInput.value === '' && maxPriceInput.value === '') {
              applySorting(productsFilteredByText, sortingBtn);
              showData(productsFilteredByText);
            } else {
              applySorting(productsFilteredByBoth, sortingBtn);
              showData(productsFilteredByBoth);
            }
          }
        }

        sortingBtns.addEventListener('click', (e) => {
          if (e.target.tagName === 'INPUT') {
            sortingBtn = e.target.getAttribute('id');
            const elementArray = Array.from(e.target.parentElement.children);

            function darkToLight() {
              elementArray.forEach(element => {
                element.classList.replace('btn-dark', 'btn-light');
              });
            }

            switch (sortingBtn) {
              case 'sortDescByCost':
                darkToLight();
                elementArray[1].classList.replace('btn-light', 'btn-dark');
                sortAndShowData(sortingBtn);
                break;
              case 'sortAscByCost':
                darkToLight();
                elementArray[3].classList.replace('btn-light', 'btn-dark');
                sortAndShowData(sortingBtn);
                break;
              case 'sortByRelevance':
                darkToLight();
                elementArray[5].classList.replace('btn-light', 'btn-dark');
                sortAndShowData(sortingBtn);
            }
          }
        })

        searchBar.addEventListener('input', (e) => {
          const searchInput = e.target.value;
          if (searchInput === '') {
            if (minPriceInput.value === '' && maxPriceInput.value === '') {
              applySorting(productsArray, sortingBtn);
              showData(productsArray);
            } else {
              productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              applySorting(productsFilteredByPrice, sortingBtn);
              showData(productsFilteredByPrice);
            }
          } else {
            if (minPriceInput.value === '' && maxPriceInput.value === '') {
              productsFilteredByText = filterByText(productsArray, searchInput);
              applySorting(productsFilteredByText, sortingBtn);
              showData(productsFilteredByText);
            } else {
              productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
              productsFilteredByBoth = filterByText(productsFilteredByPrice, searchInput);
              applySorting(productsFilteredByBoth, sortingBtn);
              showData(productsFilteredByBoth);
            }
          }
        });

        btnClearSearch.addEventListener('click', () => {
          searchBar.value = '';
          if (minPriceInput.value === '' && maxPriceInput.value === '') {
            applySorting(productsArray, sortingBtn);
            showData(productsArray);
          } else {
            productsFilteredByPrice = filterByPrice(productsArray, minPriceInput.valueAsNumber, maxPriceInput.valueAsNumber);
            applySorting(productsFilteredByPrice, sortingBtn);
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
            applySorting(productsFilteredByPrice, sortingBtn);
            showData(productsFilteredByPrice);
          } else {
            productsFilteredByPrice = filterByPrice(productsArray, minPrice, maxPrice);
            productsFilteredByBoth = filterByText(productsFilteredByPrice, searchBar.value);
            applySorting(productsFilteredByBoth, sortingBtn);
            showData(productsFilteredByBoth);
          }
        });

        btnClearPriceFilter.addEventListener('click', () => {
          minPriceInput.value = '';
          maxPriceInput.value = '';
          productsFilteredByPrice = [];
          if (searchBar.value === '') {
            applySorting(productsArray, sortingBtn);
            showData(productsArray);
          } else {
            productsFilteredByText = filterByText(productsArray, searchBar.value)
            applySorting(productsFilteredByText, sortingBtn);
            showData(productsFilteredByText);
          }
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