export default class ItemsController {
    constructor() {
        this.items = [];
    }

    addItem(id, name, price, img, description, category, subcategory) {
        // Formateamos el precio para que incluya el símbolo de moneda y dos decimales
        const formattedPrice = `$${Number(price).toFixed(2)} MXN`;

        const item = {
            id: id,
            name: name,
            price: formattedPrice, // Usamos el precio ya formateado
            img: img,
            description: description,
            category: category,
            subcategory: subcategory
        };
        this.items.push(item);
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }

    async loadInitialItems() {
        try {
            // 1. Hacemos una petición para obtener el archivo JSON
            const response = await fetch(`/data/items.json?v=${new Date().getTime()}`);
            
            // 2. Convertimos la respuesta a un objeto JSON
            const itemsJson = await response.json();
            
            // 3. Iteramos sobre cada producto del JSON y lo añadimos a nuestro array
            itemsJson.forEach(item => {
                this.addItem(
                    item.id,
                    item.name,
                    item.price,
                    item.img,
                    item.description,
                    item.category,
                    item.subcategory
                );
            });
        } catch (error) {
            console.error('Error al cargar los productos desde JSON:', error);
        }
    }
}