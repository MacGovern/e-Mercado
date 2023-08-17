const contenido = document.querySelector('.pb-5.container');

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

if(sessionStorage.getItem("signedIn") !== "true")
    window.location.href = "login.html";
else{
    document.addEventListener("DOMContentLoaded", () => {
        const storedCatID = localStorage.getItem("catID");
        const DATA_URL = `https://japceibal.github.io/emercado-api/cats_products/${storedCatID}.json`;
        fetch(DATA_URL)
            .then(response => response.json())
            .then(data => showData(data.products))
            .catch(error => console.error("Error fetching data:", error));
    });
}