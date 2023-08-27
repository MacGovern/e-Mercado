const contenido = document.querySelector("#products");
const searchBar = document.querySelector("#searchBar");
const btnClearSearch = document.querySelector("#clearSearchFilter");
/* Botones e inputs para la logica de los precios */
const btnRangePriceFilter = document.getElementById("rangeFilterCount");
const btnClearPriceFilter = document.getElementById("clearRangeFilter");
const minPriceInput = document.getElementById("rangeFilterCountMin");
const maxPriceInput = document.getElementById("rangeFilterCountMax");
const sortDescByCost = document.getElementById("sortDescByCost");
const sortAscByCost = document.getElementById("sortAscByCost");
const sortByRelevance = document.getElementById("sortByRelevance");

function showData(dataArray) {
  contenido.innerHTML = "";
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
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

if (sessionStorage.getItem("signedIn") !== "true")
  window.location.href = "login.html";
else {
  searchBar.value = "";

  document.addEventListener("DOMContentLoaded", () => {
    const storedCatID = localStorage.getItem("catID");

    const DATA_URL = `https://japceibal.github.io/emercado-api/cats_products/${storedCatID}.json`;

    fetch(DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        document.querySelector("#catName").textContent = data.catName;

        let productsArray = data.products;

        showData(productsArray);

        searchBar.addEventListener("input", (e) => {
          const searchInput = removeDiacritics(e.target.value).toLowerCase();

          let productsFiltered = productsArray.filter((product) => {
            const productName = removeDiacritics(product.name).toLowerCase();
            const productDescription = removeDiacritics(
              product.description
            ).toLowerCase();
            return (
              productName.includes(searchInput) ||
              productDescription.includes(searchInput)
            );
          });

          if (searchBar.value === "") showData(productsArray);
          else showData(productsFiltered);
        });

        btnClearSearch.addEventListener("click", () => {
          searchBar.value = "";
          showData(productsArray);
        });

        /* Logica para la busqueda por precios */
        btnRangePriceFilter.addEventListener("click", () => {
          const maxPrice = parseFloat(maxPriceInput.value);
          const minPrice = parseFloat(minPriceInput.value);

          if (
            (isNaN(minPrice) || minPrice < 0) &&
            (isNaN(maxPrice) || maxPrice < 0)
          ) {
            alert("Por favor ingrese valores válidos.");
            return;
          }

          if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            let productsFilteredByPrice = productsArray.filter((product) => {
              return product.cost >= minPrice && product.cost <= maxPrice;
            });
            showData(productsFilteredByPrice);
          } else if (!isNaN(minPrice)) {
            let productsFilteredByPrice = productsArray.filter((product) => {
              return product.cost >= minPrice;
            });
            showData(productsFilteredByPrice);
          } else if (!isNaN(maxPrice)) {
            let productsFilteredByPrice = productsArray.filter((product) => {
              return product.cost <= maxPrice;
            });
            showData(productsFilteredByPrice);
          } else {
            showData(productsArray);
          }
        });

        btnClearPriceFilter.addEventListener("click", () => {
          minPriceInput.value = "";
          maxPriceInput.value = "";
          showData(productsArray);
        });

        let currentSortOption = "default";

        function applySorting(sortFunction) {
          const sortedProducts = productsArray.slice().sort(sortFunction);
          showData(sortedProducts);
        }

        sortDescByCost.addEventListener("click", () => {
          if (currentSortOption === "desc") {
            currentSortOption = "default";
            showData(productsArray);
          } else {
            currentSortOption = "desc";
            applySorting((a, b) => b.cost - a.cost);
          }
        });

        sortAscByCost.addEventListener("click", () => {
          if (currentSortOption === "asc") {
            currentSortOption = "default";
            showData(productsArray);
          } else {
            currentSortOption = "asc";
            applySorting((a, b) => a.cost - b.cost);
          }
        });

        sortByRelevance.addEventListener("click", () => {
          if (currentSortOption === "relevance") {
            currentSortOption = "default";
            showData(productsArray);
          } else {
            currentSortOption = "relevance";
            applySorting((a, b) => a.soldCount - b.soldCount);
          }
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  });
}

window.addEventListener("load", () => {
  let email = localStorage.getItem("email");
  let nav = document.querySelector("nav.navbar");
  let navItems = nav.getElementsByClassName("nav-item");
  let ultimoNav = navItems[navItems.length - 1];
  ultimoNav.innerHTML = `<a class="nav-link" href="my-profile.html">${email}</a>`;
});
