import { alert } from '../module/alert-min.js';
import { validateVariable } from '../module/url-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const wineryForm = document.querySelector('#frmWinery');
    const winery = document.querySelector('#winery');
    const status = validateVariable('status');

    validateStatus();

    wineryForm.addEventListener('submit', (e) => {
        if (validateForm()) {
            return;
        }

        e.preventDefault();
    })

    function validateForm() {
        const wineryValue = winery.value;

        if (wineryValue === '') {
            alert('Campo requerido', 'Debe seleccionar la bodega.', 'warning', 'Ok', true);
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
                alert('Bodega no valida', 'Al parecer no existe la bodega seleccionada o el usuario no tiene acceso a ella.', 'warning', 'Ok', true);
            }

            if (status.value === 'not_winery') {
                alert('Bodega vacía', 'No cuenta con una bodega activa, por favor seleccione una bodega para continuar.', 'warning', 'Ok', true);
            }
        }
    }
})