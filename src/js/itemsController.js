export default class ItemsController {
    constructor() {
        this.items = [];
    }

    addItem(id, name, price, imgUrl, description, category, subcategory) {
        // Formatted price for display
        const formattedPrice = `$${Number(price).toFixed(2)} MXN`;

        const item = {
            id: id,
            name: name,
            price: formattedPrice, // Formatted price for display
            priceRaw: Number(price), // Raw number for cart/calculations
            imgUrl: imgUrl,        // Correct property name
            description: description,
            category: category,
            subcategory: subcategory
        };
        this.items.push(item);
    }

    getItemById(id) {
        return this.items.find(item => item.id === id);
    }

    /**
     * Fetches from BOTH endpoints and combines the data.
     */
    async loadInitialItems() {
        const PRODUCTS_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/products';
        const INVENTORY_ENDPOINT = 'https://kooton-calli.duckdns.org/api/v1/inventories';

        try {
            // 1. Fetch both data sources
            const [productResponse, inventoryResponse] = await Promise.all([
                fetch(PRODUCTS_ENDPOINT),
                fetch(INVENTORY_ENDPOINT)
            ]);

            if (!productResponse.ok || !inventoryResponse.ok) {
                 throw new Error('Failed to fetch from one or more endpoints.');
            }
            
            const products = await productResponse.json();
            const inventories = await inventoryResponse.json();

            // 2. Create a price map (using 'idProduct' and 'productPrice')
            const priceMap = new Map();
            inventories.forEach(inv => {
                priceMap.set(inv.idProduct, inv.productPrice);
            });

            // 3. Combine products with their prices
            products.forEach(item => {
                // Get price from the map using the product's ID ('id')
                const price = priceMap.get(item.id) || 0; // Default to 0 if not in inventory
                
                // Add the combined item using correct API names
                this.addItem(
                    item.id,
                    item.name,
                    price,       // <-- The price from inventory
                    item.imgUrl,
                    item.description,
                    item.category,
                    item.subcategory
                );
            });

        } catch (error) {
            console.error('Error al cargar y combinar los productos/inventario:', error);
        }
    }
}