/* Clase para cargar las peliculas*/

class BaseDeDatos {
    constructor() {
        this.peliculas = [];
        this.agregarPelicula(1, "Mariobros", 100, "Pelicula", "mariobrosmovie.jpg");
        this.agregarPelicula(2, "Spiderman", 100, "Pelicula", "spidermanspiderverse.jpg");
        this.agregarPelicula(3, "Elemental", 100, "Pelicula", "elemental.jpg");
        this.agregarPelicula(4, "Volveralfuturo", 50, "Pelicula", "bttf.jpg");
        this.agregarPelicula(5, "Starwars", 25, "Pelicula", "starwars.jpg");
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
            <a href="#" data-id="${pelicula.id}" class="btnQuitar">Quitar del carrito</a>
            </div>
            `;

        
            this.total += pelicula.precio * pelicula.cantidad;
            this.totalPeliculas += pelicula.cantidad;
        }
    }
}