
function Producto(nombre, precio) {

    this.nombre = nombre;
    this.precio = precio;

}


// ===== ARRAY =====
const productos = [

    new Producto("Lavadora", 500),
    new Producto("Nevera", 800),
    new Producto("Microondas", 200)

];


let carrito = [];

const guardado = localStorage.getItem("carrito");

if (guardado) {
    carrito = JSON.parse(guardado);
}

// ===== DOM =====
const lista = document.getElementById("lista");
const total = document.getElementById("total");

const botonlavadora = document.getElementById("botonlavadora");
const botonnevera = document.getElementById("botonnevera");
const botonmicro = document.getElementById("botonmicro");
const botonborrar = document.getElementById("botonborrar");

// ===== EVENTOS =====
botonlavadora.addEventListener("click", function () {
    carrito.push(productos[0]);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("Lavadora agregada");
    calcularTotal();
});

botonnevera.addEventListener("click", function () {
    carrito.push(productos[1]);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("Nevera agregada");
    calcularTotal();
});

botonmicro.addEventListener("click", function () {
    carrito.push(productos[2]);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    console.log("Microondas agregado");
    calcularTotal();
});

// ===== MOSTRAR PRODUCTOS =====
productos.forEach(function (producto) {

    lista.innerHTML +=
        producto.nombre + " $" + producto.precio + "<br>";

});

botonborrar.addEventListener("click", function () {

    carrito = [];
    localStorage.setItem("carrito", JSON.stringify(carrito));
    calcularTotal();

    console.log("Carrito borrado");

});

// ===== FUNCION SUMAR =====
function calcularTotal() {

    let suma = 0;


    carrito.forEach(function (item) {

        suma = suma + item.precio;

    });


    total.innerHTML = "Total: $" + suma;

}

calcularTotal();