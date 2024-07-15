import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js';
import { validateRequired, validateNumber } from '../../module/validate-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formProceeding = document.querySelector('#frmProceeding');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');

    let tableProceedings = new DataTable('#tblProceedings', {
        dom: 'Bfrtip',
        ajax: {
            url: '../../app/controllers/ProceedingController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 16,
        loading: true,
        columns: [
            { title: 'Código', data: "codigo" },
            { title: 'Nombre', data: "nombre" },
            { title: 'Tipo', data: "tipo" }
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                action: function (e, dt, node, config) {
                    actionModal.value = '001';
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-file-pen text-orange-500"></i> Editar',
                action: function (e, dt, node, config) {
                    actionModal.value = '002';
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-trash text-red-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    actionModal.value = '003';
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    buttonCancel.addEventListener('click', () => {
        clearInput(formProceeding);
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formProceeding);
    });

    formProceeding.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    let dataSave = {
                        nombre: modal.querySelector('#txtName').value,
                        tipo: modal.querySelector('#txtType').value
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableProceedings.ajax.reload();
                }
                break;
            case '002':
                if (validateForm() && validateCodeExist()) {
                    let dataEdit = {
                        codigo: modal.querySelector('#txtCode').value,
                        nombre: modal.querySelector('#txtName').value,
                        tipo: modal.querySelector('#txtType').value
                    }

                    let response = await send(dataEdit, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableProceedings.ajax.reload();
                }
                break;
            case '003':
                swal("Estas seguro que deseas eliminar la acta?", {
                    title: "Eliminar acta",
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
                                }

                                let response = await send(dataDelete, option);

                                if (response) {
                                    let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                                    let icon = response?.success ? 'success' : 'warning';

                                    alert(title, response.message, icon, 'Ok', true);
                                }

                                tableProceedings.ajax.reload();
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
            if (!validateRequired(modal.querySelector('#txtName').value)) {
                alert("Campo requerido", "El nombre es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtType').value)) {
                alert("Campo requerido", "El tipo es requerido.", 'warning', 'Ok', true);
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
});