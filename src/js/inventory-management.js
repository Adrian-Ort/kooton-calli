const tableBody = document.getElementById('tableBody');
fetch('/data/items.json')
    .then(response=>response.json())
    .then(data=>{
        data.forEach(item => addRow(item));
    });

function addRow(item){
    const tr = document.createElement ("tr")
    tr.innerHTML = `<td>${item.id}</td>
    <td>${item.name}</td>
    <td>${item.price}</td>
    <td>$${item.img}</td>
    <td>$${item.description}</td>
    <td>${item.category}</td>
    <td>${item.subcategory}</td>
    <td>
      <button class="action-btn edit-btn" onclick="editItem('${item.id}')">Editar</button>
      <button class="action-btn delete-btn" onclick="deleteItem('${item.id}')">Eliminar</button>
    </td>`;
    tableBody.appendChild(tr);
};

function editItem (id){
    alert(`Editar producto con ID: ${id}`);
}

function deleteItem(id){
    if(confirm(`¿Deseas eliminar el producto con el id: ${id}? `)){
        const row = Array.from(tableBody.children).find(r => r.children[0].textContent=== id);
        if(row)tableBody.removeChild(row)
    }
}

