/**
 * Product Listing Logic and Filtering
 * Manages fetching products, setting up real-time subcategory filters (checkboxes),
 * and rendering the product list based on selections.
 */

// Global variable to store all products once loaded from the API.
let allProducts = [];

// --- Initialization ---

/**
 * Executes once the entire HTML document is fully loaded.
 * Initiates the product loading process.
 */
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayProducts();
    // Event listeners for checkboxes are added inside setupFilters() once elements exist.
});

// --- Data Fetching and Setup ---

/**
 * Fetches product and inventory data from the API endpoints, combines them,
 * stores the combined list globally, sets up filters, and displays the list.
 * @async
 */
async function loadAndDisplayProducts() {
    const PRODUCTS_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/products';
    const INVENTORY_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/inventories';

    try {
        // 1. Fetch both data sources in parallel
        const [productResponse, inventoryResponse] = await Promise.all([
            fetch(PRODUCTS_ENDPOINT),
            fetch(INVENTORY_ENDPOINT)
        ]);

        if (!productResponse.ok || !inventoryResponse.ok) {
            throw new Error('Failed to fetch data from one or more endpoints.');
        }

        const products = await productResponse.json();
        const inventories = await inventoryResponse.json();

        // 2. Create a fast lookup map for prices
        //    This assumes inventory has `id_product` and `product_price`
        const priceMap = new Map();
        inventories.forEach(inv => {
            // We store the price using the product ID (which is `id_product` in the inventory table)
            priceMap.set(inv.idProduct, inv.productPrice);
        });

        // 3. Combine products with their prices
        const combinedProducts = products.map(product => {
            // Get price from the map using the product's ID (which is `id` from the product list)
            const price = priceMap.get(product.id) || 0; 
            
            // Return a new object that includes the price
            return {
                ...product,  // (id, name, imgUrl, description, etc.)
                price: price // <-- Add the price
            };
        });
        
        // 4. Store the complete COMBINED list.
        allProducts = combinedProducts;

        // 5. Configure the subcategory filter sidebar.
        setupFilters(allProducts);
        
        // 6. Display all products initially.
        //    (displayProducts will now correctly find 'product.price')
        displayProducts(allProducts); 

    } catch (error) {
        console.error("ERROR al cargar y combinar productos:", error);
        const container = document.getElementById('product-list-container');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-danger text-center">No se pudieron cargar los productos. Por favor, inténtelo de nuevo más tarde.</p></div>';
        }
    }
}

/**
 * Generates subcategory checkboxes dynamically in the sidebar and attaches
 * change event listeners to them.
 * @param {Array<Object>} products - The complete list of products.
 */
function setupFilters(products) {
    const filterContainer = document.getElementById('subcategory-filter-container');
    
    // Get unique subcategories and sort them alphabetically.
    const subcategories = [...new Set(products.map(product => product.subcategory))].sort();

    // Clear the filter container content.
    filterContainer.innerHTML = '';

    // Add the "All Subcategories" checkbox.
    filterContainer.innerHTML += `
        <div class="form-check">
            <input class="form-check-input subcategory-checkbox" type="checkbox" value="all" id="check-all" checked>
            <label class="form-check-label fw-bold" for="check-all">Ver Todo</label>
        </div>
        <hr class="my-2">
    `;

    // Add individual subcategory checkboxes, checked by default.
    subcategories.forEach(subcat => {
        // Generate a clean ID (replaces non-alphanumeric characters with hyphens).
        const subcatId = subcat.replace(/[^a-zA-Z0-9]/g, '-');
        
        filterContainer.innerHTML += `
            <div class="form-check">
                <input class="form-check-input subcategory-checkbox" type="checkbox" value="${subcat}" id="check-${subcatId}" checked>
                <label class="form-check-label" for="check-${subcatId}">${subcat}</label>
            </div>
        `;
    });
    
    // Attach the filter handler to all generated checkboxes.
    document.querySelectorAll('.subcategory-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

// --- Filtering Logic ---

/**
 * Handles the change event from any subcategory checkbox.
 * Synchronizes the "All" checkbox state, determines the selected filters,
 * and calls displayProducts() with the filtered list.
 * @param {Event} event - The change event object.
 */
function handleFilterChange(event) {
    // 1. Get all checkboxes and the 'All' checkbox reference.
    const checkboxes = document.querySelectorAll('.subcategory-checkbox');
    const checkAll = document.getElementById('check-all');
    
    // Synchronization logic for the "All" checkbox
    if (event.target === checkAll) {
        // If "All" is toggled, toggle all others to match.
        checkboxes.forEach(cb => {
            if (cb !== checkAll) {
                cb.checked = checkAll.checked;
            }
        });
    } else {
        // If an individual checkbox is toggled, update "All" state accordingly.
        // Slice(1) excludes the 'check-all' element.
        const allOthersChecked = [...checkboxes].slice(1).every(cb => cb.checked);
        checkAll.checked = allOthersChecked;
    }
    
    // 2. Identify the currently selected subcategories.
    // Filter for checkboxes that are checked AND whose value is NOT 'all'.
    const selectedSubcategories = [...checkboxes]
        .filter(cb => cb.checked && cb.value !== 'all')
        .map(cb => cb.value);

    let productsToDisplay = [];

    if (selectedSubcategories.length === 0) {
        // If no subcategory is selected, show an empty list.
        productsToDisplay = [];
    } else {
        // Filter the global list based on the selected subcategories.
        productsToDisplay = allProducts.filter(product => selectedSubcategories.includes(product.subcategory));
    }

    // 3. Render the filtered results.
    displayProducts(productsToDisplay);
}


// --- Rendering ---

/**
 * Renders the product cards into the main container element.
 * @param {Array<Object>} productsToDisplay - The list of products (filtered or complete) to render.
 */
function displayProducts(productsToDisplay) {
    const container = document.getElementById('product-list-container');
    container.innerHTML = ''; // Clear the existing content.

    if (productsToDisplay.length === 0) {
        // Display a message if no products match the current filter.
        container.innerHTML = '<div class="col-12"><p class="text-center fw-bold text-muted p-5 border rounded-3 bg-white shadow-sm">No se encontraron productos que coincidan con los filtros seleccionados.</p></div>';
        return;
    }

    // 4. Iterate over the products and generate HTML for each card.
    //    We use the API property names: product.imgUrl, product.name, product.price, product.id
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
        
        // 5. Append the new card HTML to the container.
        container.innerHTML += productCardHTML;
    });
}