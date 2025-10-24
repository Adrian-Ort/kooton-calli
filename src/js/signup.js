console.log('signup.js cargado correctamente');
const endPointUser = 'https://kooton-calli.duckdns.org/api/v1/users';

async function fetchSingUp() {

    let name = document.getElementById('signup-name').value.trim();
    let lastName = document.getElementById('signup-last-name').value.trim();
    let phone = document.getElementById('signup-phone').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let password1 = document.getElementById('signup-password1').value;
    let password2 = document.getElementById('signup-password2').value;

    if (!validateName(name)) {
        alert("❌ El nombre es obligatorio y no debe contener números");
        return;
    }

    if (!validateName(lastName)) {
        alert("❌ El apellido es obligatorio y no debe contener números");
        return;
    }

    if (!validatePhone(phone)) {
        alert("❌ El teléfono debe tener exactamente 10 dígitos numéricos");
        return;
    }

    if (!validateEmail(email)) {
        alert("❌ Por favor ingresa un correo electrónico válido");
        return;
    }

    if (!password1 || password1.trim().length === 0) {
        alert("❌ La contraseña es obligatoria");
        return;
    }

    if (!password2 || password2.trim().length === 0) {
        alert("❌ Debes verificar tu contraseña");
        return;
    }

    if (!validatePassword(password1)) {
        alert("❌ La contraseña debe tener al menos 8 caracteres");
        return;
    }

    if (!verifyPassword(password1, password2)){
        alert("❌ Las contraseñas no coinciden");
        return;
    }

    const user = {
        name: name,
        lastName: lastName,
        phone: phone,
        email: email,
        password: password1,
    };

    try {
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
            alert('✅ Usuario registrado exitosamente');
            document.getElementById('form-signup').reset();
        } else {
            alert("❌ Error al registrar usuario: " + (data.message || response.status));
        }
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('❌ Error de conexión con el servidor. Por favor intenta de nuevo.');
    }
}

document.getElementById('form-signup').addEventListener('submit', async function (e) {
    e.preventDefault(); 
    await fetchSingUp(); 
});

export function getRegisters() {
    const data = localStorage.getItem('register');
    return data ? JSON.parse(data) : [];
}

export function saveInputs(register) {
    localStorage.setItem('register', JSON.stringify(register));
}

export function validateName(name) {
    if (!name || name.length === 0) return false;
    return !/\d/.test(name); 
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
    return password && confirmPassword && password === confirmPassword;
}

export function validatePassword(password) {
    return password && password.length >= 8;
}

function isOnSignupPage() {
    const currentUrl = window.location.href.toLowerCase();
    const currentPath = window.location.pathname.toLowerCase();
    const currentHash = window.location.hash.toLowerCase();
    const pageTitle = document.title.toLowerCase();
    const formExists = document.getElementById('form-signup') !== null;
    
    return currentUrl.includes('signup') || 
           currentPath.includes('signup') ||
           currentHash.includes('signup') ||
           pageTitle.includes('sign up') ||
           pageTitle.includes('registro') ||
           pageTitle.includes('signup') ||
           formExists;
}

function initializeSignupForm() {
    if (!isOnSignupPage()) {
        console.log('ℹ️ No estamos en página de signup, omitiendo inicialización');
        return;
    }
    
    const form = document.getElementById('form-signup');
    if (form){
        console.log('✅ Formulario de signup encontrado! Inicializando...');
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
        console.log('✅ Event listener agregado al formulario de signup');
    } else {
        console.log("⏳ Formulario no encontrado en la página, reintentando");
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

    e.target.reset();
}

document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('signup-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/\D/g, '');
            if (this.value.length > 10) {
                this.value = this.value.slice(0, 10);
            }
        });
    }

    const nameInput = document.getElementById('signup-name');
    if (nameInput) {
        nameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }

    const lastNameInput = document.getElementById('signup-last-name');
    if (lastNameInput) {
        lastNameInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[0-9]/g, '');
        });
    }
});

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