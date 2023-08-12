const DATA_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';


const contenido = document.querySelector('.pb-5.container')


function showData(dataArray) {
    for (const item of dataArray) {
        contenido.innerHTML +=
            `<div class="product">
            <p>${item.name}</p>
            <p>${item.description}</p>
            <p>${item.cost} ${item.currency}</p>
            <p>Sold: ${item.soldCount}</p>
            <img src="${item.image}" alt="Imagen del producto">
            </div>`;
    }
}


fetch(DATA_URL)
  .then(response => response.json())
  .then(data => showData(data.products))
  .catch(error => console.error("Error fetching data:", error));
