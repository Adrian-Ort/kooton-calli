const endPointInventory = 'https://kooton-calli.duckdns.org/api/v1/inventories';

import ItemsController from "./itemsController";

//funcion para llamar a la API y obtener los datos
async function fetchInventoryData() {
    try{
        const response = await fetch(endPointInventory);
        if(!response.ok){
            throw new Error(`Error HTTP: ${response.status}`)
    }
        const data = await response.json();
        return data;
    }catch(error){
        console.error("Error fetching inventory data: ", error);
        throw error;
    }
}


async function loadTable(){
    try{
        //await espera a que carguen todos los productos
        const inventoryData = await fetchInventoryData();
        //Obtener tableBody dentro de la funcion
        const tableBody = document.getElementById('tableBody');

        if (!tableBody) {
            console.error("No se encontró tableBody en loadTable");
            return;
        }
        
        // Limpia la tabla antes de agregar items
        tableBody.innerHTML = '';
        
        inventoryData.items.forEach(item => addRow(item));
    }catch(error){
        console.error("Error cargando la tabla: ", error);
    }
}

function addRow(item){
    const tableBody = document.getElementById('tableBody');

    if(!tableBody){
        console.error("No se puede agregar fila tableBody no encontrado");
        return;
    }

    //Se accede a los datos anidados
const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>${item.product?.id_product || 'N/A'}</td>
        <td>${item.product?.product_name || 'N/A'}</td>
        <td>$${item.product_price || '0.00'}</td>
        <td>
            ${item.product?.img_url 
                ? `<img src="${item.product.img_url}" alt="${item.product.product_name}" style="width: 50px; height: 50px; object-fit: cover;">`
                : 'Sin imagen'
            }
        </td>
        <td>${item.product?.description || 'Sin descripción'}</td>
        <td>${item.product?.category || 'N/A'}</td>
        <td>${item.product?.subcategory || 'N/A'}</td>
        <td>
            <button 
                class="btn btn-sm btn-edit-inventory" 
                data-bs-toggle="modal" 
                data-bs-target="#editModal"
                data-id="${item.id_inventory}"
                data-product-id="${item.product?.id_product}"
                data-name="${item.product?.product_name || ''}"
                data-price="${item.product_price || ''}"
                data-description="${item.product?.description || ''}"
                data-category="${item.product?.category || ''}"
                data-subcategory="${item.product?.subcategory || ''}"
                data-quantity="${item.quantity || ''}"
                data-size="${item.product_size || ''}"
                data-barcode="${item.bar_code || ''}"
            >
                Editar
            </button>
            <button 
                class="btn btn-sm btn-delete-inventory" 
                data-action="delete" 
                data-id="${item.id_inventory}"
            >
                Eliminar
            </button>
        </td>
    `;
    tableBody.appendChild(tr);
}



// Función eliminar
async function deleteItem(id) {

    if (!confirm(`¿Deseas eliminar el producto con el ID: ${id}?`)) {
        return;
    }
    try{
        const response = await fetch(`${endPointInventory}/${id}`,{
            method: 'DELETE',
        });

        if(response.ok){
            await loadTable();
        }else{
            alert("Error al eliminar el producto");
        }
    }catch (error){
        console.log.error("Error eliminando item: ", error)
        alert('Error al eliminar el producto')
    }
}

// Función para buscar por código de barras
async function searchByBarcode(barcode) {
    try {
        const inventoryData = await fetchInventoryData();
        const filteredData = inventoryData.filter(item => 
            item.bar_code && item.bar_code.toString().includes(barcode)
        );
        
        const tableBody = document.getElementById('tableBody');
        tableBody.innerHTML = '';
        
        if (filteredData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">No se encontraron productos</td></tr>';
        } else {
            filteredData.forEach(item => addRow(item));
        }
    } catch (error) {
        console.error("Error buscando producto:", error);
    }
}

// Evento cuando el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
    // Referencias a los elementos
    const addForm = document.getElementById('addForm');
    const editForm = document.getElementById('editForm');
    const tableBody = document.getElementById('tableBody');
    const searchButton = document.querySelector('.container-busqueda-inventory button');
    const searchInput = document.querySelector('.container-busqueda-inventory input');

    // Evento para botones de la tabla (ELIMINAR/EDITAR)
    tableBody.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-action]');
        if (!btn) return;
        
        const id = btn.dataset.id;
        if (btn.dataset.action === 'delete') {
            deleteItem(id);
        }
    });

    // Evento para búsqueda por código de barras
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', () => {
            const barcode = searchInput.value.trim();
            if (barcode) {
                searchByBarcode(barcode);
            } else {
                loadTable(); // Recargar tabla completa si no hay búsqueda
            }
        });

        // También buscar al presionar Enter
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }

    // Evento para el formulario de AGREGAR
    addForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Aquí necesitarías implementar la lógica para enviar datos a tu API
        // Por ahora solo mostraremos un mensaje
        alert('Función de agregar producto - Pendiente de implementar con tu API');
        
        // Limpiar formulario y cerrar modal
        addForm.reset();
        const addModalEl = document.getElementById('addModal');
        const modal = bootstrap.Modal.getInstance(addModalEl);
        modal.hide();
    });

    // Evento para el formulario de EDITAR
    editForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Aquí necesitarías implementar la lógica para actualizar datos en tu API
        alert('Función de editar producto - Pendiente de implementar con tu API');
        
        // Recargar tabla después de editar
        await loadTable();
        
        // Cerrar modal
        const editModalEl = document.getElementById('editModal');
        const modal = bootstrap.Modal.getInstance(editModalEl);
        modal.hide();
    });

    // Evento para el modal de edición (cargar datos en el formulario)
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;

            // Obtener datos del botón que abrió el modal
            const id = button.getAttribute('data-id');
            const productId = button.getAttribute('data-product-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const description = button.getAttribute('data-description');
            const category = button.getAttribute('data-category');
            const subcategory = button.getAttribute('data-subcategory');
            const quantity = button.getAttribute('data-quantity');
            const size = button.getAttribute('data-size');
            const barcode = button.getAttribute('data-barcode');

            // Llenar el formulario con los datos
            document.getElementById('editId').value = id;
            document.getElementById('editName').value = name || '';
            document.getElementById('editPrice').value = price || '';
            document.getElementById('editDescription').value = description || '';
            document.getElementById('editCategory').value = category || '';
            document.getElementById('editSubcategory').value = subcategory || '';
            
            // Puedes agregar más campos aquí según necesites
        });
    }

    // Cargar la tabla inicial
    loadTable();
});