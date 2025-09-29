import ItemsController from "./itemsController";

const tableBody = document.getElementById('tableBody');

async function loadTable(){
    try{
        const itemsController = new ItemsController();
        //await espera a que carguen todos los productos
        await itemsController.loadInitialItems();
        itemsController.items.forEach(item => addRow(item));
    }catch(error){
        console.erros("Error cargando la tabla: ", error);
    }
}

function addRow(item){
    const tr = document.createElement ("tr") //creamos una nueva fila con tr
    tr.innerHTML = `<td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    <td>$${item.img}</td>
    <td>$${item.description}</td>
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
};


//Con un evento excuchamos si activa alguno de los dos botones
tableBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]')
    if(!btn)
        return;
    const id = btn.dataset.id;
    if(btn.dataset.action=== 'edit'){

    }
    else if(btn.dataset.action === 'delete'){
        deleteItem(id);
    }
});

// Función eliminar
function deleteItem(id) {
    if (confirm(`¿Deseas eliminar el producto con el id: ${id}?`)) {
        const row = Array.from(tableBody.children).find(r => r.children[0].textContent === id);
        if (row) tableBody.removeChild(row);
    }
}
//Edicion en el modal
const editModal = document.getElementById('editModal');

editModal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget; // botón que abrió el modal

    // Obtener datos del producto desde data-*
    const id = button.getAttribute('data-id');
    const name = button.getAttribute('data-name');
    const price = button.getAttribute('data-price');
    const description = button.getAttribute('data-description');
    const category = button.getAttribute('data-category');
    const subcategory = button.getAttribute('data-subcategory');

    // Llenar campos del formulario
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editPrice').value = price;
    document.getElementById('editDescription').value = description;
    // Si agregas inputs para categoría y subcategoría, los llenas igual:
    // document.getElementById('editCategory').value = category;
    // document.getElementById('editSubcategory').value = subcategory;
});

//add form para el agregar
const addForm = document.getElementById('addForm');

addForm.addEventListener('submit', function (e) {
    e.preventDefault(); 

    // Generar un ID único 
    const newId = Date.now().toString(); 

    
    const name = document.getElementById('addName').value;
    const price = document.getElementById('addPrice').value;
    const description = document.getElementById('addDescription').value;
    const category = document.getElementById('addCategory').value;
    const subcategory = document.getElementById('addSubcategory').value;

    // Creamos el objeto
    const newItem = {
        id: newId,
        name: name,
        price: price,
        img: "placeholder.png", 
        description: description,
        category: category,
        subcategory: subcategory
    };


    addRow(newItem);

    // Limpia el formulario
    addForm.reset();

    const addModalEl = document.getElementById('addModal');
    const modal = bootstrap.Modal.getInstance(addModalEl);
    modal.hide();
});


// Ejecutar carga inicial cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', loadTable);