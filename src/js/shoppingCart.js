document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-items-container');
    const subtotalPriceEl = document.getElementById('subtotal-price');
    const totalPriceEl = document.getElementById('total-price');
    const checkoutButton = document.getElementById('checkout-button');

    // Main function to render the cart from localStorage data
    function renderCart() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        cartContainer.innerHTML = ''; // Clear the container first

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted">Tu carrito de compras está vacío.</p>';
            checkoutButton.disabled = true; // Disable checkout if cart is empty
            updateTotals();
            return;
        }

        // Enable checkout button
        checkoutButton.disabled = false;
        
        cart.forEach(item => {
            const cartItemHTML = `
                <div class="card mb-3" data-product-id="${item.id}" data-product-size="${item.size}">
                    <div class="card-body">
                        <div class="row align-items-center text-center">
                            <div class="col-12 col-md-2 mb-2 mb-md-0">
                                <img src="/img/products-images/${item.imgUrl}" class="img-fluid rounded-3" alt="${item.name}">
                            </div>
                            <div class="col-12 col-md-3 mb-2 mb-md-0">
                                <h6 class="mb-0">${item.name}</h6>
                                <p class="text-muted small mb-0">Talla: ${item.size}</p>
                            </div>
                            <div class="col-6 col-md-2">
                                <p class="mb-0">$${item.price.toFixed(2)}</p>
                            </div>
                            <div class="col-6 col-md-3">
                                <div class="d-flex justify-content-center align-items-center">
                                    <button class="btn btn-sm btn-secondary quantity-decrease">-</button>
                                    <input type="number" class="form-control text-center mx-2" value="${item.quantity}" min="1" readonly style="width: 60px;">
                                    <button class="btn btn-sm btn-secondary quantity-increase">+</button>
                                </div>
                            </div>
                             <div class="col-12 col-md-2 mt-2 mt-md-0">
                                <button class="btn btn-sm btn-danger remove-item">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            cartContainer.innerHTML += cartItemHTML;
        });

        updateTotals();
    }

    // Function to update the subtotal and total prices
    function updateTotals() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        subtotalPriceEl.textContent = `$${subtotal.toFixed(2)} MXN`;
        totalPriceEl.textContent = `$${subtotal.toFixed(2)} MXN`; // Assuming shipping is free for now
    }

    // Use event delegation to handle clicks on dynamic buttons
    cartContainer.addEventListener('click', (e) => {
        const target = e.target;
        const cartItemCard = target.closest('.card');
        
        if (!cartItemCard) return;

        const productId = parseInt(cartItemCard.dataset.productId);
        const productSize = cartItemCard.dataset.productSize;
        
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const itemIndex = cart.findIndex(item => item.id === productId && item.size === productSize);
        if (itemIndex === -1) return;

        if (target.classList.contains('quantity-increase')) {
            cart[itemIndex].quantity++;
        } else if (target.classList.contains('quantity-decrease')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
            }
        } else if (target.classList.contains('remove-item')) {
            // Remove the item from the array
            cart.splice(itemIndex, 1);
        }

        // Save the modified cart and re-render everything
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
    });
    
    // Listener for the checkout button to redirect to the shipping form
    checkoutButton.addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            window.location.href = '/html/shippingForm.html';
        } else {
            // Should not happen if button is disabled, but good for safety
            console.warn("Cannot proceed to checkout, cart is empty.");
        }
    });

    // Initial render when the page loads
    renderCart();
});
