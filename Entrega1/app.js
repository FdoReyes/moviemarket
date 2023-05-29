const productos = [
    {nombre: "Super Mario Bros" , precio: 100 },
    {nombre: "Spiderman" , precio: 125 },
    {nombre: "Volver al Futuro" , precio: 75 },
    {nombre: "Star Wars" , precio: 80 },
    {nombre: "Scarface" , precio: 50 },
];

let carrito = []

let select = prompt("¿Desea comprar algun producto si o no?");

while(select !="si" && select !="no"){
    alert ("porfavor ingresa si o no")
    select = prompt("¿Desea comprar algun producto si o no?")
}

if (select == "si"){
    alert("Estos son nuestros productos")
    let allProducts = productos.map (
        (producto) => producto.nombre + " " + "$" + producto.precio
    );
    alert(allProducts.join(" - "))
} else if (select == "no"){
    alert ("gracias por venir, hasta pronto!")
}

while(select != "no"){
    let producto = prompt("Agrega un producto a tu carrito");
    let precio = 0

if (producto == "Super Mario Bros" || producto == "Spiderman" || producto == "Volver al Futuro" || producto == "Star Wars" || producto == "Scarface") {
    switch(producto) {
        case "Super Mario Bros":
        precio = 100;
        break;
        case "Spiderman":
            precio = 125;
        break;
        case "Volver al Futuro":
            precio = 75;
        break;
        case "Star Wars":
            precio = 80;
        break;
        case "Scarface":
            precio = 50;
        break;
        default:
        break;
    }
    let unidades = parseInt(prompt("Cuantas unidades quieres llevar"))

    carrito.push({producto, unidades, precio})
    console.log (carrito)
   } else {
    alert("no tenemos ese producto")
    }

   select = prompt("desea seguir comprando?")
}
   while(select === "no"){
    alert("gracias por comprar! hasta pronto!")
    carrito.forEach((carritoFinal) => {
        console.log(`producto: ${carritoFinal.producto}, unidades: ${carritoFinal.unidades}, total a pagar producto ${carritoFinal.unidades * carritoFinal.precio}`)
    })
    break;
}

const total = carrito.reduce((acc, el) => acc + el.precio * el.unidades, 0)
alert(`el total a pagar por su compra es: ${total}`)