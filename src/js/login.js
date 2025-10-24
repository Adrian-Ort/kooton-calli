console.log('login.js cargado correctamente');

// Cambiar a endpoint de login si existe, o usar GET para obtener usuarios
const endPointUsers = 'https://kooton-calli.duckdns.org/api/v1/users';

// OPCIÓN A: Si tienes un endpoint de login en tu backend
// const endPointLogin = 'https://kooton-calli.duckdns.org/api/v1/auth/login';

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

export function validatePassword(password) {
    return password.length >= 3; // Cambiado a 3 porque tus usuarios de prueba tienen "123"
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
        console.log('No estamos en página de login, omitiendo inicialización');
        return;
    }
    
    const form = document.getElementById('form-login');
    
    if (form) {
        console.log('Formulario de login encontrado! Inicializando...');
        form.addEventListener('submit', handleLoginSubmit);
    } else {
        setTimeout(initializeLoginForm, 500);
    }
}

// SOLUCIÓN TEMPORAL: Validar obteniendo todos los usuarios (NO SEGURO)
async function handleLoginSubmit(e) {
    e.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        alert('Por favor, completa todos los campos');
        return;
    }

    if (!validateEmail(email)) {
        alert("Email inválido");
        return;
    }

    if (!validatePassword(password)) {
        alert("Contraseña debe tener al menos 3 caracteres");
        return;
    }

    try {
        // CAMBIO: Usar GET en lugar de POST
        const response = await fetch(endPointUsers, {
            method: 'GET',
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const users = await response.json();
        console.log('Usuarios obtenidos:', users);

        // Buscar usuario que coincida con email y password
        const userValidated = users.find(user => 
            user.email === email && user.password === password
        );

        if (userValidated) {
            alert(`Bienvenido, ${userValidated.name}`);
            localStorage.setItem('loggedUser', JSON.stringify(userValidated));

            // Redirigir según rol
            if (userValidated.idRole === 1) {
                window.location.href = '/html/inventory-management.html';
            } else if (userValidated.idRole === 2) {
                window.location.href = 'index.html';
            } else {
                alert('Rol desconocido, contacta al administrador');
            }
        } else {
            alert('Email o contraseña incorrectos');
        }

    } catch (error) {
        console.error('Error en el login:', error);
        alert(`Error al intentar iniciar sesión: ${error.message}`);
    }

    e.target.reset();
}

initializeLoginForm();
window.addEventListener('popstate', initializeLoginForm);
window.addEventListener('hashchange', initializeLoginForm);