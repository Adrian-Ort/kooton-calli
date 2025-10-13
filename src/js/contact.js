//Validación nombre completo
document.getElementById("formulario").addEventListener("submit", function (e) {
  e.preventDefault(); // evita que se envíe el formulario automáticamente

  const name = document.getElementById("input--name").value.trim();
  const error = document.getElementById("error");

  // Expresión regular: al menos dos palabras separadas por espacio
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(\s+[A-Za-zÁÉÍÓÚáéíóúÑñ]+)+$/;

  if (!regex.test(name)) {
    error.textContent = "Por favor, ingresa al menos dos palabras (nombre y apellido).";
    error.style.display = "inline";
    return;
  }

  // Si pasa la validación:
  error.style.display = "none";
  alert("Formulario enviado correctamente");
  // Aquí podrías hacer: this.submit(); o procesar los datos
});

// Validación del teléfono (solo números y guiones)
function validatePhone(input) {
    const phoneRegex = /^[0-9\-]+$/;
    if (!phoneRegex.test(input)) {
        alert("Por favor, ingresa solo números y guiones en el teléfono");
        clearPhone();
        return false;
    }
    return true;
}

// Validación antes de enviar
function validateForm(event) {
    let name = document.getElementById("input--name").value;
    let email = document.getElementById("input--email").value;
    let phone = document.getElementById("input--phone").value;
    let message = document.getElementById("input--message").value;

    // Validar campos vacíos
    if (name === "" || email === "" || message === "") {
        alert("Por favor, completa todos los campos requeridos");
        event.preventDefault();
        return false;
    }

    // Validar formato del teléfono
    if (phone !== "" && !validatePhone(phone)) {
        event.preventDefault();
        return false;
    }

    // Validar formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Por favor, ingresa un correo electrónico válido");
        event.preventDefault();
        return false;
    }

    return true;
}
/*
// Prevenir caracteres no numéricos en el teléfono
document.getElementById("input--phone").addEventListener("input", function(e) {
    // Permitir solo números, guiones y borrar
    this.value = this.value.replace(/[^0-9\-]/g, '');
});*/
/*
// Asignar la validación al formulario
document.querySelector("form").addEventListener("submit", validateForm);
*/
