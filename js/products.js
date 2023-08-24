const contenido = document.querySelector('#products');
const searchBar = document.querySelector('#searchBar');
const btnClearSearch = document.querySelector('#clearSearchFilter');

function showData(dataArray){
    contenido.innerHTML = "";
    for (const item of dataArray){
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

function removeDiacritics(str){
    return str.normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

if (sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else {
    searchBar.value = '';
    document.addEventListener("DOMContentLoaded", () => {
        const storedCatID = localStorage.getItem("catID");
        const DATA_URL = `https://japceibal.github.io/emercado-api/cats_products/${storedCatID}.json`;
        fetch(DATA_URL)
            .then((response) => response.json())
            .then((data) => {
                let productsArray = data.products;
                showData(productsArray);
                searchBar.addEventListener('input', (e) => {
                    const searchInput = removeDiacritics(e.target.value).toLowerCase();
                    let productsFiltered = productsArray.filter((product) => {
                        const productName = removeDiacritics(product.name).toLowerCase();
                        const productDescription = removeDiacritics(product.description).toLowerCase();
                        return productName.includes(searchInput) || productDescription.includes(searchInput);
                    });
                    if (searchBar.value === '')
                        showData(productsArray);
                    else
                        showData(productsFiltered);
                });
                btnClearSearch.addEventListener('click', () => {
                    searchBar.value = '';
                    showData(productsArray);
                });
            })
            .catch(error => console.error("Error fetching data:", error));
    });
}