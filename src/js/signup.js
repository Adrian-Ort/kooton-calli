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
        // Limpiar formulario después de registro exitoso
        document.getElementById('form-signup').reset();
    } else {
        alert("Error al registrar usuario: " + (data.message || response.status));
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-signup');
    
    if (form) {
        form.addEventListener('submit', async function (e) {
            e.preventDefault();
            await fetchSingUp();
        });
    }
});

export function getRegisters() {
    const data = localStorage.getItem('register');
    return data ? JSON.parse(data) : [];
}

export function saveInputs(register) {
    localStorage.setItem('register', JSON.stringify(register));
}

// Validación de nombre - solo letras y espacios
export function validateName(name) {
    if (name.length === 0) {
        return false;
    }
    // Solo permite letras (incluyendo acentos), espacios y guiones
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]+$/;
    return nameRegex.test(name);
}

export function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

// Validación de teléfono - exactamente 10 dígitos numéricos
export function validatePhone(phone) {
    // Debe ser exactamente 10 dígitos
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

export function verifyPassword(password, confirmPassword) {
    return password === confirmPassword && password.length > 0;
}

// Validación de contraseña - mínimo 8 caracteres
export function validatePassword(password) {
    return password.length >= 8;
}

// Función para verificar si estamos en la página de signup
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
        console.log('No estamos en página de signup, omitiendo inicialización');
        return;
    }
    
    const form = document.getElementById('form-signup');
    
    if (form){
        console.log('Formulario de signup encontrado! Inicializando...');
        
        // Agregar validación en tiempo real para el teléfono
        const phoneInput = document.getElementById('signup-phone');
        if (phoneInput) {
            phoneInput.addEventListener('input', function(e) {
                // Eliminar cualquier carácter que no sea número
                this.value = this.value.replace(/[^0-9]/g, '');
                // Limitar a 10 dígitos máximo
                if (this.value.length > 10) {
                    this.value = this.value.slice(0, 10);
                }
            });
        }
        
        // Agregar validación en tiempo real para nombre y apellido
        const nameInput = document.getElementById('signup-name');
        const lastNameInput = document.getElementById('signup-last-name');
        
        if (nameInput) {
            nameInput.addEventListener('input', function(e) {
                // Eliminar números y caracteres especiales (excepto espacios y guiones)
                this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/g, '');
            });
        }
        
        if (lastNameInput) {
            lastNameInput.addEventListener('input', function(e) {
                // Eliminar números y caracteres especiales (excepto espacios y guiones)
                this.value = this.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s-]/g, '');
            });
        }
        
        form.removeEventListener('submit', handleFormSubmit);
        form.addEventListener('submit', handleFormSubmit);
        console.log('Event listener agregado al formulario de signup');
    } else {
        console.log("Formulario no encontrado en la página, reintentando");
        setTimeout(initializeSignupForm, 500);
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Obtener valores y limpiarlos
    let name = document.getElementById('signup-name').value.trim();
    let lastName = document.getElementById('signup-last-name').value.trim();
    let phone = document.getElementById('signup-phone').value.trim();
    let email = document.getElementById('signup-email').value.trim();
    let password = document.getElementById('signup-password1').value.trim();
    let password2 = document.getElementById('signup-password2').value.trim();
    
    // Validar nombre
    if (name === "") {
        alert("El nombre es obligatorio");
        return;
    }
    if (!validateName(name)) {
        alert("El nombre no puede contener números ni caracteres especiales");
        return;
    }
    
    // Validar apellido
    if (lastName === "") {
        alert("El apellido es obligatorio");
        return;
    }
    if (!validateName(lastName)) {
        alert("El apellido no puede contener números ni caracteres especiales");
        return;
    }
    
    // Validar teléfono
    if (phone === "") {
        alert("El teléfono es obligatorio");
        return;
    }
    if (!validatePhone(phone)) {
        alert("El teléfono debe tener exactamente 10 dígitos numéricos");
        return;
    }
    
    // Validar email
    if (email === "") {
        alert("El correo electrónico es obligatorio");
        return;
    }
    if (!validateEmail(email)) {
        alert("Por favor ingresa un correo electrónico válido");
        return;
    }
    
    // Validar contraseña
    if (password === "") {
        alert("La contraseña es obligatoria");
        return;
    }
    if (!validatePassword(password)) {
        alert("La contraseña debe tener al menos 8 caracteres");
        return;
    }
    
    // Validar confirmación de contraseña
    if (password2 === "") {
        alert("Debes verificar tu contraseña");
        return;
    }
    if (!verifyPassword(password, password2)) {
        alert("Las contraseñas no coinciden");
        return;
    }

    // Si todas las validaciones pasan, guardar en localStorage
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

    // Enviar al backend
    fetchSingUp();
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