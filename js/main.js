const productos = ["Lavadora", "Nevera", "Microondas", "Cocina"]
const precios = [500, 800, 200, 600]

let total = 0
let opcion = 0


function agregarProducto(indice) {
    total += precios[indice]
    alert("Agregaste" + productos[indice] + "\n Total actual: $" + total)
}


function finalizarCompra() {
    alert("Gracias por tu compra \n Total a pagar: $" + total)
}
let menu = parseInt(prompt("elija una opcion: \n 1-lavadora (500$) \n 2-nevera (800$) \n 3-microondas (200$) \n 4-cocina (600$) \n 5-Comprar \n 6-salir"))


while (menu !== 6) {

    switch (menu) {
        case 1:
            agregarProducto(0)
            break

        case 2:
            agregarProducto(1)
            break

        case 3:
            agregarProducto(2)
            break

        case 4:
            agregarProducto(3)
            break

        case 5:
            let confirmarCompra = confirm(
                "El total es $" + total + "\n¿Deseas finalizar la compra?"
            )

            if (confirmarCompra) {
                finalizarCompra()
                menu = 6
            } else {
                alert("Compra cancelada")
            }

        case 6:
            alert("Saliste del carrito")
            break

        default:
            alert("Opción inválida")
    }

    menu = parseInt(prompt("elija una opcion: \n 1-lavadora (500$) \n 2-nevera (800$) \n 3-microondas (200$) \n 4-cocina (600$) \n 5-Comprar \n 6-salir"))
}