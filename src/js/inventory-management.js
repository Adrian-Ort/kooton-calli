import ItemsController from "./itemsController";

//const tableBody = document.getElementById('tableBody');

async function loadTable(){
    try{
        const itemsController = new ItemsController();
        //await espera a que carguen todos los productos
        await itemsController.loadInitialItems();

        //Obtener tableBody dentro de la funcion
        const tableBody = document.getElementById('tableBody');

        if (!tableBody) {
            console.error("No se encontró tableBody en loadTable");
            return;
        }
        
        // Limpia la tabla antes de agregar items
        tableBody.innerHTML = '';
        
        itemsController.items.forEach(item => addRow(item));
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

    const tr = document.createElement("tr"); 
    tr.innerHTML = `<td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    <td>${item.img}</td> <!-- Corregido: quité el $ -->
    <td>${item.description}</td> <!-- Corregido: quité el $ -->
    <td>${item.category}</td>
    <td>${item.subcategory}</td>
    <td>
      <button 
        class="btn btn-sm btn-primary" 
        data-bs-toggle="modal" 
        data-bs-target="#editModal"
        data-id="${item.id}"
        data-name="${item.name}"
        data-price="${item.price}"
        data-description="${item.description}"
        data-category="${item.category}"
        data-subcategory="${item.subcategory}"
      >Editar
      </button>
      <button 
        class="btn btn-sm btn-danger" 
        data-action="delete" 
        data-id="${item.id}"
      >Eliminar
      </button>
    </td>`;
    tableBody.appendChild(tr);
}

// Función eliminar
function deleteItem(id) {
    const tableBody = document.getElementById('tableBody');
    if(!tableBody){
        console.error("No se peude eliminar tableBody no econtrado");
        return;
    }

    if (confirm(`¿Deseas eliminar el producto con el id: ${id}?`)) {
        const row = Array.from(tableBody.children).find(r => r.children[0].textContent === id);
        if (row) tableBody.removeChild(row);
    }
}

// SOLO UN DOMContentLoaded
document.addEventListener('DOMContentLoaded', function(){
    // Referencias a los elementos
    const addForm = document.getElementById('addForm');
    const tableBody = document.querySelector('tbody');
    const editModal = document.getElementById('editModal');

    // Verifica que cada elemento exista antes, formulari y la tabla
    if(!addForm){
        console.error("No se encontró el formulario addForm");
    }
    if(!tableBody){
        console.error("No se encontró la tabla tableBody");
        return;
    }

    // Evento CORRECTO para botones de la tabla (ELIMINAR/EDITAR)
    tableBody.addEventListener('click', (e) =>{
        const btn = e.target.closest('button[data-action]');
        if(!btn) return;
        
        const id = btn.dataset.id;
        if(btn.dataset.action === 'delete'){
            deleteItem(id);
        }
        // El botón de editar ya funciona automáticamente por data-bs-toggle
    });

    // Evento CORRECTO para el formulario de AGREGAR
    addForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Generar ID único
        const newId = Date.now().toString();

        // Obtener valores del formulario
        const name = document.getElementById('addName').value;
        const price = document.getElementById('addPrice').value;
        const description = document.getElementById('addDescription').value;
        const category = document.getElementById('addCategory').value;
        const subcategory = document.getElementById('addSubcategory').value;

        const newItem = {
            id: newId,
            name: name,
            price: price,
            img: "placeholder.png",
            description: description,
            category: category,
            subcategory: subcategory
        };

        // Agregar a la tabla
        addRow(newItem);

        // Limpiar formulario y cerrar modal
        addForm.reset();
        const addModalEl = document.getElementById('addModal');
        const modal = bootstrap.Modal.getInstance(addModalEl);
        modal.hide();
    });

    // Evento para el modal de edición
    if(editModal){
        editModal.addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget;

            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            const description = button.getAttribute('data-description');
            const category = button.getAttribute('data-category');
            const subcategory = button.getAttribute('data-subcategory');

            document.getElementById('editId').value = id;
            document.getElementById('editName').value = name;
            document.getElementById('editPrice').value = price;
            document.getElementById('editDescription').value = description;
        });
    }

    // Cargar la tabla inicial (con paréntesis)
    loadTable();
});