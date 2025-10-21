/**
 * shippingForm.js
 * Lógica para la página de formulario de dirección de envío.
 * Carga el resumen del carrito, captura los datos de envío y los guarda
 * en localStorage para la posterior página de éxito.
 */

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shipping-form');
    const summaryContainer = document.getElementById('shipping-summary-details');

    // Cargar el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    /**
     * Calcula el subtotal total del carrito.
     * @returns {number} Subtotal total de los productos.
     */
    function calculateSubtotal() {
        return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    /**
     * Renderiza un resumen de los productos y el total en la barra lateral.
     */
    function renderSummary() {
        const subtotal = calculateSubtotal();

        if (cart.length === 0) {
            summaryContainer.innerHTML = '<p class="text-danger">Tu carrito está vacío. Por favor, regresa a la página del carrito.</p>';
            form.querySelector('button[type="submit"]').disabled = true;
            return;
        }

        // Generar lista de productos
        let productsListHTML = '<ul class="list-group mb-3">';
        cart.forEach(item => {
            productsListHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                        <small class="fw-bold">${item.name}</small><br>
                        <small class="text-muted">Cant: ${item.quantity} | Talla: ${item.size}</small>
                    </div>
                    <span class="badge bg-secondary rounded-pill">$${(item.price * item.quantity).toFixed(2)}</span>
                </li>
            `;
        });
        productsListHTML += '</ul>';

        // Generar resumen de totales
        const totalsHTML = `
            ${productsListHTML}
            <div class="d-flex justify-content-between fw-bold pt-2 border-top">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)} MXN</span>
            </div>
            <div class="d-flex justify-content-between">
                <span>Envío:</span>
                <span class="text-success">Gratis</span>
            </div>
            <div class="d-flex justify-content-between fw-bold border-top mt-2 pt-2">
                <span>Total a Pagar:</span>
                <span style="color: #D3AF6C;">$${subtotal.toFixed(2)} MXN</span>
            </div>
        `;

        summaryContainer.innerHTML = totalsHTML;
    }

    /**
     * Maneja el envío del formulario: guarda los datos de envío
     * y redirige a la página de éxito (simulando pago).
     * @param {Event} e - Evento de envío del formulario.
     */
    function handleFormSubmit(e) {
        e.preventDefault();

        const formData = new FormData(form);
        const subtotal = calculateSubtotal();
        
        // Objeto para almacenar la dirección
        const shippingDetails = {
            name: formData.get('name'),
            email: formData.get('email'),
            address: formData.get('address'),
            crossStreets: formData.get('cross-streets'),
            city: formData.get('city'),
            state: formData.get('state'),
            references: formData.get('references'),
        };

        // Objeto completo del pedido para el correo de confirmación
        const orderDetails = {
            id: 'ORD-' + Date.now(), // ID de pedido simulado
            items: cart, // Productos
            totals: {
                subtotal: subtotal,
                shipping: 0.00,
                total: subtotal,
            },
            shipping: shippingDetails, // Datos de envío
            date: new Date().toLocaleDateString('es-MX'),
        };

        // Guardar los datos del pedido en localStorage para que 'orderSuccess.html' los use.
        localStorage.setItem('currentOrderData', JSON.stringify(orderDetails));
        
        // CORRECCIÓN: Apuntando a tu nuevo nombre de archivo
        window.location.href = '/html/orderSuccess.html'; 
    }

    renderSummary();
    form.addEventListener('submit', handleFormSubmit);
});
