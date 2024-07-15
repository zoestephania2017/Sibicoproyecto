import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, update, destroy } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Crear Modelo');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '002':
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Editar Modelo', 'btnModal', 'Editar modelo');
            break;
        case '003':
            setFormReadOnly('frmModel');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Eliminar Modelo', 'btnModal', 'Eliminar modelo');
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

    modal.querySelector('#txtCode').value = selectedRowData.codigo_modelo;
    modal.querySelector('#txtName').value = selectedRowData.nombre_modelo;
    modal.querySelector('#txtBrand').value = selectedRowData.codigo_marca;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/ModelController.php';

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