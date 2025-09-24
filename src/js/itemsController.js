export default class ItemsController {
    constructor() {
        this.items = [];
    }

    addItem(id, name, price, img, description, category, subcategory) {
        const item = {
            id: id,
            name: name,
            price: price,
            img: img,
            description: description,
            category: category,
            subcategory: subcategory
        };
        this.items.push(item);
    }

    // Otros métodos
}