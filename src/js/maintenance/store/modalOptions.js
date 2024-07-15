import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, update, destroy } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Crear Tienda');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '002':
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Editar Tienda', 'btnModal', 'Editar tienda');
            break;
        case '003':
            setFormReadOnly('frmStore');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Eliminar Tienda', 'btnModal', 'Eliminar tienda');
            break;
        default:
            console.log('error');
            break;
    }
}

function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    modal.querySelector('#txtCode').value = selectedRowData.codigo;
    modal.querySelector('#txtName').value = selectedRowData.nombre;
    modal.querySelector('#txtRTN').value = selectedRowData.rtn;
    modal.querySelector('#txtAddress').value = selectedRowData.direccion;
    modal.querySelector('#txtPhone').value = selectedRowData.telefono;
    modal.querySelector('#txtDate').value = selectedRowData.fecha_limite_emision;
    modal.querySelector('#txtManager').value = selectedRowData.cai;
    modal.querySelector('#txtOrder').value = selectedRowData.orden_compra;
    modal.querySelector('#txtExonerations').value = selectedRowData.exoneraciones;
    modal.querySelector('#txtAgriculture').value = selectedRowData.agricultura;
    modal.querySelector('#txtInvoiceInit').value = selectedRowData.facturai;
    modal.querySelector('#txtInvoiceEnd').value = selectedRowData.facturaf;
    modal.querySelector('#txtType').value = selectedRowData.tipo;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/StoreController.php';

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
            return await update(data, url);
        case '003':
            return await destroy(data, url);
        default:
    }
}