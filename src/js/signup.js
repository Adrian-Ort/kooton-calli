 console.log('signup.js cargado correctamente');
 const endPointUser = 'https://kooton-calli.duckdns.org/api/v1/users';

async function fetchSingUp() {
    let password1 = document.getElementById('signup-password1').value;
    let password2 = document.getElementById('signup-password2').value;

    if (!verifyPassword(password1, password2)){
        alert("Las contraseñas no coinciden");
        return;
    }

    const user = {
        name: document.getElementById('signup-name').value,
        lastName: document.getElementById('signup-last-name').value,
        phone: document.getElementById('signup-phone').value,
        email: document.getElementById('signup-email').value,
        password: document.getElementById('signup-password1').value,
    };

    const response = await fetch(endPointUser, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
        alert('Usuario registrado exitosamente');
    } else {
        alert("Error al registrar usuario:" + (data.message || response.status));
    }
 }

 document.getElementById('form-signup').addEventListener('submit', async function (e) {
    e.preventDefault(); //Avoid page reload 
    await fetchSingUp(); //Calls the function
 });

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

// Función para verificar si estamos en la página de signup
function isOnSignupPage() {
    // Verificar por URL
    const currentUrl = window.location.href.toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    const currentHash = window.location.hash.toLowerCase();
    
    // Verificar por título de la página
    const pageTitle = document.title.toLowerCase();
    
    // Verificar si existe el formulario (última verificación)
    const formExists = document.getElementById('form-signup') !== null;
    
    return currentUrl.includes('signup') || 
           currentPath.includes('signup') ||
           currentHash.includes('signup') ||
           pageTitle.includes('sign up') ||
           pageTitle.includes('registro') ||
           pageTitle.includes('signup') ||
           formExists; // Si el formulario existe, estamos en la página correcta
}
function initializeSignupForm() {
if (!isOnSignupPage()) {
    console.log(' No estamos en página de signup, omitiendo inicialización');
        return;
    }
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

    //alert("Registro guardado en localStorage");

    e.target.reset();
}

// Iniciar el proceso de búsqueda del formulario
initializeSignupForm();

// También intentar inicializar cuando se navegue (para SPAs)
window.addEventListener('popstate', initializeSignupForm);
window.addEventListener('hashchange', initializeSignupForm);

// Interceptar cambios de ruta en SPAs
let currentUrl = window.location.href;
setInterval(() => {
    if (window.location.href !== currentUrl) {
        currentUrl = window.location.href;
        initializeSignupForm();
    }
}, 100);