/* Clase para cargar las peliculas*/

class BaseDeDatos {
    constructor() {
        this.peliculas = [];
        this.agregarPelicula(1, "Mario Bros", 100, "Pelicula", "mariobrosmovie.jpg");
        this.agregarPelicula(2, "Spiderman", 100, "Pelicula", "spidermanspiderverse.jpg");
        this.agregarPelicula(3, "Elemental", 100, "Pelicula", "elemental.jpg");
        this.agregarPelicula(4, "Volver al futuro", 50, "Pelicula", "bttf.jpg");
        this.agregarPelicula(5, "Star Wars", 25, "Pelicula", "starwars.jpg");
        this.agregarPelicula(6, "Joker", 100, "Pelicula", "joker.jpg");
        this.agregarPelicula(7, "Scarface", 50, "Pelicula", "scarface.jpg");
        this.agregarPelicula(1, "Avengers", 100, "Pelicula", "infinitywar.jpg");
    }

    // Método para crear el objeto pelicula y se almacena en el array con un push
    agregarPelicula(id, nombre, precio, categoria, imagen) {
        const pelicula = new Pelicula(id, nombre, precio, categoria, imagen);
        this.peliculas.push(pelicula);
    }

    //Retorna el array con todas las peliculas de la base de datos

    traerRegistros() {
        return this.peliculas;
    }


    //Busca una pelicula por ID, si lo encuentra lo retorna en forma de objeto
    registroporId(id) {
        return this.peliculas.find((pelicula) => pelicula.id === id);
    }

    registrosPorNombre(palabra) {
        return this.peliculas.filter((pelicula) => pelicula.nombre.toLowerCase().includes(palabra));
    }
}


// Clase carrito, para manipular las peliculas del carrito
class Carrito {
    constructor () {
        const carritoStorage = JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.totalPeliculas = 0;
        this.listar();
    }

    estaEnCarrito({ id }) {
        return this.carrito.find((pelicula) => pelicula.id === id);
    }

    agregar(pelicula) {
        const peliculaEnCarrito = this.estaEnCarrito(pelicula);
        if (peliculaEnCarrito) {
            peliculaEnCarrito.cantidad++;
        } else {
            this.carrito.push({ ...pelicula, cantidad: 1});
        }

        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitar(id) {
        const indice = this.carrito.findIndex((pelicula) => pelicula.id === id);
        if (this.carrito[indice].cantidad > 1) {
            this.carrito[indice].cantidad--;
        } else {
            this.carrito.splice(indice, 1);
        }
        this.listar();
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
    }

    listar() {
        this.total = 0;
        this.totalPeliculas = 0;
        divCarrito.innerHTML = "";
        for (const pelicula of this.carrito) {
            divCarrito.innerHTML += `
            <div class="peliculaCarrito">
            <h2>${pelicula.nombre}</h2>
            <p>$${pelicula.precio}</p>
            <p>Cantidad: ${pelicula.cantidad}</p>
            <a href="#" data-id="${pelicula.id}" class="btnQuitar"> Eliminar</a>
            </div>
            `;

            this.total += pelicula.precio * pelicula.cantidad;
            this.totalPeliculas += pelicula.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            }
        }

        spanCantidadPeliculas.innerText = this.totalPeliculas;
        spanTotalCarrito.innerText = this.total;
    }
}

class Pelicula {
    constructor(id, nombre, precio, categoria, imagen = false) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}

//Objeto de la base de datos
const bd = new BaseDeDatos();


//Elementos
const divPeliculas = document.querySelector("#peliculas");
const divCarrito = document.querySelector("#carrito");
const spanCantidadPeliculas = document.querySelector("#cantidadPeliculas");
const spanTotalCarrito = document.querySelector("#totalCarrito");
const botonCarrito = document.querySelector("section h1");

cargarPeliculas(bd.traerRegistros());

function cargarPeliculas(peliculas) {
    divPeliculas.innerHTML = "";

    for (const pelicula of peliculas) {
        divPeliculas.innerHTML += `
        <div class="pelicula"> 
        <h2>${pelicula.nombre}</h2>
        <p class="precio">$${pelicula.precio}</p>
        <div class="imagen">
            <img src="img/${pelicula.imagen}" />
        </div>
            <a href="#" class="btnAgregar" data-id="${pelicula.id}"> Agregar</a>
        </div>
        `;
    }

    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", event => {
            event.preventDefault();
            const id = Number(boton.dataset.id);
            const pelicula = bd.registroporId(id);
            carrito.agregar(pelicula);
        });
    }
}

//Trigger para ocultar/mostrar el carrito 
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

const carrito = new Carrito;

