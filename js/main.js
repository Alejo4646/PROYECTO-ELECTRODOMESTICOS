let productos = [];
let carrito = [];

// productos
fetch("db/data.json")
    .then(res => res.json())
    .then(data => {
        productos = data;
        mostrarProductos();
        mostrarCarrito();
        calcularTotal();
    });

// mostrar productos
function mostrarProductos() {
    let lista = document.getElementById("lista");
    lista.innerHTML = "";

    for (let i = 0; i < productos.length; i++) {
        let p = productos[i];

        let div = document.createElement("div");
        div.innerHTML = p.nombre + " - $" + p.precio;

        let boton = document.createElement("button");
        boton.innerText = "Agregar";

        boton.onclick = function () {
            agregarAlCarrito(p);
        };

        div.appendChild(boton);
        lista.appendChild(div);
    }
}