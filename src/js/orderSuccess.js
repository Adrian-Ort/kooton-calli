/**
 * src/js/orderSuccess.js
 * * Logic for the purchase success page (success.html).
 * This script is responsible for:
 * 1. Retrieving order data stored temporarily from the shipping form.
 * 2. Rendering the final purchase summary and shipping details.
 * 3. Clearing the shopping cart (localStorage).
 * 4. Simulating the email dispatch to the buyer.
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve order data
    const orderData = JSON.parse(localStorage.getItem('currentOrderData'));
    const summaryContainer = document.getElementById('success-summary');
    const mainContent = document.querySelector('main');

    // CORRECCIÓN CLAVE: Usar orderData.items en lugar de orderData.cart
    if (!orderData || !orderData.items || orderData.items.length === 0) {
        // Handle case where order data is missing or corrupted
        mainContent.innerHTML = `
            <div class="container text-center my-5 py-5">
                <h1 class="mb-4 text-danger">Error al Cargar la Orden</h1>
                <p class="lead">No se encontraron detalles de la compra. Por favor, contacta a soporte. Asegúrate de haber completado el formulario de envío.</p>
                <a href="/html/productList.html" class="btn btn-lg btn-success mt-4">Volver a Comprar</a>
            </div>
        `;
        // Clean up temporary data just in case
        localStorage.removeItem('currentOrderData');
        return;
    }

    // --- 2. Render the Order Summary ---

    const orderSummaryHTML = `
        <div class="card p-4 shadow-lg text-start" style="max-width: 800px; width: 100%;">
            <h4 class="card-title text-center mb-4 text-success">Confirmación de Pedido (ID: ${generateOrderId()})</h4>
            
            <div class="row mb-4">
                <div class="col-md-6 border-end">
                    <h5 class="fw-bold text-decoration-underline mb-2">Detalles de Envío</h5>
                    <p class="mb-1"><strong>Destinatario:</strong> ${orderData.shipping.name}</p>
                    <p class="mb-1"><strong>Email:</strong> ${orderData.shipping.email}</p>
                    <p class="mb-1"><strong>Dirección:</strong> ${orderData.shipping.address}</p>
                    <p class="mb-1"><strong>Cruce:</strong> ${orderData.shipping.crossStreets || 'N/A'}</p>
                    <p class="mb-1"><strong>Ciudad/Estado:</strong> ${orderData.shipping.city} / ${orderData.shipping.state}</p>
                    <p class="mb-1"><strong>Referencias:</strong> ${orderData.shipping.references || 'Ninguna'}</p>
                </div>
                <div class="col-md-6">
                    <h5 class="fw-bold text-decoration-underline mb-2">Resumen de la Compra</h5>
                    <ul class="list-unstyled small mb-3">
                        ${orderData.items.map(item => `
                            <li>${item.quantity}x ${item.name} (${item.size}) - $${(item.price * item.quantity).toFixed(2)} MXN</li>
                        `).join('')}
                    </ul>
                    <hr>
                    <div class="d-flex justify-content-between fw-bold">
                        <span>SUBTOTAL:</span>
                        <span>$${orderData.totals.subtotal.toFixed(2)} MXN</span>
                    </div>
                    <div class="d-flex justify-content-between">
                        <span>ENVÍO:</span>
                        <span>GRATIS</span>
                    </div>
                    <div class="d-flex justify-content-between fw-bold fs-5 text-success mt-2">
                        <span>TOTAL PAGADO:</span>
                        <span>$${orderData.totals.total.toFixed(2)} MXN</span>
                    </div>
                </div>
            </div>
            
            <div class="text-center mt-3">
                <a href="/html/productList.html" class="btn btn-lg btn-success mt-4">Seguir Comprando</a>
            </div>
        </div>
    `;

    summaryContainer.innerHTML = orderSummaryHTML;

    // --- 3. Clean up and Finalize ---

    // 3a. Clear the shopping cart
    localStorage.removeItem('cart');

    // 3b. Remove temporary order data (it's no longer needed after displaying)
    localStorage.removeItem('currentOrderData'); 

    // 4. Simulate email dispatch
    simulateEmailDispatch(orderData.shipping.email, orderData);
});

/**
 * Generates a simple, unique order ID based on the current time.
 * @returns {string} The formatted order ID.
 */
function generateOrderId() {
    const timestamp = new Date().getTime();
    return `ORD-${timestamp.toString().slice(-6)}`;
}

/**
 * Simulates sending a confirmation email (in a real app, this would be an API call).
 * @param {string} email - The customer's email address.
 * @param {object} order - The complete order data.
 */
function simulateEmailDispatch(email, order) {
    console.log(`--- SIMULACIÓN DE ENVÍO DE CORREO ---`);
    console.log(`TO: ${email}`);
    console.log(`ASUNTO: Confirmación de Pedido Exitoso`);
    console.log(`RESUMEN:`);
    console.log(`Total: $${order.totals.total.toFixed(2)} MXN`);
    console.log(`Destino: ${order.shipping.address}, ${order.shipping.city}`);
    console.log(`Detalles del pedido enviado con éxito.`);
    console.log(`-------------------------------------`);
}
