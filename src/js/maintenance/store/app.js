import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js';
import { validateNumber, validatePhoneNumber, validateRequired, validateDate } from '../../module/validate-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formStore = document.querySelector('#frmStore');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');

    let tableStores = new DataTable('#tblStores', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/StoreController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 16,
        loading: true,
        columns: [
            { title: 'Codigo', data: "codigo" },
            { title: 'Nombre', data: "nombre" },
            { title: 'Dirección', data: "direccion" },
            { title: 'RTN', data: "rtn" },
            { title: 'Teléfono', data: "telefono" },
            { title: 'Tipo', data: "tipo" },
            { title: 'Estado', data: "estado", render: function (data) {
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
        clearInput(formStore);
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formStore);
    })

    formStore.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    let dataSave = {
                        nombre: modal.querySelector('#txtName').value,
                        direccion: modal.querySelector('#txtAddress').value,
                        rtn: modal.querySelector('#txtRTN').value,
                        telefono: modal.querySelector('#txtPhone').value,
                        fecha_limite_emision: modal.querySelector('#txtDate').value,
                        cai: modal.querySelector('#txtManager').value,
                        orden_compra: modal.querySelector('#txtOrder').value,
                        exoneraciones: modal.querySelector('#txtExonerations').value,
                        agricultura: modal.querySelector('#txtAgriculture').value,
                        facturai: modal.querySelector('#txtInvoiceInit').value,
                        facturaf: modal.querySelector('#txtInvoiceEnd').value,
                        tipo: modal.querySelector('#txtType').value,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableStores.ajax.reload();
                }
                break;
            case '002':
                if (validateForm() && validateCodeExist()) {
                    let dataEdit = {
                        codigo: modal.querySelector('#txtCode').value,
                        nombre: modal.querySelector('#txtName').value,
                        direccion: modal.querySelector('#txtAddress').value,
                        rtn: modal.querySelector('#txtRTN').value,
                        telefono: modal.querySelector('#txtPhone').value,
                        fecha_limite_emision: modal.querySelector('#txtDate').value,
                        cai: modal.querySelector('#txtManager').value,
                        orden_compra: modal.querySelector('#txtOrder').value,
                        exoneraciones: modal.querySelector('#txtExonerations').value,
                        agricultura: modal.querySelector('#txtAgriculture').value,
                        facturai: modal.querySelector('#txtInvoiceInit').value,
                        facturaf: modal.querySelector('#txtInvoiceEnd').value,
                        tipo: modal.querySelector('#txtType').value,
                    }

                    let response = await send(dataEdit, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transaccion';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableStores.ajax.reload();
                }
                break;
            case '003':
                swal("Estas seguro que deseas eliminar la tienda?", {
                    title: "Eliminar tienda",
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
                                    let title = response?.success ? 'Transacción exitosa' : 'Error en la transaccion';
                                    let icon = response?.success ? 'success' : 'warning';

                                    alert(title, response.message, icon, 'Ok', true);
                                }

                                tableStores.ajax.reload();
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

            if (!validateRequired(modal.querySelector('#txtRTN').value)) {
                alert("Campo requerido", "El RTN es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtAddress').value)) {
                alert("Campo requerido", "La dirección es requerida.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtPhone').value)) {
                alert("Campo requerido", "El número de teléfono es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validatePhoneNumber(modal.querySelector('#txtPhone').value)) {
                alert("Campo requerido", "El número de teléfono es incorrecto.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtDate').value)) {
                alert("Campo requerido", "La fecha es requerida.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateDate(modal.querySelector('#txtDate').value)) {
                alert("Campo requerido", "La fecha es incorrecta.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtManager').value)) {
                alert("Campo requerido", "El jefe de bodega es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtOrder').value)) {
                alert("Campo requerido", "El correlativo de orden de compra exenta es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtExonerations').value)) {
                alert("Campo requerido", "El registro de exoneraciones es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtAgriculture').value)) {
                alert("Campo requerido", "El registro de agricultura es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtInvoiceInit').value)) {
                alert("Campo requerido", "El registro de factura inicial es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtInvoiceEnd').value)) {
                alert("Campo requerido", "El registro de factura final es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtType').value)) {
                alert("Campo requerido", "El tipo de bodega es requerido.", 'warning', 'Ok', true);
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
    });
});