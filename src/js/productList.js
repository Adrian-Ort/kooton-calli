// Espera a que todo el contenido del HTML esté cargado antes de ejecutar el script.
document.addEventListener('DOMContentLoaded', () => {
    // Llama a la función principal que cargará y mostrará los productos.
    loadAndDisplayProducts();
});

/**
 * Función asíncrona para obtener los datos de los productos desde el JSON
 * y mostrarlos en la página.
 */
async function loadAndDisplayProducts() {
    // 1. Selecciona el contenedor donde se insertarán las tarjetas de producto.
    const container = document.getElementById('product-list-container');
    if (!container) {
        console.error("Error: El contenedor de productos no fue encontrado.");
        return;
    }

    try {
        // 2. Realiza la petición para obtener el archivo JSON de productos.
        const response = await fetch('/data/items.json');
        const products = await response.json();

        // 3. Limpia el contenido actual del contenedor (las tarjetas de ejemplo).
        container.innerHTML = '';

        // 4. Itera sobre cada producto en el array obtenido del JSON.
        products.forEach(product => {
            // Crea el HTML para una tarjeta de producto usando una plantilla de texto.
            const productCardHTML = `
                <div class="col-md-4 col-sm-6">
                    <div class="card h-100 shadow-lg border-2 rounded-4">
                        <div class="p-3">
                            <img src="/img/products-images/${product.img}" class="img-fluid rounded-4" alt="Imagen de ${product.name}">
                        </div>
                        <div class="card-body text-center d-flex flex-column p-2">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="fw-bold mt-auto">$${product.price.toFixed(2)} MXN</p>
                            
                            <a href="/html/product.html?id=${product.id}" class="d-grid">
                                <button type="button" class="fw-bold rounded-pill p-1 w-100 shadow-sm button__product">
                                    Ver producto
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
            `;
            
            // 5. Añade la tarjeta recién creada al contenedor.
            container.innerHTML += productCardHTML;
        });

    } catch (error) {
        console.error("Error al cargar los productos:", error);
        container.innerHTML = '<p class="text-danger text-center">No se pudieron cargar los productos. Intenta de nuevo más tarde.</p>';
    }
}