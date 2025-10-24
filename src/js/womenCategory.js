/**
 * Carrusel de productos destacados y subcategorías para womenCategory.html - CON BACKEND
 */

const API_BASE_URL = 'https://kootoncalli.duckdns.org/api/v1';
const PRODUCTS_ENDPOINT = `${API_BASE_URL}/products`;
const INVENTORY_ENDPOINT = `${API_BASE_URL}/inventories`;

/**
 * Carga las subcategorías dinámicamente desde el backend
 */
async function loadSubcategories() {
    try {
        console.log('Cargando subcategorías desde el backend...');
        
        // Cargar productos para obtener las subcategorías únicas
        const productsResponse = await fetch(PRODUCTS_ENDPOINT);
        if (!productsResponse.ok) {
            throw new Error(`Error al cargar productos: ${productsResponse.status}`);
        }
        
        const products = await productsResponse.json();
        
        // Filtrar productos de categoría "Mujer" y obtener subcategorías únicas
        const womenProducts = products.filter(product => product.category === "Mujer");
        const subcategories = [...new Set(womenProducts.map(p => p.subcategory))];
        
        console.log('Subcategorías encontradas:', subcategories);
        
        // Mapeo de subcategorías a imágenes
        const subcategoryImages = {
            'Camisas': {
                desktop: '/img/products-images/woman-category-t-shirts.png',
                mobile: '/img/products-images/woman-category-t-shirts-mobil.png'
            },
            'Suéteres': {
                desktop: '/img/products-images/woman-category-sweater.png',
                mobile: '/img/products-images/woman-category-sweater-mobil.png'
            },
            'Faldas': {
                desktop: '/img/products-images/woman-category-bottom.png',
                mobile: '/img/products-images/woman-category-bottom-mobil.png'
            },
            'Pantalones': {
                desktop: '/img/products-images/woman-category-bottom.png',
                mobile: '/img/products-images/woman-category-bottom-mobil.png'
            }
        };
        
        // Generar subcategorías dinámicamente
        generateSubcategoriesDesktop(subcategories, subcategoryImages);
        generateSubcategoriesMobile(subcategories, subcategoryImages);
        
    } catch (error) {
        console.error('Error loading subcategories:', error);
    }
}

/**
 * Genera las subcategorías para desktop
 */
function generateSubcategoriesDesktop(subcategories, images) {
    const container = document.querySelector('#subcategories .d-none.d-md-block .row');
    if (!container) return;
    
    container.innerHTML = '';
    
    subcategories.forEach(subcategory => {
        const imageData = images[subcategory] || {
            desktop: '/img/products-images/default-category.png'
        };
        
        const col = document.createElement('div');
        col.className = 'col-lg-4 col-md-4 col-sm-4';
        col.innerHTML = `
            <a href="productList.html?category=Mujer&subcategory=${encodeURIComponent(subcategory)}">
                <img src="${imageData.desktop}" class="subcategory-image img-fluid w-100" alt="${subcategory}">
            </a>
        `;
        
        container.appendChild(col);
    });
}

/**
 * Genera las subcategorías para mobile (carrusel)
 */
function generateSubcategoriesMobile(subcategories, images) {
    const carouselInner = document.querySelector('#subcategoriesCarousel .carousel-inner');
    if (!carouselInner) return;
    
    carouselInner.innerHTML = '';
    
    subcategories.forEach((subcategory, index) => {
        const imageData = images[subcategory] || {
            mobile: '/img/products-images/default-category.png'
        };
        
        const item = document.createElement('div');
        item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
        item.innerHTML = `
            <a href="productList.html?category=Mujer&subcategory=${encodeURIComponent(subcategory)}">
                <img src="${imageData.mobile}" class="d-block w-100" alt="${subcategory}">
            </a>
        `;
        
        carouselInner.appendChild(item);
    });
}

/**
 * Carga y muestra productos destacados en el carrusel
 */
