import openModal, { send } from './modalOptions-min.js';
import { clearInput } from '../../module/modal-min.js';
import { alert } from '../../module/alert-min.js'
import { validateRequired } from '../../module/validate-min.js'
import { read } from '../../module/services/services-min.js';

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formRepayment = document.querySelector('#frmRepayment');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const buttonSearch = document.querySelector('#btnSearchDetail');
    let items = [];

    let tableRepayments = new DataTable('#tblRepayments', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/RepaymentController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Devolución', data: "correlativo" },
            { title: 'Código de la factura', data: "codigo_factura" },
            { title: 'Fecha', data: "fecha" },
            {
                title: "Estado",
                data: "estado",
                render: function (data) {
                    return `
                    <div class="flex flex-row gap-2 items-center justify-between">
                        <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${data === "ACTIVO"
                            ? "bg-green-100 text-green-800 border-green-400"
                            : "bg-red-100 text-red-800 border-red-400"
                        }">${data}</span>
                    </div>
                `;
                },
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
                    openModal(e, dt, node, config, modal, buttonModal, items, tblItems);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                action: function (e, dt, node, config) {
                    actionModal.value = '002';
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
        columns: [
            { title: 'ID', data: "correlativo" },
            { title: 'Código', data: "codigo_articulo" },
            { title: 'Cantidad', data: "cantidad" },
            { title: 'Descripción', data: "descripcion" },
            { title: 'Serie', data: "serie" },
            { title: 'Precio unidad', data: "precio_unidad" },
            { title: 'Total', data: "total" },
            {
                title: 'Tipo de devolución',
                data: null,
                render: function (data, type, row) {
                    return `
                        <div class="flex flex-row gap-2 items-center justify-between">
                            <label class="inline-flex items-center">
                                <input type="radio" name="tipoDevolucion_${row.codigo_articulo}" value="Efectivo" class="form-radio h-5 w-5 text-blue-600">
                                <span class="ml-2">Efectivo</span>
                            </label>
                            <label class="inline-flex items-center">
                                <input type="radio" name="tipoDevolucion_${row.codigo_articulo}" value="Producto" class="form-radio h-5 w-5 text-blue-600">
                                <span class="ml-2">Producto</span>
                            </label>
                        </div>
                    `;
                }
            },
        ],
        searching: false,
        select: false,
        responsive: true,
        paging: true,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    buttonCancel.addEventListener('click', () => {
        clearInput(formRepayment);
        clearAll();
    });

    buttonClose.addEventListener('click', () => {
        clearInput(formRepayment);
        clearAll();
    });

    function clearAll() {
        items = [];

        modal.querySelector('#gridDetail').classList.remove('hidden');
        modal.querySelector('#gridDetail').classList.add('grid');

        modal.querySelector('#gridReturn').classList.add('hidden');
        modal.querySelector('#gridReturn').classList.remove('grid');

        modal.querySelector('#btnModal').disabled = false;
        modal.querySelector('#btnModal').classList.remove('hidden');

        tblItems.column(7).visible(true);
        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    }

    buttonSearch.addEventListener('click', async () => {
        let code = formRepayment.querySelector('#txtCode').value;

        if (!validateRequired(code)) {
            alert("Campo requerido", "Debe ingresar un código de entrega.", 'warning', 'Ok', true);
            return;
        }

        let response = await read(`../../app/controllers/RepaymentController.php?repayment=${code}`);

        if (!response || !response.length) {
            alert("Error", "No se encontraron resultados.", 'warning', 'Ok', true);
            return;
        }

        modal.querySelector('#txtReceiver').value = response[0].cliente;
        modal.querySelector('#txtResponsible').value = response[0].responsable;
        modal.querySelector('#txtDateInit').value = response[0].fecha_transaccion;
        modal.querySelector('#txtDateEnd').value = response[0].fecha_vencimiento;
        modal.querySelector('#txtNote').value = response[0].nota;
        modal.querySelector('#txtInvoiceID').value = response[0].codigo_factura;

        let details = response[0].details;

        items.splice(0, items.length);
        items.push(...details);

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    });

    formRepayment.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector('#txtAction').value;

        switch (option) {
            case '001':
                let selectedRepayment = getSelectedRepayment();

                if (validateForm()) {
                    if (selectedRepayment.length === 0) {
                        alert('Error', 'Debe seleccionar el tipo de devolución.', 'warning', 'Ok', true);
                        return;
                    }

                    let dataSave = {
                        codigo: modal.querySelector('#txtCode').value,
                        codigo_factura: modal.querySelector('#txtInvoiceID').value,
                        cliente: modal.querySelector('#txtReceiver').value,
                        responsable: modal.querySelector('#txtResponsible').value,
                        fecha_transaccion: modal.querySelector('#txtDateInit').value,
                        fecha_vencimiento: modal.querySelector('#txtDateEnd').value,
                        nota: modal.querySelector('#txtNote').value,
                        items: selectedRepayment,
                    }

                    let response = await send(dataSave, option);

                    console.log(response);

                    if (response) {
                        let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
                        let icon = response?.success ? 'success' : 'warning';

                        alert(title, response.message, icon, 'Ok', true);
                    }

                    tableRepayments.ajax.reload();
                    buttonClose.click();
                }
                break;
            default:
                break;
        }

        function validateForm() {
            if (!validateRequired(modal.querySelector('#txtAction').value)) {
                alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtInvoiceID').value)) {
                alert("Error", "Por favor refresque la pagina.", 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtCode').value)) {
                alert('Campo requerido', 'Por favor ingrese un código de entrega.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtReceiver').value)) {
                alert('Campo requerido', 'Por favor ingrese el nombre de la persona que recibe el documento.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtResponsible').value)) {
                alert('Campo requerido', 'Por favor ingrese el nombre del responsable.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtDateInit').value)) {
                alert('Campo requerido', 'Por favor ingrese la fecha de creación del documento.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modal.querySelector('#txtDateEnd').value)) {
                alert('Campo requerido', 'Por favor ingrese la fecha de vencimiento del documento.', 'warning', 'Ok', true);
                return false;
            }

            if (items.length === 0) {
                alert('Error de validación', 'Por favor ingrese al menos un item.', 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    });

    function getSelectedRepayment() {
        const selectedDevoluciones = [];

        tblItems.rows().every(function (rowIdx, tableLoop, rowLoop) {
            const rowData = this.data();
            const codigo_articulo = rowData.codigo_articulo;
            const tipo_devolucion = document.querySelector(`input[name="tipoDevolucion_${codigo_articulo}"]:checked`);

            if (tipo_devolucion) {
                selectedDevoluciones.push({
                    codigo_articulo: codigo_articulo,
                    tipo_devolucion: tipo_devolucion.value,
                    cantidad: rowData.cantidad,
                    descripcion: rowData.descripcion,
                    serie: rowData.serie,
                    precio_unidad: rowData.precio_unidad,
                    total: rowData.total,
                });
            }
        });

        return selectedDevoluciones;
    }
});
