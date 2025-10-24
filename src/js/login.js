console.log('login.js cargado correctamente');
const endPointUser = 'https://kooton-calli.duckdns.org/api/v1/users';

async function fetchLogin() {
    const userCredentials = {
        email: document.getElementById('login-email').value,
        password: document.getElementById('login-password').value
    };

    const response = await fetch(endPointUser, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userCredentials)
    });

    const data = await response.json();
    console.log(data);
}

document.getElementById('form-login').addEventListener('submit', async function (e) {
    e.preventDefault(); //Avoid page reload
    await fetchLogin(); //Calls the function
});


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

/* function handleLoginSubmit(e) {
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
} */
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
        alert("Contraseña inválida");
        return;
    }

    try {
        // Llamada POST al backend para validar login
        const response = await fetch(endPointUser, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            throw new Error('Error al validar usuario');
        }

        const data = await response.json(); // data debe ser el usuario validado

        if (data && data.length > 0) {
            const user = data[0]; // asumimos que el backend devuelve un array con 1 usuario

            alert(`Bienvenido, ${user.name}`);
            localStorage.setItem('loggedUser', JSON.stringify(user));

            // Redirigir según rol
            if (user.idRole === 1) {
                window.location.href = '/html/inventory.html';
            } else if (user.idRole === 2) {
                window.location.href = '/html/home.html';
            } else {
                alert('Rol desconocido, contacta al administrador');
            }

        } else {
            alert('Email o contraseña incorrectos');
        }

    } catch (error) {
        console.error('Error en el login:', error);
        alert('Ocurrió un error al intentar iniciar sesión.');
    }

    e.target.reset();
}


initializeLoginForm();
window.addEventListener('popstate', initializeLoginForm);
window.addEventListener('hashchange', initializeLoginForm);