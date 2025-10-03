// 1. Seleccionamos el formulario usando el selector CSS
const form = document.querySelector('.signup-form form');

// 2. Adjuntamos un "escuchador de eventos" (event listener)
//    para cuando el usuario intente enviar el formulario.
form.addEventListener('submit', function(event) {
    // 3. Prevenimos que el formulario se envíe automáticamente
    event.preventDefault();

    // Aquí irá nuestra lógica de validación
    console.log("¡Formulario interceptado! Listo para validar.");
});
form.addEventListener('submit', function(event) {
    event.preventDefault();

    // 1. Seleccionamos los elementos de entrada por su ID
    const emailInput = document.getElementById('signup-email1');
    const passwordInput = document.getElementById('signup-password1');
    const phoneInput = document.getElementById('signup-phone');

    // 2. Extraemos el texto que el usuario escribió (el .value)
    //    y usamos .trim() para quitar espacios al inicio o al final.
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const phone = phoneInput.value.trim();

    // Ahora las variables 'email', 'password' y 'phone' contienen
    // las cadenas de texto que escribiremos.
    // ... Nuestra lógica de validación sigue aquí ...
});
function validarEmail(email) {
    // Patrón de RegEx para validar el formato estándar de un email.
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    // El método .test() devuelve true si el 'email' coincide con el patrón, o false si no.
    return emailRegex.test(email);
}
function validarTelefono(phone) {
    // Usaremos un RegEx para asegurar que SÓLO son 10 dígitos.
    const phoneRegex = /^\d{10}$/; 
    // Comprobamos si la longitud es 10 y si todos los caracteres son números.
    return phoneRegex.test(phone);
}
// NOTA: Requiere añadir un segundo campo de contraseña en el HTML
function contrasenaCoincide(password, confirmPassword) {
    // Comprueba si ambas cadenas son exactamente iguales.
    return password === confirmPassword; 
}

// Ejemplo de validación mínima de seguridad (ej: más de 8 caracteres)
function validarContrasena(password) {
    return password.length >= 8;
}
