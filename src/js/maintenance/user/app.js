import openModal, { send, operations } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js';
import { validateRequired, validateNumber, validatePhoneNumber } from '../../module/validate-min.js';
import createSelectOptions from '../../module/select-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonSend = document.querySelector('#btnModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formUser = document.querySelector('#frmUser');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');

    createSelectOptions('#txtProfile', '../../app/controllers/ProfileController.php', 'codigo', 'nombre');

    let tableUsers = new DataTable('#tblUsers', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/UserController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 16,
        loading: true,
        columns: [
            { title: '#', data: "correlativo" },
            { title: 'Usuario', data: "usuario" },
            { title: 'Nombre', data: "nombre" },
            { title: 'Apellido', data: "apellido" },
            { title: 'Dirección', data: "direccion" },
            { title: 'Teléfono', data: "telefono_fijo" },
            { title: 'Movil', data: "telefono_movil" },
            { title: 'Perfil', data: "perfil" },
            {
                title: 'Estado', data: "estado", render: function (data) {
                    return `
                        <div class="flex flex-row gap-2 items-center justify-between">
                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${data === "ACTIVO" ? "bg-green-100 text-green-800 border-green-400" : "bg-red-100 text-red-800 border-red-400"}">${data}</span>
                        </div>
                    `;
                }
            }
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
                text: '<i class="fa-solid fa-key text-indigo-500"></i> Reiniciar contraseña',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    actionModal.value = '004';
                    modal.querySelector('#txtCode').value = selectedRowData.correlativo;
                    buttonSend.click();
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-user-check text-blue-500"></i> Activar usuario',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    actionModal.value = '005';
                    modal.querySelector('#txtCode').value = selectedRowData.correlativo;
                    buttonSend.click();
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
            },
            {
                text: '<i class="fa-solid fa-shop text-amber-500"></i> Asignar tienda',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    let codeSelected = selectedRowData.correlativo;
                    window.location.href = `../maintenance/user_store.php?code=${codeSelected}`;
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
                if (validateForm()) {
                    let dataSave = {
                        usuario: modal.querySelector('#txtUser').value,
                        nombre: modal.querySelector('#txtName').value,
                        apellido: modal.querySelector('#txtSurname').value,
                        direccion: modal.querySelector('#txtAddress').value,
                        telefono_fijo: modal.querySelector('#txtLandlinePhone').value,
                        telefono_movil: modal.querySelector('#txtMobilePhone').value,
                        perfil: modal.querySelector('#txtProfile').value,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableUsers.ajax.reload();
                    buttonClose.click();
                } else buttonModal.click();
                break;
            case '002':
                if (validateForm() && validateCodeExist()) {
                    let dataEdit = {
                        codigo: modal.querySelector('#txtCode').value,
                        usuario: modal.querySelector('#txtUser').value,
                        nombre: modal.querySelector('#txtName').value,
                        apellido: modal.querySelector('#txtSurname').value,
                        direccion: modal.querySelector('#txtAddress').value,
                        telefono_fijo: modal.querySelector('#txtLandlinePhone').value,
                        telefono_movil: modal.querySelector('#txtMobilePhone').value,
                        perfil: modal.querySelector('#txtProfile').value,
                    }

                    let response = await send(dataEdit, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableUsers.ajax.reload();
                    buttonClose.click();
                } else buttonModal.click();
                break;
            case '003':
                swal("Estas seguro que deseas eliminar el usuario?", {
                    title: "Eliminar usuario",
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
            case '004':
                if (validateCodeExist()) {
                    swal("Estas seguro que deseas reiniciar la contraseña del usuario?", {
                        title: "Reiniciar contraseña",
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
                                    let dataResetPassword = {
                                        operation: 'rstpwd',
                                        codigo: modal.querySelector('#txtCode').value,
                                    }

                                    let response = await operations(dataResetPassword);

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
                                break;
                        }
                    });
                }
                break;
            case '005':
                if (validateCodeExist()) {
                    swal("Estas seguro que deseas activar el usuario?", {
                        title: "Activar usuario",
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
                                    let dataActive = {
                                        operation: 'atvusr',
                                        codigo: modal.querySelector('#txtCode').value,
                                    }

                                    let response = await operations(dataActive);

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
                                break;
                        }
                    });
                }
                break;
            default:
                break;
        }

        function validateForm() {
            if (!validateRequired(modal.querySelector('#txtName').value)) {
                alert("Campo requerido", "El campo nombre es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtSurname').value)) {
                alert("Campo requerido", "El campo apellido es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtUser').value)) {
                alert("Campo requerido", "El campo usuario es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtAddress').value)) {
                alert("Campo requerido", "El campo dirección es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtLandlinePhone').value)) {
                alert("Campo requerido", "El campo número de teléfono fijo es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validatePhoneNumber(modal.querySelector('#txtLandlinePhone').value)) {
                alert("Campo requerido", "El número de teléfono fijo no es valido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtMobilePhone').value)) {
                alert("Campo requerido", "El campo número de teléfono móvil es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validatePhoneNumber(modal.querySelector('#txtMobilePhone').value)) {
                alert("Campo requerido", "El número de teléfono móvil no es valido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtProfile').value)) {
                alert("Campo requerido", "El campo perfil es requerido.", 'warning', 'Ok', true);
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