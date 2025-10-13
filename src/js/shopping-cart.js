// Referencias
const addToCartBtn = document.getElementById("add-to-cart-btn");
const cartCounter = document.getElementById("contadorCarrito");

// Cargar carrito existente del localStorage (si lo hay)
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Mostrar la cantidad actual en el ícono
actualizarContador();

// Escuchar el clic del botón
addToCartBtn.addEventListener("click", () => {
  const nombre = document.querySelector(".nombre").textContent;
  const precio = parseFloat(document.querySelector(".precio").dataset.precio);
  const talla = document.getElementById("talla").value;
  const imagen = document.querySelector("img").src;

  // Crear objeto producto
  const producto = {
    id: Date.now(), // ID temporal
    nombre,
    precio,
    talla,
    imagen
  };

  // Agregar al carrito
  carrito.push(producto);
  localStorage.setItem("carrito", JSON.stringify(carrito));

  // Actualizar contador
  actualizarContador();

  // Notificación visual (opcional)
  alert(`${nombre} (${talla}) se añadió al carrito`);
});

// Función para actualizar el número del carrito
function actualizarContador() {
  contadorCarrito.textContent = carrito.length;
}