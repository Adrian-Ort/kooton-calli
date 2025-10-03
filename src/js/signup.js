function getRegisters() {
    const data = localStorage.getItem('register');
    return data ? JSON.parse(data) : [];
}

function saveInputs(register) {
    localStorage.setItem('register', JSON.stringify(register));
}

document.getElementById('form-signup').addEventListener('submit', (e) => {
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

    const newElement = {
        nombre: name,
        apellidos: lastName,
        telefono: phone,
        correo: email,
        contraseña: password
    };

    // Save in localStorage
    const register = getRegisters();
    register.push(newElement);
    saveInputs(register);

    alert("Registro guardado en localStorage ✅");

    e.target.reset();
});

// Validation functions
function validateName(name) {
    return name.length > 0; 
}

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^\d{10}$/; 
    return phoneRegex.test(phone);
}

function verifyPassword(password, confirmPassword) {
    return password === confirmPassword;
}

function validatePassword(password) {
    return password.length >= 8;
}
