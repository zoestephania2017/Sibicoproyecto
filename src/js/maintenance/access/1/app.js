import createSelectOptions from '../../../module/select-min.js'
import { validateVariable } from '../../../module/url-min.js'
import { clearInput } from '../../../module/modal-min.js';
import { alert } from '../../../module/alert-min.js'
import openModal, { send } from './modalOptions-min.js';
import { validateRequired, validateNumber } from '../../../module/validate-min.js'

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formAccess = document.querySelector('#frmAccess');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const code = validateVariable('code');

    loadSelectData();

    let tableAccess = new DataTable('#tblAccess', {
        dom: 'Bfrtip',
        ajax: {
            url: `../../app/controllers/ProfileAccessController.php?profile=${code?.value}`,
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 16,
        loading: true,
        columns: [
            { title: 'Codigo', data: "codigo" },
            { title: 'Nombre', data: "nombre" },
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Agregar Acceso',
                action: function (e, dt, node, config) {
                    modal.querySelector('#txtCode').value = code.value;
                    actionModal.value = '001';
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-trash text-red-500"></i> Eliminar Acceso',
                action: function (e, dt, node, config) {
                    modal.querySelector('#txtCode').value = code.value;
                    actionModal.value = '003';
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-arrow-circle-left text-blue-500"></i> Regresar a Perfiles',
                action: function () {
                    window.location = '../maintenance/profile.php';
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    buttonCancel.addEventListener('click', () => {
        clearInput(formAccess);
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formAccess);
    });

    formAccess.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm() && validateCodeExist()) {
                    let dataSave = {
                        codigo_perfil: modal.querySelector('#txtCode').value,
                        codigo_acceso: modal.querySelector('#txtAccess').value,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableAccess.ajax.reload();
                }
                break;
            case '003':
                if (validateForm() && validateCodeExist()) {
                    swal("Estas seguro que deseas eliminar el acceso?", {
                        title: "Eliminar acceso",
                        icon: "warning",
                        dangerMode: true,
                        buttons: {
                            yes: {
                                text: "Si",
                                value: "yes",
                            },
                            not: {
                                text: "No",
                                value: "not",
                            }
                        },
                    }).then(async (value) => {
                        switch (value) {
                            case "yes":
                                if (validateCodeExist()) {
                                    let dataDelete = {
                                        codigo_perfil: modal.querySelector('#txtCode').value,
                                        codigo_acceso: modal.querySelector('#txtAccess').value,
                                    }

                                    let response = await send(dataDelete, option);

                                    if (response) {
                                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                                        let icon = response?.success ? 'success' : 'warning';

                                        alert(title, response.message, icon, 'Ok', true);
                                    }

                                    tableAccess.ajax.reload();
                                    buttonClose.click();
                                }

                                break;
                            case "not":
                                buttonModal.click();
                                break;
                        }
                    });
                }
                break;
            default:
                console.log("Acción no valida.");
        }

        buttonModal.click();

        function validateForm() {
            if (!validateRequired(modal.querySelector('#txtAccess').value)) {
                alert("Campo requerido", "El nombre es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtAction').value)) {
                alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            return true;
        }

        function validateCodeExist() {
            if (!validateRequired(modal.querySelector('#txtCode').value)) {
                alert("Campo requerido", "A ocurrido un error, por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateNumber(modal.querySelector('#txtCode').value)) {
                alert("Campo requerido", "A ocurrido un error, por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    })

    async function loadSelectData() {
        await createSelectOptions('#txtAccess', '../../app/controllers/ProfileAccessController.php', 'codigo', 'nombre');

        if (!code.exists && code.isEmpty) {
            alert('Aviso', 'Al parecer no existe el código, por favor regresa a la pagina de perfiles y intente nuevamente.', 'warning', 'OK', false);
            return;
        }
    }
})