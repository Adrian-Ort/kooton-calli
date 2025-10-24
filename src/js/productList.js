/**
 * Product Listing Logic and Filtering
 */

let allProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayProducts();
});

async function loadAndDisplayProducts() {
    try {
        const response = await fetch('/data/items.json');
        allProducts = await response.json();

        console.log('Total productos cargados:', allProducts.length); // DEBUG

        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        const subcategoryParam = urlParams.get('subcategory');
        
        console.log('Parámetros URL:', { categoryParam, subcategoryParam }); // DEBUG
        
        if (categoryParam || subcategoryParam) {
            handleCategoryParameters(categoryParam, subcategoryParam, allProducts);
        } else {
            setupFilters(allProducts);
            displayProducts(allProducts);
        }

    } catch (error) {
        console.error("ERROR al cargar productos:", error);
        const container = document.getElementById('product-list-container');
        if (container) {
            container.innerHTML = '<div class="col-12"><p class="text-danger text-center">No se pudieron cargar los productos.</p></div>';
        }
    }
}

function handleCategoryParameters(categoryParam, subcategoryParam, products) {
    let filteredProducts = products;
    
    console.log('Productos antes de filtrar:', filteredProducts.length); // DEBUG
    
    // First filter by category if specified
    if (categoryParam) {
        filteredProducts = filteredProducts.filter(product => 
            product.category === categoryParam
        );
        console.log('Productos después de filtrar por categoría:', filteredProducts.length); // DEBUG
    }
    
    // Then filter by subcategory if specified
    if (subcategoryParam) {
        const targetSubcategories = subcategoryParam.split(',');
        filteredProducts = filteredProducts.filter(product => 
            targetSubcategories.includes(product.subcategory)
        );
        console.log('Productos después de filtrar por subcategoría:', filteredProducts.length); // DEBUG
        console.log('Subcategorías objetivo:', targetSubcategories); // DEBUG
        console.log('Productos filtrados:', filteredProducts); // DEBUG
    }
    
    // Update page title and setup filters
    updatePageTitle(categoryParam, subcategoryParam);
    setupPreselectedFilters(allProducts, categoryParam, subcategoryParam, filteredProducts);
    
    // Display the filtered products
    displayProducts(filteredProducts);
}

function updatePageTitle(category, subcategories) {
    const titleElement = document.querySelector('h1');
    if (!titleElement) return;
    
    if (subcategories) {
        const subcatArray = subcategories.split(',');
        if (subcatArray.length === 1) {
            titleElement.textContent = subcatArray[0].toUpperCase();
        } else {
            titleElement.textContent = subcatArray.join(' & ').toUpperCase();
        }
    } else if (category) {
        titleElement.textContent = category.toUpperCase();
    }
}

/**
 * CORREGIDO: Esta función ahora recibe todos los parámetros necesarios
 */
function setupPreselectedFilters(allProducts, categoryParam, subcategoryParam, filteredProducts) {
    const filterContainer = document.getElementById('subcategory-filter-container');
    
    // Obtener subcategorías únicas de TODOS los productos (no solo los filtrados)
    // pero filtrando por categoría si existe
    let baseProducts = allProducts;
    if (categoryParam) {
        baseProducts = baseProducts.filter(product => product.category === categoryParam);
    }
    
    const availableSubcategories = [...new Set(baseProducts.map(product => product.subcategory))].sort();

    console.log('Subcategorías disponibles:', availableSubcategories); // DEBUG

    filterContainer.innerHTML = '';

    // Add the "All Subcategories" checkbox
    const allChecked = !subcategoryParam; // "Ver Todo" está checked si no hay subcategoría específica
    filterContainer.innerHTML += `
        <div class="form-check">
            <input class="form-check-input subcategory-checkbox" type="checkbox" value="all" id="check-all" ${allChecked ? 'checked' : ''}>
            <label class="form-check-label fw-bold" for="check-all">Ver Todo</label>
        </div>
        <hr class="my-2">
    `;

    // Add individual subcategory checkboxes
    availableSubcategories.forEach(subcat => {
        const subcatId = subcat.replace(/[^a-zA-Z0-9]/g, '-');
        const isChecked = subcategoryParam ? subcategoryParam.split(',').includes(subcat) : true;
        
        filterContainer.innerHTML += `
            <div class="form-check">
                <input class="form-check-input subcategory-checkbox" type="checkbox" value="${subcat}" id="check-${subcatId}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="check-${subcatId}">${subcat}</label>
            </div>
        `;
    });
    
    // Attach event listeners
    document.querySelectorAll('.subcategory-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

// Las demás funciones se mantienen igual
function setupFilters(products) {
    const filterContainer = document.getElementById('subcategory-filter-container');
    
    const subcategories = [...new Set(products.map(product => product.subcategory))].sort();

    filterContainer.innerHTML = '';

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
        const urlParams = new URLSearchParams(window.location.search);
        const categoryParam = urlParams.get('category');
        
        let baseProducts = allProducts;
        if (categoryParam) {
            baseProducts = baseProducts.filter(product => product.category === categoryParam);
        }
        
        productsToDisplay = baseProducts.filter(product => selectedSubcategories.includes(product.subcategory));
    }

    displayProducts(productsToDisplay);
}

function displayProducts(productsToDisplay) {
    const container = document.getElementById('product-list-container');
    container.innerHTML = '';

    console.log('Mostrando productos:', productsToDisplay); // DEBUG

    if (productsToDisplay.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center fw-bold text-muted p-5 border rounded-3 bg-white shadow-sm">No se encontraron productos que coincidan con los filtros seleccionados.</p></div>';
        return;
    }

    productsToDisplay.forEach(product => {
        const productCardHTML = `
            <div class="col-md-4 col-sm-6">
                <div class="card h-100 shadow-lg border-2 rounded-4">
                    <div class="p-3">
                        <img src="/img/products-images/${product.img}" class="img-fluid rounded-4" alt="Image of ${product.name}">
                    </div>
                    <div class="card-body text-center d-flex flex-column p-2">
                        <h5 class="card-title">${product.name}</h5>
                        
                        <p class="fw-bold mt-auto">$${product.price.toFixed(2)} MXN</p>
                        
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