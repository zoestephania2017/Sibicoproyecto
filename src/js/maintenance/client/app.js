import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js';
import { validateEmail, validateNumber, validatePhoneNumber, validateRequired } from '../../module/validate-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modalEdit = document.querySelector('#modal');
    const buttonModalEdit = document.querySelector('#buttonModal');
    const buttonCancelEdit = document.querySelector('#btnCancelEdit');
    const formClient = document.querySelector('#frmClient');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');

    let tableClients = new DataTable('#tblClients', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/ClientController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Codigo', data: "codigo" },
            { title: 'Nombre', data: "nombre" },
            { title: 'Apellido', data: "apellido" },
            { title: 'Dirección', data: "direccion" },
            { title: 'Correo', data: "correo" },
            { title: 'Teléfono', data: "telefono_fijo" },
            { title: 'Movil', data: "telefono_movil" }
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                action: function (e, dt, node, config) {
                    actionModal.value = '001';
                    openModal(e, dt, node, config, modalEdit, buttonModalEdit);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-file-pen text-orange-500"></i> Editar',
                action: function (e, dt, node, config) {
                    actionModal.value = '002';
                    openModal(e, dt, node, config, modalEdit, buttonModalEdit);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-trash text-red-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    actionModal.value = '003';
                    openModal(e, dt, node, config, modalEdit, buttonModalEdit);
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    buttonCancelEdit.addEventListener('click', () => {
        clearInput(formClient);
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formClient);
    })

    formClient.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modalEdit.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    const dataSave = {
                        nombre: modalEdit.querySelector('#txtName').value,
                        apellido: modalEdit.querySelector('#txtLastName').value,
                        direccion: modalEdit.querySelector('#txtAddress').value,
                        correo: modalEdit.querySelector('#txtEmail').value,
                        telefono_fijo: modalEdit.querySelector('#txtPhone1').value || 'N/A',
                        telefono_movil: modalEdit.querySelector('#txtPhone2').value || 'N/A',
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableClients.ajax.reload();
                }
                break;
            case '002':
                if (validateForm() && validateCodeExist()) {
                    const dataEdit = {
                        codigo: modalEdit.querySelector('#txtCode').value,
                        nombre: modalEdit.querySelector('#txtName').value,
                        apellido: modalEdit.querySelector('#txtLastName').value,
                        direccion: modalEdit.querySelector('#txtAddress').value,
                        correo: modalEdit.querySelector('#txtEmail').value,
                        telefono_fijo: modalEdit.querySelector('#txtPhone1').value,
                        telefono_movil: modalEdit.querySelector('#txtPhone2').value,
                    }

                    let response = await send(dataEdit, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transaccion';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableClients.ajax.reload();
                }
                break;
            case '003':
                swal("Estas seguro que deseas eliminar el cliente?", {
                    title: "Eliminar cliente",
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
                })
                    .then(async (value) => {
                        switch (value) {
                            case "yes":
                                if (validateCodeExist()) {
                                    let dataDelete = {
                                        codigo: modal.querySelector('#txtCode').value,
                                    }

                                    let response = await send(dataDelete, option);

                                    if (response) {
                                        let title = response?.success ? 'Transaccion exitosa' : 'Error en la transaccion';
                                        let icon = response?.success ? 'success' : 'warning';

                                        alert(title, response.message, icon, 'Ok', true);
                                    }

                                    tableClients.ajax.reload();
                                    buttonClose.click();
                                }
                                break;

                            case "not":
                                buttonModalEdit.click();
                                break;
                        }
                    });
                break;
            default:
                console.log("Acción no valida.");
        }

        buttonModalEdit.click();

        function validateForm() {
            if (!validateRequired(modalEdit.querySelector('#txtName').value)) {
                alert("Campo requerido", "El nombre es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalEdit.querySelector('#txtLastName').value)) {
                alert("Campo requerido", "El apellido es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalEdit.querySelector('#txtAddress').value)) {
                alert("Campo requerido", "La dirección es requerida.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalEdit.querySelector('#txtEmail').value)) {
                alert("Campo requerido", "El correo electrónico es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateEmail(modalEdit.querySelector('#txtEmail').value)) {
                alert("Campo requerido", "El correo electrónico no es valido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalEdit.querySelector('#txtAction').value)) {
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
    });
});