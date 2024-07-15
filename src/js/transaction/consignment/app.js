import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js'
import { validateRequired, validateNumber } from '../../module/validate-min.js'
import { read, viewInvoice } from '../../module/services/services-min.js'

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const buttonPrint = document.querySelector('#btnPrint');
    const formConsignments = document.querySelector('#frmConsignment');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const consignment = document.querySelector('#txtConsignment');
    const buttonAdd = document.querySelector('#btnAdd');
    const checkDiscount = document.querySelector('#txtDiscountCheck');
    const checkISV = document.querySelector('#txtISVCheck');
    let items = [];
    let totals = {};

    let tableConsignments = new DataTable('#tblConsignments', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/ConsignmentController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Codigo', data: "codigo_factura" },
            { title: 'Numero', data: "numero" },
            { title: 'Fecha de creación', data: "fecha_creacion" },
            { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
            { title: 'Cliente', data: "cliente" },
            { title: 'Responsable', data: "responsable" },
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
                action: async function (e, dt, node, config) {
                    actionModal.value = '001';
                    const response = await read('../../app/controllers/ConsignmentController.php?code=true');
                    consignment.value = response;
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    actionModal.value = '002';
                    modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
                    modal.querySelector('#txtConsignment').value = selectedRowData.numero;
                    modal.querySelector('#btnModal').click();
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-calendar-times text-red-500"></i> Expiradas',
                action: function (e, dt, node, config) {
                    actionModal.value = '003';
                    modal.querySelector('#btnModal').click();
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                action: function (e, dt, node, config) {
                    actionModal.value = '005';
                    openModal(e, dt, node, config, modal, buttonModal, items, assignTotal, tblItems);
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    let tblItems = new DataTable('#tblItems', {
        dom: 'Bfrtip',
        async: true,
        dataSrc: items,
        columns: [
            { title: 'Codigo', data: "correlativo" },
            { title: 'Cantidad', data: "cantidad" },
            { title: 'Descripcion', data: "descripcion" },
            { title: 'Precio unitario', data: "precio_unidad" },
            { title: 'Total', data: "total" },
        ],
        searching: false,
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-trash text-rose-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro para eliminar.', 'info', 'OK', false);
                        return;
                    }

                    deleteItem(selectedRowData.id);
                },
                className: 'btn-delete font-bold'
            },
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    })

    buttonCancel.addEventListener('click', () => {
        clearInput(formConsignments, true, ['txtConsignment', 'txtSubtotal', 'txtTotal', 'txtDiscount', 'txtISV'], ['txtDiscountCheck', 'txtISVCheck']);
        clearAll();
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formConsignments, true, ['txtConsignment', 'txtSubtotal', 'txtTotal', 'txtDiscount', 'txtISV'], ['txtDiscountCheck', 'txtISVCheck']);
        clearAll();
    });

    function clearAll() {
        items = [];
        totals = {};

        buttonAdd.classList.remove('hidden');
        buttonAdd.disabled = false;
        modal.querySelector('#btnModal').disabled = false;
        modal.querySelector('#btnModal').classList.remove('hidden');
        buttonPrint.classList.add('hidden');
        buttonPrint.disabled = true;

        let deleteButtons = tblItems.table().container().querySelectorAll('.btn-delete');

        if (deleteButtons && deleteButtons.length > 0) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].classList.remove('disabled');
            }
        }

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
        calculateTotal();
    }

    buttonAdd.addEventListener('click', () => {
        let quantity = document.querySelector('#txtQuantity');
        let descripcion = document.querySelector('#txtDescription');
        let price = document.querySelector('#txtPrice');
        let total = 0.0;

        if (!quantity.value && !descripcion.value && !price.value) {
            alert('Aviso', 'Debe ingresar la cantidad, descripción y precio.', 'warning', 'Ok', true);
            return;
        }

        if (!validateNumber(quantity.value)) {
            alert('Aviso', 'La cantidad debe ser un número.', 'warning', 'Ok', true);
            return;
        }

        if (!validateNumber(price.value)) {
            alert('Aviso', 'El precio debe ser un número.', 'warning', 'Ok', true);
            return;
        }

        total = parseFloat(quantity.value) * parseFloat(price.value);

        items.push({
            correlativo: items.length + 1,
            cantidad: quantity.value,
            descripcion: descripcion.value,
            precio_unidad: price.value,
            total: total,
        });

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();

        calculateTotal();
    });

    buttonPrint.addEventListener('click', async () => {
        if (!validateForm()) {
            alert('Aviso', 'Debe completar todos los campos.', 'warning', 'Ok', true);
            return;
        }

        if (modal.querySelector('#txtCode').value) {
            await viewInvoice(`../../app/controllers/ConsignmentController.php?print=true&id=${modal.querySelector('#txtCode').value}`);
            return;
        }
    });

    checkDiscount.addEventListener('change', calculateTotal);
    checkISV.addEventListener('change', calculateTotal);

    function calculateTotal() {
        let subtotal = 0.0;
        let discount = 0.0;
        let isv = 0.0;
        let total = 0.0;

        items.forEach(element => {
            subtotal += element.total;
        })

        if (checkDiscount.checked) {
            discount = Math.round((subtotal * 0.30) * 100) / 100;
        }

        if (checkISV.checked) {
            isv = Math.round(((subtotal - discount) * 0.12) * 100) / 100;
        }

        total = Math.round((subtotal - discount + isv) * 100) / 100;

        assignTotal(subtotal, discount, isv, total);
    }

    function assignTotal(subtotal, discount, isv, total) {
        document.querySelector('#txtSubtotal').value = subtotal;
        document.querySelector('#txtDiscount').value = discount;
        document.querySelector('#txtISV').value = isv;
        document.querySelector('#txtTotal').value = total;

        totals = {
            subtotal: subtotal,
            descuento: discount,
            isv: isv,
            total: total,
        };
    }

    function deleteItem(id) {
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items.splice(index, 1);

            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();
        }

        calculateTotal();
    }

    formConsignments.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    let dataSave = {
                        factura: {
                            consignacion: modal.querySelector('#txtConsignment').value,
                            cliente: modal.querySelector('#txtClient').value,
                            fecha_creacion: modal.querySelector('#txtDate').value,
                            fecha_vencimiento: modal.querySelector('#txtDateExpiration').value,
                            responsable: modal.querySelector('#txtResponsible').value,
                            nota: modal.querySelector('#txtNote').value || 'N/A',
                        },
                        items: items,
                        total: totals,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableConsignments.ajax.reload();
                    buttonClose.click();
                }
                break;
            case '002':
                if (validateOverride()) {
                    swal("Estas seguro que desea anular la factura?", {
                        title: "Eliminar factura",
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
                                let dataOverride = {
                                    codigo_factura: modal.querySelector('#txtCode').value,
                                    consignacion: modal.querySelector('#txtConsignment').value,
                                }

                                let response = await send(dataOverride, option);

                                if (response) {
                                    let title = response?.success ? 'Transaccion exitosa' : 'Error en la transaccion';
                                    let icon = response?.success ? 'success' : 'warning';

                                    alert(title, response.message, icon, 'Ok', true);
                                }

                                tableConsignments.ajax.reload();
                                buttonClose.click();
                                break;
                            case "not":
                                break;
                        }
                    })
                }
                break;
            case '003':
                if (tableConsignments) {
                    tableConsignments.destroy();
                }

                tableConsignments = new DataTable('#tblConsignments', {
                    dom: 'Bfrtip',
                    async: true,
                    ajax: {
                        url: '../../app/controllers/ConsignmentController.php?expired=true',
                        type: 'GET',
                        dataSrc: '',
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: 'Codigo', data: "codigo_factura" },
                        { title: 'Numero', data: "numero" },
                        { title: 'Fecha de creación', data: "fecha_creacion" },
                        { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
                        { title: 'Cliente', data: "cliente" },
                        { title: 'Responsable', data: "responsable" },
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
                            action: async function (e, dt, node, config) {
                                actionModal.value = '001';
                                const response = await read('../../app/controllers/ConsignmentController.php?code=true');
                                consignment.value = response;
                                openModal(e, dt, node, config, modal, buttonModal);
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                                    return;
                                }

                                actionModal.value = '002';
                                modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
                                modal.querySelector('#txtConsignment').value = selectedRowData.numero;
                                modal.querySelector('#btnModal').click();
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fas fa-th-list text-emerald-500"></i> Mostrar todos los registros',
                            action: function (e, dt, node, config) {
                                actionModal.value = '004';
                                modal.querySelector('#btnModal').click();
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                            action: function (e, dt, node, config) {
                                actionModal.value = '005';
                                openModal(e, dt, node, config, modal, buttonModal, items, assignTotal, tblItems);
                            },
                            className: 'font-bold'
                        }
                    ],
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
                    }
                });
                break;
            case '004':
                if (tableConsignments) {
                    tableConsignments.destroy();
                }

                tableConsignments = new DataTable('#tblConsignments', {
                    dom: 'Bfrtip',
                    async: true,
                    ajax: {
                        url: '../../app/controllers/ConsignmentController.php',
                        type: 'GET',
                        dataSrc: '',
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: 'Codigo', data: "codigo_factura" },
                        { title: 'Numero', data: "numero" },
                        { title: 'Fecha de creación', data: "fecha_creacion" },
                        { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
                        { title: 'Cliente', data: "cliente" },
                        { title: 'Responsable', data: "responsable" },
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
                            action: async function (e, dt, node, config) {
                                actionModal.value = '001';
                                const response = await read('../../app/controllers/ConsignmentController.php?code=true');
                                consignment.value = response;
                                openModal(e, dt, node, config, modal, buttonModal);
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                                    return;
                                }

                                actionModal.value = '002';
                                modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
                                modal.querySelector('#txtConsignment').value = selectedRowData.numero;
                                modal.querySelector('#btnModal').click();
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fas fa-calendar-times text-red-500"></i> Expiradas',
                            action: function (e, dt, node, config) {
                                actionModal.value = '003';
                                modal.querySelector('#btnModal').click();
                            },
                            className: 'font-bold'
                        },
                        {
                            text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                            action: function (e, dt, node, config) {
                                actionModal.value = '005';
                                openModal(e, dt, node, config, modal, buttonModal, items, assignTotal, tblItems);
                            },
                            className: 'font-bold'
                        }
                    ],
                    language: {
                        url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
                    }
                });
                break;
            default:
                break;
        }
    })

    function validateForm() {
        if (!validateRequired(modal.querySelector('#txtAction').value)) {
            alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(modal.querySelector('#txtConsignment').value)) {
            alert("Campo requerido", "Por favor ingrese el numero de consignación es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(modal.querySelector('#txtClient').value)) {
            alert("Campo requerido", "Por favor ingrese el cliente es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(modal.querySelector('#txtDate').value)) {
            alert("Campo requerido", "Por favor ingrese la fecha de creación es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(modal.querySelector('#txtDateExpiration').value)) {
            alert("Campo requerido", "Por favor ingrese la fecha de vencimiento es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(modal.querySelector('#txtResponsible').value)) {
            alert("Campo requerido", "Por favor ingrese el responsable es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!items.length > 0) {
            alert("Error", "Por favor ingrese al menos un item.", 'warning', 'Ok', true);
            return false;
        }

        return true;
    }

    function validateOverride() {
        if (!validateRequired(modal.querySelector('#txtAction').value || !validateRequired(modal.querySelector('#txtCode').value || !validateRequired(modal.querySelector('#txtConsignment').value)))) {
            alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
            return false;
        }

        return true;
    }
});
