/**
 * Carrusel de productos destacados para menCategory.html
 */

// Función para cargar y mostrar productos en el carrusel
async function loadFeaturedProducts() {
    try {
        const response = await fetch('/data/items.json');
        const allProducts = await response.json();
        
        // Filtrar productos de categoría "Hombre"
        const womenProducts = allProducts.filter(product => 
            product.category === "Hombre"
        );
        
        // Tomar los primeros 10 productos para tener suficientes
        const featuredProducts = womenProducts.slice(0, 10);
        
        // Generar el carrusel para desktop (5 productos por slide)
        generateCarousel(featuredProducts, 'carousel-inner-desktop', 5);
        
        // Generar el carrusel para mobile (1 producto por slide)
        generateCarousel(featuredProducts, 'carousel-inner-mobile', 1);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
    }
}

// Función para generar el carrusel
function generateCarousel(products, containerId, itemsPerSlide) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    
    // Dividir productos en grupos según itemsPerSlide
    const slides = [];
    for (let i = 0; i < products.length; i += itemsPerSlide) {
        slides.push(products.slice(i, i + itemsPerSlide));
    }
    
    // Generar HTML para cada slide
    slides.forEach((slideProducts, index) => {
        const isActive = index === 0 ? 'active' : '';
        
        let slideHTML = `
            <div class="carousel-item ${isActive}">
                <div class="row g-2 justify-content-center align-items-stretch">
        `;
        
        slideProducts.forEach(product => {
            // Para desktop (5 items), usar col-lg-2.4 (pero Bootstrap no soporta decimales)
            // Usaremos un cálculo manual con flexbox
            const colClass = itemsPerSlide === 5 ? 'col-lg-5col' : `col-md-${12/itemsPerSlide}`;
            
            slideHTML += `
                <div class="${colClass} col-12 d-flex justify-content-center">
                    <div class="card h-100 w-100 shadow-lg border-2 rounded-4 d-flex flex-column featured-product-card">
                        <div class="card-img-container p-3 d-flex align-items-center justify-content-center">
                            <img src="/img/products-images/${product.img}" 
                                 class="img-fluid rounded-4 product-carousel-image" 
                                 alt="Image of ${product.name}">
                        </div>
                        <div class="card-body text-center d-flex flex-column p-3">
                            <h5 class="card-title flex-grow-0">${product.name}</h5>
                            <p class="fw-bold mt-2 mb-3 flex-grow-0">$${product.price.toFixed(2)} MXN</p>
                            
                            <div class="mt-auto">
                                <a href="/html/product.html?id=${product.id}" class="d-grid product-link">
                                    <button type="button" class="fw-bold rounded-pill p-2 w-100 shadow-sm button__product">
                                        Ver Producto
                                    </button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        slideHTML += `
                </div>
            </div>
        `;
        
        container.innerHTML += slideHTML;
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadFeaturedProducts);