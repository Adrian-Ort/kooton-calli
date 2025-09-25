import '../css/normalize.css';         // first reset to normalize

// Import Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap JS (included Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// CSS
import '../css/main.css';  // main styles
import '../css/header.css'; // header styles
import '../css/aboutUs.css'; // aboutUs styles
import '../css/footer.css'; //footer styles
import '../css/home.css'; // home styles
import '../css/contact.css'; // contact styles
// global variables
import '../css/global_variables.css';

// Components
import './components.js';


// Page Contact
import './contact.js';

import '../css/normalize.css';
// ... (todos tus otros imports)
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
            productImage.src = `public/img/product-images${product.img}`; 
            productImage.alt = `Imagen de ${product.description}`;
            
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