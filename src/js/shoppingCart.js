document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.boton__mas__menos');

    const manejarCantidad = (e) => {
        const button = e.currentTarget;
        const inputQuantity = button.parentElement.querySelector('input[type="number"]');
        
        if (!inputQuantity) return;

        let cantidadActual = parseInt(inputQuantity.value);
        let change = button.textContent === '+' ? 1 : -1; 
        let newQuantity = cantidadActual + change;

        if (newQuantity < 1) {
            newQuantity = 1;
        }
        
        inputQuantity.value = newQuantity;
    };

    containers.forEach(container => {
        const buttons = container.querySelectorAll('.boton__del__carrito');
        buttons.forEach(button => {
            button.addEventListener('click', manejarCantidad);
        });
    });
});