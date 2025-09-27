import ItemsController from './itemsController.js';

// Envolvemos todo en una función asíncrona para poder usar 'await'
async function initializeApp() {
    // 1. Inicializar el controlador.
    const itemsController = new ItemsController();
    
    // 2. Esperar a que los datos se carguen desde el JSON.
    await itemsController.loadInitialItems(); // ¡Este 'await' es la clave!

    // 3. Obtener el ID del producto desde la URL.
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    // 4. Procesar el producto (el resto de tu código sigue igual).
    if (productId) {
        const product = itemsController.getItemById(productId);

        if (product) {
            // Conectar IDs del HTML con los datos del producto.
            document.querySelector('.product-title-header').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = product.price;
            
            const productImage = document.getElementById('product-image');
            // Para la ruta de las imágenes
            productImage.src = `public/img/product-images/${product.img}`; 
            productImage.alt = `Imagen de ${product.name}`;
            
            // Actualiza el título de la pestaña del navegador
            //document.title = product.name;

        } else {
            console.error(`Error: No se encontró el producto con ID ${productId}.`);
            // Aquí podrías mostrar un mensaje 404.
        }
    } else {
        console.error('Error: ID de producto no especificado en la URL.');
        // Redirigir al catálogo o mostrar un error.
    }
}

// Espera a que el DOM esté cargado y luego ejecuta nuestra función principal.
document.addEventListener('DOMContentLoaded', initializeApp);