import { alert } from '../module/alert-min.js';
import { validateVariable } from '../module/url-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#frmLogin');
    const username = document.querySelector('#username');
    const password = document.querySelector('#password');
    const status = validateVariable('status');

    validateStatus();

    loginForm.addEventListener('submit', (e) => {
        if (validateForm()) {
            return;
        }

        e.preventDefault();
    });

    function validateForm() {
        const usernameValue = username.value;
        const passwordValue = password.value;

        if (usernameValue.trim() === '' || passwordValue.trim() === '') {
            alert('Campo requerido', 'El usuario o contraseña son requeridos', 'warning', 'Ok', true);
            return false;
        }

        return true;
    }

    function validateStatus() {
        if (status.exists && !status.isEmpty) {
            if (status.value === 'error') {
                alert('Error', 'Ah ocurrido un error, por favor intente nuevamente o verifique que los datos sean correctos.', 'warning', 'Ok', true);
            }

            if (status.value === 'invalid') {
                alert('Credenciales no validas', 'El usuario o contraseña son incorrectos', 'warning', 'Ok', true);
            }

            if (status.value === 'not_logged') {
                alert('Session invalida', 'No cuenta con una session activa.', 'warning', 'Ok', true);
            }
        }
    }
});