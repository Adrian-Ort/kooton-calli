import ItemsController from './itemsController.js';

// Function to handle adding items to the cart
function handleAddToCart(product) {
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (!addToCartBtn) return;

    addToCartBtn.addEventListener('click', () => {
        const sizeSelect = document.getElementById('size-select');
        const selectedSize = sizeSelect.value;

        if (selectedSize === 'Elige una talla') {
            alert('Por favor, elige una talla antes de añadir al carrito.');
            return;
        }

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProductIndex = cart.findIndex(item => item.id === product.id && item.size === selectedSize);

        if (existingProductIndex > -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            const productToAdd = {
                id: product.id,
                name: product.name,
                price: product.priceRaw, // <-- CORRECTION: Use the raw price number
                img: product.imgUrl,     // <-- CORRECTION: Use imgUrl
                size: selectedSize,
                quantity: 1
            };
            cart.push(productToAdd);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${product.name} (Talla: ${selectedSize}) ha sido añadido a tu carrito.`);
    });
}


// Main function to initialize the app
async function initializeApp() {
    const itemsController = new ItemsController();
    await itemsController.loadInitialItems(); // This now fetches combined data

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    if (productId) {
        const product = itemsController.getItemById(productId);

        if (product) {
            // Populate product details
            document.getElementById('page-title').textContent = product.name + ' - Kooton Calli';
            document.querySelector('.product-title-header').textContent = product.name;
            document.getElementById('product-description').textContent = product.description;
            document.getElementById('product-price').textContent = product.price; // This is the formatted price
            
            const productImage = document.getElementById('product-image');
            productImage.src = `/img/products-images/${product.imgUrl}`; // <-- CORRECTION: Use imgUrl
            productImage.alt = `Imagen de ${product.name}`;
            
            handleAddToCart(product); // Pass the full product object

        } else {
            console.error(`Error: No se encontró el producto con ID ${productId}.`);
        }
    } else {
        console.error('Error: ID de producto no especificado en la URL.');
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);