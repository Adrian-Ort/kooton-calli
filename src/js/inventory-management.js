const endPointInventory = 'https://kooton-calli.duckdns.org/api/v1/inventories';
const endPointProducts = 'https://kooton-calli.duckdns.org/api/v1/products';

// Global variable to store the combined data
let allInventoryData = [];

/**
 * Fetches data from BOTH endpoints and combines them.
 * (Products for name/description, Inventories for price/quantity)
 */
async function fetchCombinedData() {
    try {
        const [productResponse, inventoryResponse] = await Promise.all([
            fetch(endPointProducts),
            fetch(endPointInventory)
        ]);

        if (!productResponse.ok || !inventoryResponse.ok) {
            throw new Error('Error fetching data from one or more endpoints');
        }

        const products = await productResponse.json();
        const inventories = await inventoryResponse.json();

        // Create a lookup map for product details (using 'id' from product list)
        const productMap = new Map();
        products.forEach(p => {
            productMap.set(p.id, p); 
        });

        // Combine the data
        const combinedData = inventories.map(inv => {
            // Use 'inv.idProduct' to find the matching product details
            const productDetails = productMap.get(inv.idProduct) || {}; 
            return {
                ...inv,           // Inventory fields (id, productPrice, quantity, etc.)
                ...productDetails // Product fields (name, imgUrl, description, etc.)
            };
        });
        
        return combinedData;

    } catch (error) {
        console.error("Error fetching combined data: ", error);
        throw error;
    }
}

/**
 * Loads the combined data and populates the table.
 */
async function loadTable() {
    try {
        // Fetch and store the combined data globally
        allInventoryData = await fetchCombinedData(); 
        
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) {
            console.error("No se encontró tableBody en loadTable");
            return;
        }
        
        // Limpia la tabla
        tableBody.innerHTML = '';
        
        // Itera sobre la data combinada
        allInventoryData.forEach(item => addRow(item));

    } catch(error) {
        console.error("Error cargando la tabla: ", error);
    }
}

/**
 * Adds a single row to the table using the combined (flat) object.
 */
function addRow(item) {
    const tableBody = document.getElementById('tableBody');
    if (!tableBody) {
        console.error("No se puede agregar fila tableBody no encontrado");
        return;
    }

    const tr = document.createElement("tr"); 
    
    // We use the flat properties from the combined object (e.g., item.name, item.productPrice)
    tr.innerHTML = `
        <td>${item.idProduct || 'N/A'}</td>
        <td>${item.name || 'N/A'}</td>
        <td>$${Number(item.productPrice || 0).toFixed(2)}</td>
        <td>
            ${item.imgUrl 
                ? `<img src="/img/products-images/${item.imgUrl}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;">`
                : 'Sin imagen'
            }
        </td>
        <td>${item.description || 'Sin descripción'}</td>
        <td>${item.quantity || 0}</td>
        <td>${item.productSize || 'N/A'}</td>
        <td>
            <button 
                class="btn btn-sm btn-primary btn-edit-inventory" 
                data-bs-toggle="modal" 
                data-bs-target="#editModal"
                data-id="${item.id}" 
                data-product-id="${item.idProduct}"
                data-name="${item.name || ''}"
                data-price="${item.productPrice || ''}"
                data-description="${item.description || ''}"
                data-quantity="${item.quantity || ''}"
                data-size="${item.productSize || ''}"
                data-barcode="${item.barCode || ''}"
            >
                Editar
            </button>
            <button 
                class="btn btn-sm btn-delete-inventory" 
                data-action="delete" 
                data-id="${item.id}"
            >
                Eliminar
            </button>
        </td>
    `;
    tableBody.appendChild(tr);
}

/**
 * Deletes an inventory item by its ID.
 */
async function deleteItem(id) {
    if (!confirm(`¿Deseas eliminar el item de inventario con el ID: ${id}?`)) {
        return;
    }
    try {
        const response = await fetch(`${endPointInventory}/${id}`, {
            method: 'DELETE',
        });

        // 204 No Content is also a success
        if (response.ok || response.status === 204) {
            await loadTable(); // Recargar la tabla
        } else {
            alert("Error al eliminar el producto");
        }
    } catch (error) {
        console.error("Error eliminando item: ", error)
        alert('Error al eliminar el producto')
    }
}

/**
 * Searches the globally stored data by barcode without re-fetching.
 */
