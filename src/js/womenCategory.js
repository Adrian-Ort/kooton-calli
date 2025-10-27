// Función para probar la conexión con el backend
async function testBackendConnection() {
    try {
        console.log('🔍 Probando conexión con el backend...');
        
        const testResponse = await fetch(PRODUCTS_ENDPOINT);
        console.log('Status del backend:', testResponse.status);
        console.log('URL del backend:', PRODUCTS_ENDPOINT);
        
        if (testResponse.ok) {
            const data = await testResponse.json();
            console.log('Backend conectado. Productos recibidos:', data.length);
            return true;
        } else {
            console.error('Error del backend:', testResponse.status);
            return false;
        }
    } catch (error) {
        console.error('Error de conexión con el backend:', error);
        return false;
    }
}

// Modifica initialize para incluir la prueba:
async function initialize() {
    try {
        console.log('Inicializando página de mujeres...');
        
        // Probar conexión primero
        const isConnected = await testBackendConnection();
        if (!isConnected) {
            throw new Error('No se pudo conectar con el backend');
        }
        
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        console.log('DOM listo, cargando productos...');
        await loadFeaturedProducts();
        console.log('Página inicializada correctamente');
        
    } catch (error) {
        console.error('Error durante inicialización:', error);
        
        // Mostrar error en la página
        const containers = ['carousel-inner-desktop', 'carousel-inner-mobile'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center p-5">
                                <p class="text-danger">Error de conexión: ${error.message}</p>
                                <button onclick="location.reload()" class="btn btn-primary mt-2">Reintentar</button>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }
}

// ----> womenCategory.js <-----

// 1. PRIMERO: Configuración de API (constantes)
const API_BASE_URL = 'https://kooton-calli.duckdns.org/api/v1';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
const INVENTORY_ENDPOINT = `${API_BASE_URL}/inventories`;

// 2. SEGUNDO: Función para combinar productos con precios
function combineProductsWithPrices(products, inventories) {
    const priceMap = new Map();
    const stockMap = new Map();
    
    inventories.forEach(inventory => {
        if (inventory.idProduct && inventory.productPrice) {
            const productId = inventory.idProduct;
            if (!priceMap.has(productId)) {
                priceMap.set(productId, inventory.productPrice);
            }
            const currentStock = stockMap.get(productId) || 0;
            stockMap.set(productId, currentStock + (inventory.quantity || 0));
        }
    });

    return products.map(product => {
        const price = priceMap.get(product.id) || 0;
        const stock = stockMap.get(product.id) || 0;
        
        // Manejo mejorado de imágenes
        let imageUrl = product.imgUrl || '/img/products-images/default-product.png';
        
        if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
            imageUrl = '/' + imageUrl;
        }
        
        return {
            id: product.id,
            name: product.name,
            subcategory: product.subcategory,
            category: product.category,
            description: product.description,
            imgUrl: imageUrl,
            price: parseFloat(price),
            stock: stock,
            available: stock > 0
        };
    });
}

// 3. TERCERO: Función para generar el carrusel
function generateCarousel(products, containerId, itemsPerSlide) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
    container.innerHTML = '';
    
    if (products.length === 0) {
        container.innerHTML = `
            <div class="carousel-item active">
                <div class="row justify-content-center">
                    <div class="col-12 text-center p-5">
                        <p class="text-muted">No hay productos disponibles</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }
    
    // Dividir productos en grupos
    const slides = [];
    for (let i = 0; i < products.length; i += itemsPerSlide) {
        slides.push(products.slice(i, i + itemsPerSlide));
    }
    
    console.log(`Generando ${slides.length} slides para ${containerId}`);
    
    // Generar HTML para cada slide
    slides.forEach((slideProducts, index) => {
        const isActive = index === 0 ? 'active' : '';
        
        let slideHTML = `
            <div class="carousel-item ${isActive}">
                <div class="row g-3 justify-content-center align-items-stretch">
        `;
        
        slideProducts.forEach(product => {
            const colClass = itemsPerSlide === 5 
                ? 'col-lg-5col col-md-4 col-sm-6' 
                : 'col-12';
            
            const stockBadge = product.available 
                ? '' 
                : '<span class="badge bg-danger position-absolute top-0 end-0 m-2">Sin stock</span>';
            
            slideHTML += `
                <div class="${colClass} d-flex justify-content-center">
                    <div class="card h-100 w-100 shadow-lg border-2 rounded-4 d-flex flex-column featured-product-card position-relative">
                        ${stockBadge}
                        <div class="card-img-container p-3 d-flex align-items-center justify-content-center">
                            <img src="${product.imgUrl}" 
                                 class="img-fluid rounded-4 product-carousel-image" 
                                 alt="${product.name}"
                                 onerror="this.onerror=null; this.src='/img/products-images/default-product.png'">
                        </div>
                        <div class="card-body text-center d-flex flex-column p-3">
                            <h5 class="card-title flex-grow-0">${product.name}</h5>
                            <p class="text-muted small mb-1">${product.subcategory}</p>
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

// 4. CUARTO: Función principal que carga los productos
async function loadFeaturedProducts() {
    try {
        console.log('Cargando productos destacados...');
        
        // Cargar productos
        const productsResponse = await fetch(PRODUCTS_ENDPOINT);
        if (!productsResponse.ok) {
            throw new Error(`Error productos: ${productsResponse.status}`);
        }
        const products = await productsResponse.json();
        console.log('Productos recibidos:', products);

        // Cargar inventarios
        const inventoryResponse = await fetch(INVENTORY_ENDPOINT);
        if (!inventoryResponse.ok) {
            throw new Error(`Error inventarios: ${inventoryResponse.status}`);
        }
        const inventories = await inventoryResponse.json();
        console.log('Inventarios recibidos:', inventories);

        // Combinar datos
        const allProducts = combineProductsWithPrices(products, inventories);
        
        // Filtrar productos de mujer
        const womenProducts = allProducts.filter(product => 
            product.category === "Mujer" && product.available
        );
        
        console.log('Productos de mujer con stock:', womenProducts);
        
        const productsToShow = womenProducts.length > 0 
            ? womenProducts 
            : allProducts.filter(p => p.category === "Mujer");
        
        const featuredProducts = productsToShow.slice(0, 10);
        
        console.log('Productos para carrusel:', featuredProducts);
        
        if (featuredProducts.length === 0) {
            throw new Error('No se encontraron productos para mostrar');
        }
        
        // Generar carruseles
        generateCarousel(featuredProducts, 'carousel-inner-desktop', 5);
        generateCarousel(featuredProducts, 'carousel-inner-mobile', 1);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        // Mostrar error en los contenedores
        const containers = ['carousel-inner-desktop', 'carousel-inner-mobile'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center p-5">
                                <p class="text-muted">Error: ${error.message}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }
}

// 5. QUINTO: Función initialize (la que se ejecuta al cargar la página)

async function initialize() {
    try {
        console.log('Inicializando página de mujeres...');
        
        // Esperar a que el DOM esté completamente listo
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }
        
        console.log('DOM listo, cargando productos...');
        await loadFeaturedProducts();
        console.log('Página inicializada correctamente');
        
    } catch (error) {
        console.error('Error durante inicialización:', error);
    }
}

// 6. SEXTO: Ejecutar la inicialización
initialize();