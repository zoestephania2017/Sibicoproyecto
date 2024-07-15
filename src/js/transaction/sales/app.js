import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js'
import { validateRequired, validateEmail, validatePhoneNumber } from '../../module/validate-min.js'
import createSelection, { resetSelectOptions } from '../../module/select-min.js';
import { viewInvoice, read } from '../../module/services/services-min.js';

document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.querySelector('#modal');
    const modalClient = document.querySelector('#modalClient');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formSale = document.querySelector('#frmSale');
    const formClient = document.querySelector('#frmClient');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const buttonCloseClient = document.querySelector('#btnCloseClient');
    const buttonAdd = document.querySelector('#btnAdd');
    const buttonPrint = document.querySelector('#btnPrint');
    const inputSerie = document.querySelector('#txtSerie');
    const selectSerieList = document.querySelector('#txtSerieList');
    let items = [];

    await createSelection('#txtTypeDocument', '../../app/controllers/ProceedingController.php?winery=true', 'codigo', 'descripcion');
    await createSelection('#txtInstitution', '../../app/controllers/ClientController.php?institution=true', 'codigo', 'descripcion');

    let tableSales = new DataTable('#tblSales', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/SaleController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'ID', data: "codigo_factura" },
            { title: 'Codigo', data: "numero" },
            { title: 'Fecha de emisión', data: "fecha_transaccion" },
            { title: 'Cliente', data: "cliente" },
            { title: 'Responsable', data: "responsable" },
            {
                title: 'Estado', data: "estado", render: function (data) {
                    switch (data) {
                        case 'ACTIVO':
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-400">${data}</span>
                            </div>
                        `;
                        case 'ANULADO':
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-400">${data}</span>
                            </div>
                        `;
                        case 'DEVOLUCION':
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-400">${data}</span>
                            </div>
                        `;
                    }
                }
            },
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
                text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    actionModal.value = '002';
                    modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
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
                    openModal(e, dt, node, config, modal, buttonModal, items, tblItems);
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
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Cantidad', data: "cantidad" },
            { title: 'Codigo', data: 'correlativo' },
            { title: 'Descripción', data: "descripcion" },
            { title: 'Serie', data: "serie" },
            { title: 'Precio unidad', data: "precio_unidad" },
            { title: 'Descuento', data: "descuento" },
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

                    deleteItem(selectedRowData.correlativo);
                },
                className: 'btn-delete font-bold'
            },
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    function deleteItem(id) {
        const index = items.findIndex(item => item.correlativo === id);

        if (index !== -1) {
            items.splice(index, 1);

            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();
        }
    }

    inputSerie.addEventListener('keyup', async (e) => {
        let value = e.target.value;

        if (value.length >= 2) {
            await createSelection('#txtSerieList', `../../app/controllers/SaleController.php?serie=${value}&type=1`, 'correlativo', 'serie');
        } else {
            resetSelectOptions('#txtSerieList');
        }
    });

    buttonPrint.addEventListener('click', async () => {
        if (!modal.querySelector('#txtCode').value) {
            alert('Aviso', 'Debe completar todos los campos.', 'warning', 'Ok', true);
            return;
        }

        if (modal.querySelector('#txtCode').value) {
            await viewInvoice(`../../app/controllers/SaleController.php?print=true&id=${modal.querySelector('#txtCode').value}`);
            return;
        }
    })

    selectSerieList.addEventListener('change', async (e) => {
        clearFormAdd();
        let value = e.target.options[e.target.selectedIndex].textContent;

        let data = await read(`../../app/controllers/SaleController.php?serie=${value}&type=2`);

        if (data.length === 0) {
            alert('Aviso', 'No se encontraron registros.', 'info', 'OK', false);
            return;
        }

        modal.querySelector('#txtArticle').value = data[0]?.nombre;
        modal.querySelector('#txtCost').value = data[0]?.valor_unidad_acum;
        modal.querySelector('#txtAvailability').value = data[0]?.disponibilidad;
        modal.querySelector('#txtDescription').value = data[0]?.descripcion;
        modal.querySelector('#txtId').value = data[0]?.codigo;
        modal.querySelector('#txtCor').value = data[0]?.correlativo;
        modal.querySelector('#txtArticleCode').value = data[0]?.codigo_producto;
    });

    function clearFormAdd() {
        modal.querySelector('#txtArticle').value = '';
        modal.querySelector('#txtCost').value = '';
        modal.querySelector('#txtAvailability').value = '';
        modal.querySelector('#txtDescription').value = '';
        modal.querySelector('#txtId').value = '';
        modal.querySelector('#txtCor').value = '';
        modal.querySelector('#txtArticleCode').value = '';
    }

    buttonCancel.addEventListener('click', () => {
        clearInput(formSale);
        clearAll();
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formSale);
        clearAll();
    });

    buttonCloseClient.addEventListener('click', () => {
        clearInput(formClient);
    });

    function clearAll() {
        items = [];

        buttonAdd.classList.remove('hidden');
        buttonAdd.disabled = false;
        modal.querySelector('#btnModal').disabled = false;
        modal.querySelector('#btnModal').classList.remove('hidden');
        modal.querySelector('#divCost1').classList.remove('hidden');
        modal.querySelector('#divCost2').classList.remove('hidden');
        modal.querySelector('#divCost3').classList.remove('hidden');
        modal.querySelector('#divTotal').classList.add('hidden');
        modal.querySelector('#btnPrint').disabled = true;
        modal.querySelector('#btnPrint').classList.add('hidden');
        modal.querySelector('#divCorrelative').classList.add('hidden');
        modal.querySelector('#txtDate').disabled = true;
        modal.querySelector('#txtDate').readonly = true;

        let deleteButtons = tblItems.table().container().querySelectorAll('.btn-delete');

        if (deleteButtons && deleteButtons.length > 0) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].classList.remove('disabled');
            }
        }

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    }

    buttonAdd.addEventListener('click', () => {
        if (!validateRequired(modal.querySelector('#txtSerie').value)) {
            alert("Error", "Debe ingresar la serie", 'warning', 'Ok', true);
            return;
        }

        if (!validateRequired(modal.querySelector('#txtArticle').value)) {
            alert("Error", "Debe seleccionar un articulo", 'warning', 'Ok', true);
            return;
        }

        let total = 0;
        let discount = 0;
        let price = modal.querySelector('#txtPrice');
        let quantity = modal.querySelector('#txtQuantity');

        if (!quantity.value && !price.value) {
            alert("Error", "Debe ingresar el precio y la cantidad", 'warning', 'Ok', true);
            return;
        }

        total = parseFloat(quantity.value) * parseFloat(price.value);

        items.push({
            cantidad: quantity.value,
            correlativo: modal.querySelector('#txtId').value,
            serie: modal.querySelector('#txtSerie').value,
            descripcion: modal.querySelector('#txtDescription').value,
            precio_unidad: price.value,
            descuento: discount,
            total: total.toFixed(2)
        });

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    });

    formSale.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    let dataSave = {
                        tipo_documento: modal.querySelector('#txtTypeDocument').value,
                        receptor: modal.querySelector('#txtReceiver').value,
                        telefono: modal.querySelector('#txtPhone').value || 'N/A',
                        emisor: modal.querySelector('#txtDelivery').value,
                        fecha: modal.querySelector('#txtDate').value,
                        institucion: modal.querySelector('#txtInstitution').options[modal.querySelector('#txtInstitution').selectedIndex].textContent || 'N/A',
                        codigo_institucion: modal.querySelector('#txtInstitution').value || 'N/A',
                        rtn: modal.querySelector('#txtRTN').value || 'N/A',
                        cargo: modal.querySelector('#txtPosition').value || 'N/A',
                        nota: modal.querySelector('#txtNote').value || 'N/A',
                        detalle: items,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableSales.ajax.reload();
                    buttonClose.click();
                }
                break;
            case '002':
                if (validateOverride()) {
                    swal("Estas seguro que desea anular la acta de entrega?", {
                        title: "Eliminar acta de entrega",
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
                                    codigo: modal.querySelector('#txtCode').value,
                                }

                                let response = await send(dataOverride, option);

                                if (response) {
                                    let title = response?.success ? 'Transaccion exitosa' : 'Error en la transaccion';
                                    let icon = response?.success ? 'success' : 'warning';

                                    alert(title, response.message, icon, 'Ok', true);
                                }

                                tableSales.ajax.reload();
                                buttonClose.click();
                                break;
                            case "not":
                                break;
                        }
                    });
                }
                break;
            case '003':
                if (tableSales) {
                    tableSales.destroy();
                }

                tableSales = new DataTable('#tblSales', {
                    dom: 'Bfrtip',
                    async: true,
                    ajax: {
                        url: '../../app/controllers/SaleController.php?expired=true',
                        type: 'GET',
                        dataSrc: '',
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: 'ID', data: "codigo_factura" },
                        { title: 'Codigo', data: "numero" },
                        { title: 'Fecha de emisión', data: "fecha_transaccion" },
                        { title: 'Cliente', data: "cliente" },
                        { title: 'Responsable', data: "responsable" },
                        {
                            title: 'Estado', data: "estado", render: function (data) {
                                switch (data) {
                                    case 'ACTIVO':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-400">${data}</span>
                                        </div>
                                    `;
                                    case 'ANULADO':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-400">${data}</span>
                                        </div>
                                    `;
                                    case 'DEVOLUCION':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-400">${data}</span>
                                        </div>
                                    `;
                                }
                            }
                        },
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
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                                    return;
                                }

                                actionModal.value = '002';
                                modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
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
                                openModal(e, dt, node, config, modal, buttonModal, items, tblItems);
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
                if (tableSales) {
                    tableSales.destroy();
                }

                tableSales = new DataTable('#tblSales', {
                    dom: 'Bfrtip',
                    async: true,
                    ajax: {
                        url: '../../app/controllers/SaleController.php',
                        type: 'GET',
                        dataSrc: '',
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: 'ID', data: "codigo_factura" },
                        { title: 'Codigo', data: "numero" },
                        { title: 'Fecha de emisión', data: "fecha_transaccion" },
                        { title: 'Cliente', data: "cliente" },
                        { title: 'Responsable', data: "responsable" },
                        {
                            title: 'Estado', data: "estado", render: function (data) {
                                switch (data) {
                                    case 'ACTIVO':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-400">${data}</span>
                                        </div>
                                    `;
                                    case 'ANULADO':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-400">${data}</span>
                                        </div>
                                    `;
                                    case 'DEVOLUCION':
                                        return `
                                        <div class="flex flex-row gap-2 items-center justify-between">
                                            <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-400">${data}</span>
                                        </div>
                                    `;
                                }
                            }
                        },
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
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                                    return;
                                }

                                actionModal.value = '002';
                                modal.querySelector('#txtCode').value = selectedRowData.codigo_factura;
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
                                openModal(e, dt, node, config, modal, buttonModal, items, tblItems);
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

        function validateForm() {
            if (!validateRequired(modal.querySelector('#txtAction').value)) {
                alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtTypeDocument').value)) {
                alert("Campo requerido", "El tipo de documento es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtReceiver').value)) {
                alert("Campo requerido", "El nombre de la persona que recibe el documento es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtDelivery').value)) {
                alert("Campo requerido", "El nombre de la persona que entrega el documento es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtDate').value)) {
                alert("Campo requerido", "La fecha de emisión es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!items.length > 0) {
                alert("Error", "Por favor ingrese al menos un item.", 'warning', 'Ok', true);
                return false;
            }

            return true;
        }

        function validateOverride() {
            if (!validateRequired(modal.querySelector('#txtAction').value || !validateRequired(modal.querySelector('#txtCode').value))) {
                alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtCode').value)) {
                alert("Error", "El codigo no puede estar vació.", 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    });

    formClient.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const dataSave = {
                nombre: modalClient.querySelector('#txtName').value,
                apellido: modalClient.querySelector('#txtLastName').value,
                direccion: modalClient.querySelector('#txtAddress').value,
                correo: modalClient.querySelector('#txtEmail').value,
                telefono_fijo: modalClient.querySelector('#txtPhone1').value || 'N/A',
                telefono_movil: modalClient.querySelector('#txtPhone2').value || 'N/A',
            }

            let response = await send(dataSave, '001C');

            if (response) {
                let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                let icon = response?.success ? 'success' : 'warning';

                alert(title, response.message, icon, 'Ok', true);
            }

            buttonCloseClient.click();
        }

        function validateForm() {
            if (!validateRequired(modalClient.querySelector('#txtName').value)) {
                alert("Campo requerido", "El nombre es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalClient.querySelector('#txtLastName').value)) {
                alert("Campo requerido", "El apellido es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalClient.querySelector('#txtAddress').value)) {
                alert("Campo requerido", "La dirección es requerida.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalClient.querySelector('#txtEmail').value)) {
                alert("Campo requerido", "El correo electrónico es requerido.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateEmail(modalClient.querySelector('#txtEmail').value)) {
                alert("Campo requerido", "El correo electrónico no es valido.", 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    });
});
