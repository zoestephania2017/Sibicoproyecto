import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, destroy, read } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal, items, assignTotal, tblItems) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Agregar nueva consignación');
            setNameModalButton('btnModal', '<i class="fa-solid fa-circle-plus"></i> Guardar datos');
            buttonModal.click();
            break;
        case '005':
            setFormReadOnly('frmConsignment');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Ver consignación', 'btnModal', 'Ver consignación', items, assignTotal, tblItems);
            break;
        default:
            console.log('error');
            break;
    }
}

async function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName, items, assignTotal, tblItems) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    const response = await read(`../../app/controllers/ConsignmentController.php?consignment=${selectedRowData.codigo_factura}`);
    const details = response[0].details;

    if (response) {
        modal.querySelector('#txtCode').value = response[0]?.codigo_factura;
        modal.querySelector('#txtConsignment').value = response[0]?.numero;
        modal.querySelector('#txtClient').value = response[0]?.cliente;
        modal.querySelector('#txtDate').value = response[0]?.fecha_creacion;
        modal.querySelector('#txtDateExpiration').value = response[0]?.fecha_vencimiento;
        modal.querySelector('#txtResponsible').value = response[0]?.responsable;
        modal.querySelector('#txtNote').value = response[0]?.nota;

        items.push(...details);
        assignTotals(assignTotal, details, response[0]);

        let deleteButtons = tblItems.table().container().querySelectorAll('.btn-delete');

        if (deleteButtons && deleteButtons.length > 0) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].classList.add('disabled');
            }
        }

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    }

    modal.querySelector('#btnPrint').classList.remove('hidden');
    modal.querySelector('#btnPrint').disabled = false;
    modal.querySelector(`#${buttonModalID}`).disabled = true;
    modal.querySelector(`#${buttonModalID}`).classList.add('hidden');
    modal.querySelector('#txtDiscountCheck').classList.add('hidden');
    modal.querySelector('#txtISVCheck').classList.add('hidden');
    modal.querySelector('#btnAdd').disabled = true;
    modal.querySelector('#btnAdd').classList.add('hidden');
    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

function assignTotals(assignTotal, details, consignment) {
    let subtotal = 0.0;
    let discount = parseFloat(consignment.descuento);
    let isv = parseFloat(consignment.impuesto);
    let total = 0.0;

    details.forEach(element => {
        subtotal += parseFloat(element.total);
    })

    total = Math.round((subtotal - discount + isv) * 100) / 100;

    assignTotal(subtotal, discount, isv, total);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/ConsignmentController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    switch (option) {
        case '001':
            return await create(data, url);
        case '002':
            return await destroy(data, url);
        default:
    }
}