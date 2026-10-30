document.addEventListener("DOMContentLoaded", function () {

    loadCount("/products", "productCount");
    loadCount("/inventory", "inventoryCount");
    loadCount("/purchase-orders", "purchaseCount");
    loadCount("/sales-orders", "salesCount");
    loadCount("/stock-alerts", "alertCount");

});


function loadCount(url, elementId) {

    fetch(url)
        .then(response => response.json())
        .then(data => {

            document.getElementById(elementId).innerText = data.length;

        })
        .catch(error => {

            console.error("Error loading " + url, error);

        });

}