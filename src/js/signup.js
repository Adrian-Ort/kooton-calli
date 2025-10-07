 console.log('signup.js cargado correctamente');

 export function getRegisters() {
    const data = localStorage.getItem('register');
    return data ? JSON.parse(data) : [];
}

export function saveInputs(register) {
    localStorage.setItem('register', JSON.stringify(register));
}

// Validation functions
export function validateName(name) {
    return name.length > 0; 
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

 export function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/; 
    return phoneRegex.test(phone);
}

export function verifyPassword(password, confirmPassword) {
    return password === confirmPassword;
}

export function validatePassword(password) {
    return password.length >= 8;
}

function initializeSignupForm() {
const form = document.getElementById('form-signup');
if (form){
    console.log('Formulario de signup encontrado! Inicializando...');
    form.removeEventListener('submit', handleFormSubmit);
    form.addEventListener('submit', handleFormSubmit);
    console.log('Event listener agregado al formulario de signup')
} else {
    console.log("Formulario no encontrado en la página, reintentando")
    setTimeout(initializeSignupForm, 500);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    //Data request
    let name = document.getElementById('signup-name').value.trim();
    let lastName = document.getElementById('signup-last-name').value.trim();
    let phone = document.getElementById('signup-phone').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let password = document.getElementById('signup-password1').value.trim();
    let password2 = document.getElementById('signup-password2').value.trim();

    // Validations
    if (!validateName(name)) return alert("Nombre inválido");
    if (!validateName(lastName)) return alert("Apellido inválido");
    if (!validatePhone(phone)) return alert("Teléfono inválido");
    if (!validateEmail(email)) return alert("Email inválido");
    if (!validatePassword(password)) return alert("Contraseña muy corta (mín 8 caracteres)");
    if (!verifyPassword(password, password2)) return alert("Las contraseñas no coinciden");

    const newSignup = {
        nombre: name,
        apellidos: lastName,
        telefono: phone,
        correo: email,
        contraseña: password
    };

    // Save in localStorage
    const register = getRegisters();
    register.push(newSignup);
    saveInputs(register);

    alert("Registro guardado en localStorage");

    e.target.reset();
}

// Iniciar el proceso de búsqueda del formulario
initializeSignupForm();

// También intentar inicializar cuando se navegue (para SPAs)
window.addEventListener('popstate', initializeSignupForm);
window.addEventListener('hashchange', initializeSignupForm);