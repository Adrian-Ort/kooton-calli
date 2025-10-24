export default class ItemsController {
    constructor() {
        this.items = [];
    }

    addItem(id, name, price, img, description, category, subcategory) {
        // Format the price to include currency and two decimal places
        // We use the price from the API which is a number
        const formattedPrice = `$${Number(price).toFixed(2)} MXN`;

        const item = {
            id: id,
            name: name,
            price: formattedPrice, // Formatted price
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
        // API endpoint URL
        const API_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/products';

        try {
            // 1. We fetch the data from the API endpoint
            const response = await fetch(API_ENDPOINT);
            
            // 2. We parse the JSON response
            const itemsJson = await response.json();
            
            // 3. We iterate over the fetched items and add them to the controller
            itemsJson.forEach(item => {
                this.addItem(
                    item.id_product,    // <-- Changed
                    item.product_name,  // <-- Changed
                    item.product_price, // <-- Changed
                    item.img_url,       // <-- Changed
                    item.description,
                    item.category,
                    item.subcategory
                );
            });
        } catch (error) {
            console.error('Error al cargar los productos desde el API:', error);
        }
    }
}