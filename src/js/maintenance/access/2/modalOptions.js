import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../../module/modal-min.js'
import { alert } from '../../../module/alert-min.js'
import { create, update, destroy } from '../../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Asignar Acceso');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '002':
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Editar Acceso', 'btnModal', 'Editar acceso');
            break;
        case '003':
            setFormReadOnly('frmAccess');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Eliminar Acceso', 'btnModal', 'Eliminar acceso');
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
    modal.querySelector('#txtAccess').value = selectedRowData.nombre;
    modal.querySelector('#txtAddress').value = selectedRowData.direccion;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/AccessController.php';

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