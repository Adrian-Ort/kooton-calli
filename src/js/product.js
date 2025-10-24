import ItemsController from './itemsController.js';


// Function to handle adding items to the cart
function handleAddToCart(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', () => {
        const sizeSelect = document.getElementById('size-select');
        const selectedSize = sizeSelect.value;

        // Validation: Ensure a size is selected
        if (selectedSize === 'Elige una talla') {
            alert('Por favor, elige una talla antes de añadir al carrito.');
            return; // Stop the function if no size is selected
        }

        // Get the cart from localStorage, or create an empty array if it doesn't exist
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if this exact product (ID and size) is already in the cart
        const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);

        if (existingProductIndex > -1) {
            // If it exists, just increase the quantity
            cart[existingProductIndex].quantity += 1;
        } else {
            // If it doesn't exist, add it as a new item
            const productToAdd = {
                id: product.id,
                name: product.name,
                // We store the base price as a number for easier calculations
                price: parseFloat(product.price.replace(/[^0-9.-]+/g,"")), 
                img: product.img,
                size: selectedSize,
                quantity: 1
            };
            cart.push(productToAdd);
        }

        // Save the updated cart back to localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

        // Optional: Give user feedback
        alert(`${product.name} (Talla: ${selectedSize}) ha sido añadido a tu carrito.`);

    });
}


// Main function to initialize the app
async function initializeApp() {
    const itemsController = new ItemsController();
    await itemsController.loadInitialItems();

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (productId) {
        const product = itemsController.getItemById(productId);

        if (product) {
            // Populate product details
            document.getElementById('page-title').textContent = product.name + ' - Kooton Calli';
            document.querySelector('.product-title-header').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = product.price; // The price is already formatted
            
            const productImage = document.getElementById('product-image');
            productImage.src = `/img/products-images/${product.img}`; 
            productImage.alt = `Imagen de ${product.name}`;
            
            // Set up the "Add to Cart" button functionality
            handleAddToCart(product);

        } else {
            console.error(`Error: No se encontró el producto con ID ${productId}.`);
        }
    } else {
        console.error('Error: ID de producto no especificado en la URL.');
    }

}

// Start the app after the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);