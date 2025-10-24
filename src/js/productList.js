/**
 * Product Listing Logic and Filtering
 */

let allProducts = []; // This will store the combined product/inventory data

document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayProducts();
});

/**
 * Fetches product and inventory data, combines them,
 * and then displays them.
 */
async function loadAndDisplayProducts() {
    const PRODUCTS_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/products';
    const INVENTORY_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/inventories';

    try {
        // 1. Fetch both data sources
        const [productResponse, inventoryResponse] = await Promise.all([
            fetch(PRODUCTS_ENDPOINT),
            fetch(INVENTORY_ENDPOINT)
        ]);

        if (!productResponse.ok || !inventoryResponse.ok) {
            throw new Error('Failed to fetch data from one or more endpoints.');
        }

        const products = await productResponse.json();
        const inventories = await inventoryResponse.json();

        // 2. Create a price map
        const priceMap = new Map();
        inventories.forEach(inv => {
            priceMap.set(inv.idProduct, inv.productPrice);
        });

        // 3. Combine products with their prices
        const combinedProducts = products.map(product => {
            const price = priceMap.get(product.id) || 0; // Default to 0
            return {
                ...product, // (id, name, imgUrl, description, category, subcategory)
                price: price // Add the price
            };
        });
        
        // 4. Store the combined list
        allProducts = combinedProducts;

        // 5. Setup filters and display products
        setupFilters(allProducts);
        displayProducts(allProducts); 

    } catch (error) {
        console.error("ERROR al cargar y combinar productos:", error);
        const container = document.getElementById('product-list-container');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-danger text-center">No se pudieron cargar los productos.</p></div>';
        }
    }
}

function setupFilters(products) {
    const filterContainer = document.getElementById('subcategory-filter-container');
    if (!filterContainer) return;
    
    const subcategories = [...new Set(products.map(product => product.subcategory))].sort();

    filterContainer.innerHTML = ''; // Clear existing

    filterContainer.innerHTML += `
        <div class="form-check">
            <input class="form-check-input subcategory-checkbox" type="checkbox" value="all" id="check-all" checked>
            <label class="form-check-label fw-bold" for="check-all">Ver Todo</label>
        </div>
        <hr class="my-2">
    `;

    subcategories.forEach(subcat => {
        const subcatId = subcat.replace(/[^a-zA-Z0-9]/g, '-');
        
        filterContainer.innerHTML += `
            <div class="form-check">
                <input class="form-check-input subcategory-checkbox" type="checkbox" value="${subcat}" id="check-${subcatId}" checked>
                <label class="form-check-label" for="check-${subcatId}">${subcat}</label>
            </div>
        `;
    });
    
    document.querySelectorAll('.subcategory-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

function handleFilterChange(event) {
    const checkboxes = document.querySelectorAll('.subcategory-checkbox');
    const checkAll = document.getElementById('check-all');
    
    if (event.target === checkAll) {
        checkboxes.forEach(cb => {
            if (cb !== checkAll) {
                cb.checked = checkAll.checked;
            }
        });
    } else {
        const allOthersChecked = [...checkboxes].slice(1).every(cb => cb.checked);
        checkAll.checked = allOthersChecked;
    }
    
    const selectedSubcategories = [...checkboxes]
        .filter(cb => cb.checked && cb.value !== 'all')
        .map(cb => cb.value);

    let productsToDisplay = [];

    if (selectedSubcategories.length === 0) {
        productsToDisplay = [];
    } else {
        productsToDisplay = allProducts.filter(product => 
            selectedSubcategories.includes(product.subcategory)
        );
    }

    displayProducts(productsToDisplay);
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById('product-list-container');
    container.innerHTML = '';

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center fw-bold text-muted p-5 border rounded-3 bg-white shadow-sm">No se encontraron productos que coincidan con los filtros seleccionados.</p></div>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCardHTML = `
            <div class="col-md-4 col-sm-6">
                <div class="card h-100 shadow-lg border-2 rounded-4">
                    <div class="p-3">
                        <img src="/img/products-images/${product.imgUrl}" class="img-fluid rounded-4" alt="Image of ${product.name}">
                    </div>
                    <div class="card-body text-center d-flex flex-column p-2">
                        <h5 class="card-title">${product.name}</h5>
                        
                        <p class="fw-bold mt-auto">$${(product.price || 0).toFixed(2)} MXN</p>
                        
                        <a href="/html/product.html?id=${product.id}" class="d-grid product-link">
                            <button type="button" class="fw-bold rounded-pill p-1 w-100 shadow-sm button__product">
                                Ver Producto
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML += productCardHTML;
    });
}