document.addEventListener("DOMContentLoaded", function () {

    loadProducts();

});


function loadProducts() {

    fetch("/products")
        .then(response => response.json())
        .then(products => {

            let table = document.getElementById("productTable");

            table.innerHTML = "";

            products.forEach(product => {

                let row = `
                    <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                    </tr>
                `;

                table.innerHTML += row;

            });

        })
        .catch(error => {

            console.error("Error loading products:", error);

        });

}


function addProduct() {

    let name = document.getElementById("productName").value;
    let description = document.getElementById("productDescription").value;
    let price = document.getElementById("productPrice").value;


    let product = {

        name: name,
        description: description,
        price: Number(price)

    };


    fetch("/products", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(product)

    })

    .then(response => response.json())

    .then(data => {

        alert("Product added successfully!");

        document.getElementById("productName").value = "";
        document.getElementById("productDescription").value = "";
        document.getElementById("productPrice").value = "";

        loadProducts();

    })

    .catch(error => {

        console.error("Error adding product:", error);

        alert("Error adding product");

    });

}