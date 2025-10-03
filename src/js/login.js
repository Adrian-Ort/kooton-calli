function getLogin() {
      const data = localStorage.getItem
      ('register');
      return data ? JSON.parse(data) : [];
}

function saveInputs(register) {
      localStorage.setItem('register' , JSON.stringify(register));
}

document.getElementById('form-login').addEventListener ('submit' , (e) =>{
      e.preventDefault();

      //Data request
      let email = document.getElementById("login-email").value.trim();
      let password = document.getElementById('login-password').value.trim();

      //Validations
      if (!validateEmail(email)) return alert ("Email inválido");
      if (!validatePassword(password)) return alert ("Contraseña inválida");

      const newLogin = {
            correo: email,
            contraseña: password
      };

      //Save in localStorage
      const login = getLogin();
      login.push(newLogin);
      saveInputs(login);

      alert("Sesión guardada en localStorage");

      e.target.reset();
}); 

// Validation functions
