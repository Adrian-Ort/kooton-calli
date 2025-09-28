import ItemsController from "./itemsController";

const tableBody = document.getElementById('tableBody');

async function loadTable(){
    try{
        const itemsController = new ItemsController();
        //await espera a que caguen todos los productos
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
      <button class="action-btn edit-btn" data-action="edit" data-id="${item.id}">Editar</button>
      <button class="action-btn delete-btn" data-action="delete" data-id="${item.id}">Eliminar</button>
    </td>`; //Añadimos los botones de editar y eliminar
    tableBody.appendChild(tr);
};

//Con un evento excuchamos si activa alguno de los dos botones
tableBody.addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-action]')
    if(!btn)
        return;
    const id = btn.dataset.id;
    if(btn.dataset.action=== 'edit'){
        editItem(id);
    }
    else if(btn.dataset.action === 'delete'){
        deleteItem(id);
    }
})

function editItem (id){
    alert(`Editar producto con ID: ${id}`);
}

function deleteItem(id){
    if(confirm(`¿Deseas eliminar el producto con el id: ${id}? `)){
        const row = Array.from(tableBody.children).find(r => r.children[0].textContent=== id);
        if(row)tableBody.removeChild(row)
    }
}


//ejecucion de la funcion para cargar el los datos a la tabla
//Esperammos a que cargue todo el HTML con DOMContentLoaded
document.addEventListener('DOMContentLoaded', loadTable);
