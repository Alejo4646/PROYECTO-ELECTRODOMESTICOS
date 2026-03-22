let productos = [];
let carrito = [];

// guardado carrito
let guardado = localStorage.getItem("carrito");
if (guardado) {
    carrito = JSON.parse(guardado);
}

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

// agregar al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
    calcularTotal();
}

// Mostrar carrito

function mostrarCarrito() {
    let contenedor = document.getElementById("carrito");
    contenedor.innerHTML = "";

    for (let i = 0; i < carrito.length; i++) {
        let p = carrito[i];

        let div = document.createElement("div");
        div.innerHTML = p.nombre + " - $" + p.precio + " ";

        let boton = document.createElement("button");
        boton.innerText = "X";

        boton.onclick = function () {
            carrito.splice(i, 1);
            localStorage.setItem("carrito", JSON.stringify(carrito));
            mostrarCarrito();
            calcularTotal();
        };

        div.appendChild(boton);
        contenedor.appendChild(div);
    }
}

// total
function calcularTotal() {
    let total = 0;

    for (let i = 0; i < carrito.length; i++) {
        total += carrito[i].precio;
    }

    document.getElementById("total").innerText = "Total: $" + total;
}

// formulario
let form = document.getElementById("formulario");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    let nombre = document.getElementById("nombre").value;

    Swal.fire({
        title: "Compra realizada",
        text: "Gracias por tu compra " + nombre,
        icon: "success"
    });

    carrito = [];
    localStorage.removeItem("carrito");

    mostrarCarrito();
    calcularTotal();

    form.reset();
});
