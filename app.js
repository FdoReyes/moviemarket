/* Clase para cargar las peliculas*/

class BaseDeDatos {
    constructor() {
        this.peliculas = [];
    }

 async traerRegistros() {
    const response = await fetch ("peliculas.json");
    this.peliculas = await response.json();
    return this.peliculas;
 }  

    // Método para crear el objeto pelicula y se almacena en el array con un push
    agregarPelicula(id, nombre, precio, categoria, imagen, sinopsis) {
        const pelicula = new Pelicula(id, nombre, precio, categoria, imagen, sinopsis);
        this.peliculas.push(pelicula);
    }


    //Busca una pelicula por ID, si lo encuentra lo retorna en forma de objeto
    registroporId(id) {
        return this.peliculas.find((pelicula) => pelicula.id === id);
    }

    registrosPorNombre(palabra) {
        return this.peliculas.filter((pelicula) => pelicula.nombre.toLowerCase().includes(palabra));
    }
    registrosPorCategoria(categoria) {
        return this.peliculas.filter((pelicula) => pelicula.categoria == categoria);
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
        Toastify({
            text: `${pelicula.nombre} agregado al carrito`,
            duration: 2000,
            className: "info",
            gravity: "top",
            position: "center",
            style: {
            background: "linear-gradient(to right, #8360c3, #2ebf91)",
            },
          }).showToast();
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

    vaciar() {
        this.carrito = [];
        localStorage.removeItem("carrito");
        this.listar();
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
            <a href="#" data-id="${pelicula.id}" class="btn btnQuitar"> Eliminar</a>
            </div>
            `;
            // Actualizamos los totales
            this.total += pelicula.precio * pelicula.cantidad;
            this.totalPeliculas += pelicula.cantidad;
        }

        if (this.totalPeliculas > 0) {
            botonComprar.classList.remove("oculto"); //se muestra el botón
        } else {
            botonComprar.classList.add("oculto"); //se oculta el botón
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar) {
            boton.onclick = (event) => {
                event.preventDefault();
                this.quitar(Number(boton.dataset.id));
            };
        }

        spanCantidadPeliculas.innerText = this.totalPeliculas;
        spanTotalCarrito.innerText = this.total;
    }
}

class Pelicula {
    constructor(id, nombre, precio, categoria, imagen = false, sinopsis) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.sinopsis = sinopsis;
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
const inputBuscar = document.querySelector("#inputBuscar");
const botonCarrito = document.querySelector("section h1");
const botonComprar = document.querySelector("#botonComprar");
const botonesCategorias = document.querySelectorAll(".btnCategoria");

botonesCategorias.forEach((boton) => {
    boton.addEventListener("click", (event) => {
      event.preventDefault();
      boton.classList.add("seleccionado");
      const peliculasPorCategoria = bd.registrosPorCategoria(boton.innerText);
      cargarPeliculas(peliculasPorCategoria);
    });
  });


const botonTodos = document.querySelector("#btnTodos");
botonTodos.addEventListener("click", (event) => {
  event.preventDefault();
  cargarPeliculas(bd.peliculas);
});

bd.traerRegistros().then((peliculas) => cargarPeliculas(peliculas));


function cargarPeliculas(peliculas) {
    divPeliculas.innerHTML = "";

    for (const pelicula of peliculas) {
        divPeliculas.innerHTML += `
        <div class="pelicula"> 
        <h2>${pelicula.nombre}</h2>
        <p class="sinopsis"><a class="movie" href="pages/${pelicula.sinopsis}">Ver sinopsis</a></p>
        <p class="precio">$${pelicula.precio}</p>
        <div class="imagen">
            <img src="img/${pelicula.imagen}" />
        </div>
            <a href="#" class="btn btnAgregar" data-id="${pelicula.id}"> Agregar</a>
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

inputBuscar.addEventListener("keyup", () => {
    const palabra = inputBuscar.value;
    const peliculasEncontradas = bd.registrosPorNombre(palabra.toLowerCase());
    cargarPeliculas(peliculasEncontradas);
  });

//Toggle para ocultar/mostrar el carrito 
botonCarrito.addEventListener("click", (event) => {
    document.querySelector("section").classList.toggle("ocultar");
});

botonComprar.addEventListener("click", (event) => {
    event.preventDefault();
    Swal.fire({
        title: "Sus peliculas estan agregadas",
        text: "Su compra ha sido realizada con éxito!",
        icon: "success",
        confirmButtonText: "Aceptar",
    });

    carrito.vaciar();
    document.querySelector("section").classList.add("ocultar");
});

const carrito = new Carrito;

