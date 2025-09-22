let dictionaryContact = {};

function clearName() {
	return document.getElementById("input--name").value = "";
}

function clearEmail() {
	return document.getElementById("input--email").value = "";
}

function clearPhone() {
	return document.getElementById("input--phone").value = "";
}

function clearMessage() {
	return document.getElementById("input--message").value = "";
}

function validateNameEmailAndMessage(name, email, message) {
	if (name == "") {
		alert("Entrada inválida. Por favor, ingresa tu nombre");
		clearName();
	}
	if (email == "") {
		alert("Entrada inválida. Por favor, ingresa tu correo");
		clearEmail();
	}
	if (message == "") {
		alert("Entrada inválida. Por favor, ingresa el mensaje");
		clearMessage();
	}
}

function validatePhone(input) {
	if (input == "" || isNaN(input)) {
		alert("Entrada inválida. Por favor, ingresa un número de teléfono válido");
		clearPhone();
		return false;
	}
	return true;
}

function saveInputs() {
	let name = document.getElementById("input--name").value;
	let email = document.getElementById("input--email").value;
	let phone = document.getElementById("input--phone").value;
	let message = document.getElementById("input--message").value;

	validatePhone(phone);
	validateNameEmailAndMessage(name, email, message);
	dictionaryContact["Name"] = name;
	dictionaryContact["Email"] = email;
	dictionaryContact["Phone"] = phone;
	dictionaryContact["Message"] = message;
	
	return dictionaryContact;
}

