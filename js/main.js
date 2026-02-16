// ===== Función constructora =====
function Producto(id, nombre, precio, categoria) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.categoria = categoria;
}

// ===== LocalStorage keys =====
const LS_KEYS = {
    catalogo: "electroshop_catalogo",
    carrito: "electroshop_carrito",
};

// ===== Storage helpers =====
function leerLS(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
}

function guardarLS(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// ===== Estado =====
let catalogo = leerLS(LS_KEYS.catalogo, [
    new Producto(1, "Lavadora", 500, "Lavado"),
    new Producto(2, "Nevera", 800, "Frío"),
    new Producto(3, "Microondas", 200, "Cocina"),
    new Producto(4, "Cocina", 600, "Cocina"),
]);

let carrito = leerLS(LS_KEYS.carrito, []);

// ===== DOM =====
const productList = document.querySelector("#productList");
const emptyProducts = document.querySelector("#emptyProducts");

const cartList = document.querySelector("#cartList");
const emptyCart = document.querySelector("#emptyCart");
const totalEl = document.querySelector("#total");
const messageEl = document.querySelector("#message");

const searchEl = document.querySelector("#search");
const categoryEl = document.querySelector("#category");

const clearCartBtn = document.querySelector("#clearCart");
const checkoutBtn = document.querySelector("#checkout");

const addForm = document.querySelector("#addForm");
const nameEl = document.querySelector("#name");
const priceEl = document.querySelector("#price");
const catEl = document.querySelector("#cat");

// ===== Mensajes en DOM =====
let msgTimeout = null;
function mostrarMensaje(texto) {
    messageEl.textContent = texto;
    clearTimeout(msgTimeout);
    msgTimeout = setTimeout(function () {
        messageEl.textContent = "";
    }, 2500);
}

// ===== Render catálogo =====
function renderCatalogo() {
    const q = (searchEl.value || "").trim().toLowerCase();
    const cat = categoryEl.value;

    const filtrados = catalogo
        .filter(function (p) {
            return cat === "all" ? true : p.categoria === cat;
        })
        .filter(function (p) {
            return p.nombre.toLowerCase().includes(q);
        });

    // armar html
    let html = "";

    for (let i = 0; i < filtrados.length; i++) {
        const p = filtrados[i];

        html += '<div class="item">';
        html += "  <div>";
        html += "    <strong>" + p.nombre + "</strong>";
        html += "    <small>" + p.categoria + " · $" + p.precio + "</small>";
        html += "  </div>";

        html += '  <div class="row">';
        html +=
            '    <button class="btn" data-action="add" data-id="' +
            p.id +
            '">Agregar</button>';
        html +=
            '    <button class="btn danger" data-action="delete-product" data-id="' +
            p.id +
            '">Eliminar</button>';
        html += "  </div>";

        html += "</div>";
    }

    productList.innerHTML = html;

    // mostrar/ocultar mensaje
    emptyProducts.classList.toggle("hidden", filtrados.length !== 0);
}

// Render carrito

function renderCarrito() {
    emptyCart.style.display = carrito.length ? "none" : "block";

    let html = "";

    for (let i = 0; i < carrito.length; i++) {
        const item = carrito[i];

        html += '<div class="item">';
        html += '  <div>';
        html += '    <strong>' + item.nombre + '</strong>';
        html += '    <small>$' + item.precio + ' c/u · x' + item.qty + '</small>';
        html += '  </div>';
        html += '  <div class="row">';
        html +=
            '    <button class="btn danger" data-action="remove" data-id="' +
            item.id +
            '">Quitar</button>';
        html += '  </div>';
        html += '</div>';
    }

    cartList.innerHTML = html;

    const total = carrito.reduce(function (acc, item) {
        return acc + item.precio * item.qty;
    }, 0);

    totalEl.textContent = "$" + total;
}

// ===== Acciones carrito =====
function agregarAlCarrito(productId) {
    const prod = catalogo.find(function (p) {
        return p.id === productId;
    });
    if (!prod) return;

    const existe = carrito.find(function (i) {
        return i.id === productId;
    });

    if (existe) {
        existe.qty += 1;
    } else {
        carrito.push({
            id: prod.id,
            nombre: prod.nombre,
            precio: prod.precio,
            categoria: prod.categoria,
            qty: 1,
        });
    }

    guardarLS(LS_KEYS.carrito, carrito);
    renderCarrito();
    mostrarMensaje("Agregado: " + prod.nombre);
}

function quitarDelCarrito(productId) {
    const idx = carrito.findIndex(function (i) {
        return i.id === productId;
    });
    if (idx === -1) return;

    if (carrito[idx].qty > 1) carrito[idx].qty -= 1;
    else carrito.splice(idx, 1);

    guardarLS(LS_KEYS.carrito, carrito);
    renderCarrito();
    mostrarMensaje("Producto quitado del carrito");
}

function vaciarCarrito() {
    carrito = [];
    guardarLS(LS_KEYS.carrito, carrito);
    renderCarrito();
    mostrarMensaje("Carrito vaciado");
}

function finalizarCompra() {
    if (carrito.length === 0) {
        mostrarMensaje("No puedes finalizar: carrito vacío");
        return;
    }

    vaciarCarrito();
    mostrarMensaje("Compra finalizada ✅");
}

// ===== Eliminar producto del catálogo =====
function eliminarProducto(productId) {
    carrito = carrito.filter(function (i) {
        return i.id !== productId;
    });
    guardarLS(LS_KEYS.carrito, carrito);
    renderCarrito();

    // borrar del catálogo
    catalogo = catalogo.filter(function (p) {
        return p.id !== productId;
    });
    guardarLS(LS_KEYS.catalogo, catalogo);

    renderCatalogo();
    mostrarMensaje("Producto eliminado del catálogo");
}

// ===== Eventos =====

// filtros
searchEl.addEventListener("input", renderCatalogo);
categoryEl.addEventListener("change", renderCatalogo);

// delegación catálogo 
productList.addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;

    const action = btn.dataset.action;
    const id = Number(btn.dataset.id);

    if (action === "add") {
        agregarAlCarrito(id);
    }

    if (action === "delete-product") {
        eliminarProducto(id);
    }
});

// delegación carrito
cartList.addEventListener("click", function (e) {
    const btn = e.target.closest('button[data-action="remove"]');
    if (!btn) return;
    const id = Number(btn.dataset.id);
    quitarDelCarrito(id);
});

clearCartBtn.addEventListener("click", vaciarCarrito);
checkoutBtn.addEventListener("click", finalizarCompra);

// agregar producto 
addForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombre = nameEl.value.trim();
    const precio = Number(priceEl.value);
    const categoria = catEl.value;

    if (!nombre || !categoria || !Number.isFinite(precio) || precio <= 0) {
        mostrarMensaje("Revisa los datos del formulario");
        return;
    }

    const nuevoId = catalogo.length
        ? Math.max.apply(
            null,
            catalogo.map(function (p) {
                return p.id;
            })
        ) + 1
        : 1;

    const nuevo = new Producto(nuevoId, nombre, precio, categoria);

    catalogo.push(nuevo);
    guardarLS(LS_KEYS.catalogo, catalogo);

    addForm.reset();
    renderCatalogo();
    mostrarMensaje("Producto agregado al catálogo: " + nombre);
});

// ===== Inicio =====
renderCatalogo();
renderCarrito();
