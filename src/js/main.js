import '../css/normalize.css';         // first reset to normalize

// Import Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';

// Import Bootstrap JS (included Popper)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// CSS
import '../css/main.css';  // main styles
import '../css/header.css'; // header styles
import '../css/aboutUs.css'; // aboutUs styles
import '../css/footer.css'; //footer styles
import '../css/home.css'; // home styles
import '../css/contact.css'; // contact styles
// global variables
import '../css/global_variables.css';

// Components
import './components.js';


// Page Contact
import './contact.js';

import ItemsController  from './itemsController.js';


const itemsController = new ItemsController();

fetch('/data/items.json')
    .then(response => response.json())
    .then(data => {
        console.log('Datos cargados correctamente:', data);
        data.forEach(item => {
            itemsController.addItem(
                item.id,
                item.name,
                item.price,
                item.img,
                item.description,
                item.category,
                item.subcategory
            );

        });
        // Llama a la función que muestra los productos en la página
        // itemsController.displayItems(); 



        //Test adding items to items.json
        itemsController.addItem(
            11,
            "CamisaTest",
            11.11,
            "img",
            "description",
            "category",
            "subcategory"
        );
        console.log("la lista de productos es: ", itemsController.items); // Muestra los items en la consola

    })
    .catch(error => console.error('Error al cargar el JSON:', error));

