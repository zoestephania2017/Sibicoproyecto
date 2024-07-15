export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export function validatePhoneNumber(phoneNumber) {
    const phoneNumberRegex = /^(\+\d{1,3}\s?)?(\(\d{1,3}\)\s?)?(\d{4}[-\s]?\d{4}|\d{8}|\(\d{3}\)[-.\s]?\d{3}[-.\s]?\d{4}|\(\d{3}\)[-.\s]?\d{4}[-\s]?\d{4})$/;
    return phoneNumberRegex.test(phoneNumber);
}

export function validateRequired(value) {
    return value.trim() !== '';
}

export function validateNumber(value) {
    return !isNaN(value);
}

export function validateDate(date) {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateRegex.test(date);
}

export function validateForm(form, validations = []) {
    for (const validation of validations) {
        const input = form.querySelector(validation.selector);
        const value = input.value.trim();

        if (validation.required && !validateRequired(value)) {
            alert("Campo requerido", validation.errorMessage, 'warning', 'Ok', true);
            return false;
        }

        if (validation.type === 'email' && !validateEmail(value)) {
            alert("Campo requerido", "El correo electrónico no es válido.", 'warning', 'Ok', true);
            return false;
        }

        if (validation.type === 'phone' && !validatePhoneNumber(value)) {
            alert("Campo requerido", "El número de teléfono es incorrecto.", 'warning', 'Ok', true);
            return false;
        }

        if (validation.type === 'number' && !validateNumber(value)) {
            alert("Campo requerido", "El valor debe ser un número.", 'warning', 'Ok', true);
            return false;
        }
    }

    return true;
}

export function isEqual(a, b) {
    return a === b;
}