function searchByBarcode(barcode) {
    const filteredData = allInventoryData.filter(item => 
        item.barCode && item.barCode.toString().includes(barcode)
    );
    
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = '';
    
    if (filteredData.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron productos</td></tr>';
    } else {
        filteredData.forEach(item => addRow(item));
    }
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', function() {
    // Referencias
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    const tableBody = document.getElementById('tableBody');
    const searchButton = document.querySelector('.container-busqueda-inventory button');
    const searchInput = document.querySelector('.container-busqueda-inventory input');
    const editModal = document.getElementById('editModal');

    if (!tableBody) {
        console.error("CRITICAL: tableBody not found.");
        return;
    }
    
    // Evento para botones de la tabla (ELIMINAR)
    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action="delete"]');
        if (btn) {
            const id = btn.dataset.id;
            deleteItem(id);
        }
    });

    // Evento para búsqueda
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const barcode = searchInput.value.trim();
            if (barcode) {
                searchByBarcode(barcode);
            } else {
                // Recargar tabla completa si no hay búsqueda
                tableBody.innerHTML = '';
                allInventoryData.forEach(item => addRow(item));
            }
        });

        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // --- CORRECTION: Evento para el formulario de AGREGAR (TWO-STEP POST) ---
    if (addForm) {
        addForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Product Data (for /api/v1/products)
            const productData = {
                name: document.getElementById('addName').value,
                description: document.getElementById('addDescription').value,
                category: document.getElementById('addCategory').value,
                subcategory: document.getElementById('addSubcategory').value,
                imgUrl: document.getElementById('addImgUrl').value // Make sure this input exists in HTML!
            };

            // Inventory Data (for /api/v1/inventories)
            const inventoryData = {
                productPrice: parseFloat(document.getElementById('addPrice').value),
                quantity: parseInt(document.getElementById('addQuantity').value),
                productSize: document.getElementById('addSize').value,
                barCode: document.getElementById('addBarcode').value
            };

            try {
                // 1. POST to /products to create the product and get its ID
                const productResponse = await fetch(endPointProducts, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                if (!productResponse.ok) {
                    throw new Error('Error al crear el producto (Server Error: ' + productResponse.statusText + ')');
                }

                const newProduct = await productResponse.json();
                const newProductId = newProduct.id; // Get the new autogenerated ID

                // 2. POST to /inventories using the new Product ID
                const inventoryPayload = {
                    ...inventoryData,
                    idProduct: newProductId // Link the inventory item to the new product
                };

                const inventoryResponse = await fetch(endPointInventory, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(inventoryPayload)
                });

                if (!inventoryResponse.ok) {
                    throw new Error('Error al crear el inventario (Server Error: ' + inventoryResponse.statusText + ')');
                }

                // Success
                await loadTable(); 
                
                addForm.reset();
                const addModalEl = document.getElementById('addModal');
                const modal = bootstrap.Modal.getInstance(addModalEl);
                modal.hide();
                
            } catch (error) {
                console.error("Error al agregar item:", error);
                alert('Error al agregar el item. Revisa la consola para más detalles.');
            }
        });
    }

    // Evento para el formulario de EDITAR (PUT)
    if (editForm) {
        editForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // The ID of the inventory item being updated
            const inventoryId = document.getElementById('editId').value;
            
            // Only update INVENTORY fields
            const updatedInventoryItem = {
                idProduct: parseInt(document.getElementById('editProductId').value),
                productPrice: parseFloat(document.getElementById('editPrice').value),
                quantity: parseInt(document.getElementById('editQuantity').value),
                productSize: document.getElementById('editSize').value,
                barCode: document.getElementById('editBarcode').value
            };

            try {
                const response = await fetch(`${endPointInventory}/${inventoryId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedInventoryItem)
                });
                if (!response.ok) throw new Error('Error al actualizar');

                await loadTable(); // Recargar

                const editModalEl = document.getElementById('editModal');
                const modal = bootstrap.Modal.getInstance(editModalEl);
                modal.hide();

            } catch (error) {
                console.error("Error al editar item:", error);
                alert('Error al editar item.');
            }
        });
    }

    // Evento para el modal de edición (cargar datos en el formulario)
    if (editModal) {
        editModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;

            // Obtener datos del botón (Data-attributes set in addRow)
            const id = button.getAttribute('data-id');
            const productId = button.getAttribute('data-product-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const description = button.getAttribute('data-description');
            const quantity = button.getAttribute('data-quantity');
            const size = button.getAttribute('data-size');
            const barcode = button.getAttribute('data-barcode');

            // Llenar el formulario con los datos
            document.getElementById('editId').value = id;
            document.getElementById('editProductId').value = productId;
            document.getElementById('editName').value = name || ''; 
            document.getElementById('editDescription').value = description || ''; 
            document.getElementById('editPrice').value = price || '';
            document.getElementById('editQuantity').value = quantity || '';
            document.getElementById('editSize').value = size || '';
            document.getElementById('editBarcode').value = barcode || '';
        });
    }

    // Cargar la tabla inicial
    loadTable();
});