import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js';
import { validateRequired, validateNumber } from '../../module/validate-min.js';
import createSelectOptions from '../../module/select-min.js';
import { validateVariable } from '../../module/url-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonSend = document.querySelector('#btnModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formUser = document.querySelector('#frmUser');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const code = validateVariable('code');

    loadSelectData();

    let tableUsers = new DataTable('#tblUsers', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: `../../app/controllers/OperationController.php?code=${code?.value}`,
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 16,
        loading: true,
        columns: [
            { title: 'Código', data: "codigo" },
            { title: 'Nombre', data: "nombre" },
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                action: function (e, dt, node, config) {
                    actionModal.value = '001';
                    modal.querySelector('#txtCode').value = code.value;
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-trash text-red-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    actionModal.value = '003';
                    modal.querySelector('#txtCode').value = code.value;
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-arrow-circle-left text-blue-500"></i> Regresar a Usuarios',
                action: function () {
                    window.location = '../maintenance/user.php';
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    })

    buttonCancel.addEventListener('click', () => {
        clearInput(formUser);
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formUser);
    });

    formUser.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm() && validateCodeExist()) {
                    let dataSave = {
                        codigo: modal.querySelector('#txtCode').value,
                        codigo_tienda: modal.querySelector('#txtStore').value,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableUsers.ajax.reload();
                    buttonModal.click();
                }
                break;
            case '003':
                swal("Estas seguro que deseas eliminar el acceso a la tienda?", {
                    title: "Eliminar acceso a la tienda",
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
                                    codigo: modal.querySelector('#txtCode').value,
                                    codigo_tienda: modal.querySelector('#txtStore').value,
                                }

                                let response = await send(dataDelete, option);

                                if (response) {
                                    let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                                    let icon = response?.success ? 'success' : 'warning';

                                    alert(title, response.message, icon, 'Ok', true);
                                }

                                tableUsers.ajax.reload();
                                buttonClose.click();
                            }
                            break;
                        case "not":
                            buttonModal.click();
                            break;
                    }
                });
                break;
            default:
                console.log("Acción no valida.");
                break;
        }

        buttonModal.click();

        function validateForm() {
            if (!validateRequired(modal.querySelector('#txtStore').value)) {
                alert("Campo requerido", "El campo tienda es requerido.", 'warning', 'Ok', true);
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
        await createSelectOptions('#txtStore', '../../app/controllers/StoreController.php', 'codigo', 'nombre');

        if (!code.exists && code.isEmpty) {
            alert('Aviso', 'Al parecer no existe el código, por favor regresa a la pagina de perfiles y intente nuevamente.', 'warning', 'OK', false);
            return;
        }
    }
});