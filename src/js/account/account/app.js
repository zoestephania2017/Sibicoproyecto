import { getUser, update } from '../../module/services/services-min.js';
import { alert } from '../../module/alert-min.js';
import { validateRequired, validatePhoneNumber, isEqual } from '../../module/validate-min.js';

document.addEventListener('DOMContentLoaded', async () => {
    const formAccount = document.querySelector('#frmAccount');
    const formUpdatePassword = document.querySelector('#frmUpdatePassword');

    await assignDataToForm();

    async function assignDataToForm() {
        let data = await getUser();

        formAccount.querySelector('#txtUsername').value = data.usuario;
        formAccount.querySelector('#txtName').value = data.nombre;
        formAccount.querySelector('#txtSurname').value = data.apellido;
        formAccount.querySelector('#txtAddress').value = data.direccion;
        formAccount.querySelector('#txtPhone1').value = data.telefono_fijo;
        formAccount.querySelector('#txtPhone2').value = data.telefono_movil;
    }

    formAccount.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateFormAccount()) {
            let dataUpdate = {
                nombre: formAccount.querySelector('#txtName').value,
                apellido: formAccount.querySelector('#txtSurname').value,
                direccion: formAccount.querySelector('#txtAddress').value,
                telefono_fijo: formAccount.querySelector('#txtPhone1').value || 'N/A',
                telefono_movil: formAccount.querySelector('#txtPhone2').value || 'N/A',
                type: 'account',
            }

            const response = await update(dataUpdate, '../../app/controllers/UserProfileController.php');
            console.log(response);

            if (response) {
                let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                let icon = response?.success ? 'success' : 'warning';

                alert(title, response.message, icon, 'Ok', true);
            }
        }
    });

    formUpdatePassword.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateFormUpdatePassword()) {
            let dataUpdate = {
                clave_actual: formUpdatePassword.querySelector('#txtCurrentPassword').value,
                clave_nueva: formUpdatePassword.querySelector('#txtNewPassword').value,
                clave_confirmar: formUpdatePassword.querySelector('#txtConfirmPassword').value,
                type: 'change',
            }

            const response = await update(dataUpdate, '../../app/controllers/UserProfileController.php');

            if (response) {
                let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                let icon = response?.success ? 'success' : 'warning';

                alert(title, response.message, icon, 'Ok', true);
            }
        }
    });

    function validateFormAccount() {
        if (!validateRequired(formAccount.querySelector('#txtName').value)) {
            alert("Campo requerido", "El nombre es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formAccount.querySelector('#txtSurname').value)) {
            alert("Campo requerido", "El apellido es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formAccount.querySelector('#txtAddress').value)) {
            formAccount.querySelector('#txtAddress').value = 'N/A';
        }

        return true;
    }

    function validateFormUpdatePassword() {
        if (!validateRequired(formUpdatePassword.querySelector('#txtCurrentPassword').value)) {
            alert("Campo requerido", "La contraseña actual es requerida.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formUpdatePassword.querySelector('#txtNewPassword').value)) {
            alert("Campo requerido", "La nueva contraseña es requerida.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formUpdatePassword.querySelector('#txtConfirmPassword').value)) {
            alert("Campo requerido", "La confirmación de contraseña es requerida.", 'warning', 'Ok', true);
            return false;
        }

        if (!isEqual(formUpdatePassword.querySelector('#txtNewPassword').value, formUpdatePassword.querySelector('#txtConfirmPassword').value)) {
            alert("Campo requerido", "La nueva contraseña y la confirmación de contraseña no coinciden.", 'warning', 'Ok', true);
            return false;
        }

        return true;
    }
})