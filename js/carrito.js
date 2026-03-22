// cargar carrito guardado
let guardado = localStorage.getItem("carrito");
if (guardado) {
    carrito = JSON.parse(guardado);
}

// agregar al carrito
function agregarAlCarrito(producto) {
    carrito.push(producto);

    localStorage.setItem("carrito", JSON.stringify(carrito));

    mostrarCarrito();
    calcularTotal();
}

// mostrar carrito
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
        Swal.fire({
            title: "Error",
            text: "El carrito está vacío",
            icon: "error"
        });
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