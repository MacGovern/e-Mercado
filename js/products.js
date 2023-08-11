const DATA_URL = 'https://japceibal.github.io/emercado-api/cats_products/101.json';


const contenido = document.querySelector('.pb-5.container')


function showData(dataArray) {
    for (const item of dataArray) {
        contenido.innerHTML += `<p> ${item.name} ${item.description} ${item.cost} ${item.currency} ${item.soldCount} </p>`;
    }
}


fetch(DATA_URL)
  .then(response => response.json())
  .then(data => showData(data.products))
  .catch(error => console.error("Error fetching data:", error));
