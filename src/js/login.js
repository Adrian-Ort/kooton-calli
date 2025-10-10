console.log('login.js cargado correctamente');

export function getLogin() {
    const data = localStorage.getItem('register');
    return data ? JSON.parse(data) : [];
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return password.length >= 8;
}

// Verificar si estamos en página de login
function isOnLoginPage() {
    const currentUrl = window.location.href.toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    const pageTitle = document.title.toLowerCase();
    const formExists = document.getElementById('form-login') !== null;
    
    return currentUrl.includes('login') || 
           currentPath.includes('login') ||
           pageTitle.includes('login') ||
           pageTitle.includes('iniciar sesión') ||
           formExists;
}

function initializeLoginForm() {
    if (!isOnLoginPage()) {
        console.log(' No estamos en página de login, omitiendo inicialización');
        return;
    }
    
    const form = document.getElementById('form-login');
    
    if (form) {
        console.log(' Formulario de login encontrado! Inicializando...');
        form.addEventListener('submit', handleLoginSubmit);
    } else {
        setTimeout(initializeLoginForm, 500);
    }
}

function handleLoginSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById('login-password');
    
    if (!emailInput || !passwordInput) {
        console.error(' Campos de login no encontrados. IDs buscados:');
        console.error('login-email:', emailInput);
        console.error('login-password:', passwordInput);
        alert('Error: Campos de formulario no encontrados');
        return;
    }

    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (!validateEmail(email)) return alert("Email inválido");
    if (!validatePassword(password)) return alert("Contraseña inválida");

    const users = getLogin();
    const userValidated = users.find(user => 
        user.correo === email && user.contraseña === password
    );
     
    if (userValidated) {
        alert("Ingreso correcto, Bienvenido.");
    } else {
        alert("Email o contraseña incorrectos");
    }

    e.target.reset();
}

initializeLoginForm();
window.addEventListener('popstate', initializeLoginForm);
window.addEventListener('hashchange', initializeLoginForm);