async function loadFeaturedProducts() {
    try {
        console.log('Cargando productos destacados desde el backend...');
        
        // 1. Cargar productos desde el backend
        const productsResponse = await fetch(PRODUCTS_ENDPOINT);
        if (!productsResponse.ok) {
            throw new Error(`Error al cargar productos: ${productsResponse.status}`);
        }
        
        const products = await productsResponse.json();

        // 2. Cargar inventarios para obtener precios
        const inventoryResponse = await fetch(INVENTORY_ENDPOINT);
        if (!inventoryResponse.ok) {
            throw new Error(`Error al cargar inventarios: ${inventoryResponse.status}`);
        }
        
        const inventories = await inventoryResponse.json();

        // 3. Combinar productos con precios
        const allProducts = combineProductsWithPrices(products, inventories);
        
        // Filtrar productos de categoría "Mujer"
        const womenProducts = allProducts.filter(product => 
            product.category === "Mujer"
        );
        
        // Tomar los primeros 10 productos para tener suficientes
        const featuredProducts = womenProducts.slice(0, 10);
        
        console.log('Productos destacados para carrusel:', featuredProducts);
        
        // Generar el carrusel para desktop (5 productos por slide)
        generateCarousel(featuredProducts, 'carousel-inner-desktop', 5);
        
        // Generar el carrusel para mobile (1 producto por slide)
        generateCarousel(featuredProducts, 'carousel-inner-mobile', 1);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        // Mostrar mensaje de error en los carruseles
        const containers = ['carousel-inner-desktop', 'carousel-inner-mobile'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = `
                    <div class="carousel-item active">
                        <div class="row justify-content-center">
                            <div class="col-12 text-center p-5">
                                <p class="text-muted">Error al cargar productos: ${error.message}</p>
                            </div>
                        </div>
                    </div>
                `;
            }
        });
    }
}

/**
 * Combina productos con precios del inventario
 */
function combineProductsWithPrices(products, inventories) {
    const priceMap = new Map();
    
    // Crear un mapa de precios por producto
    inventories.forEach(inventory => {
        if (inventory.idProduct && inventory.productPrice) {
            if (!priceMap.has(inventory.idProduct)) {
                priceMap.set(inventory.idProduct, inventory.productPrice);
            }
        }
    });

    // Combinar productos con sus precios
    return products.map(product => {
        const price = priceMap.get(product.id) || 0;
        const imageUrl = product.imgUrl || `/img/products-images/default-product.png`;
        
        return {
            id: product.id,
            name: product.name,
            subcategory: product.subcategory,
            category: product.category,
            description: product.description,
            img: imageUrl,
            imgUrl: imageUrl,
            price: parseFloat(price)
        };
    });
}

/**
 * Genera el carrusel de productos
 */
function generateCarousel(products, containerId, itemsPerSlide) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }
    
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
            const colClass = itemsPerSlide === 5 ? 'col-lg-5col' : `col-md-${12/itemsPerSlide}`;
            
            slideHTML += `
                <div class="${colClass} col-12 d-flex justify-content-center">
                    <div class="card h-100 w-100 shadow-lg border-2 rounded-4 d-flex flex-column featured-product-card">
                        <div class="card-img-container p-3 d-flex align-items-center justify-content-center">
                            <img src="${product.img}" 
                                 class="img-fluid rounded-4 product-carousel-image" 
                                 alt="Image of ${product.name}"
                                 onerror="this.src='/img/products-images/default-product.png'">
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

/**
 * Inicializa todas las funciones cuando el DOM esté listo
 */
async function initialize() {
    try {
        // Cargar subcategorías y productos en paralelo
        await Promise.all([
            loadSubcategories(),
            loadFeaturedProducts()
        ]);
        
        console.log('Página cargada exitosamente');
    } catch (error) {
        console.error('Error durante la inicialización:', error);
    }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', initialize);