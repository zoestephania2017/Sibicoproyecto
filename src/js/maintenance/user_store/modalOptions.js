import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, update, destroy } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Asignar Tienda a Usuario');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '003':
            setFormReadOnly('frmUser');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Eliminar Usuario', 'btnModal', 'Eliminar usuario');
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

    modal.querySelector('#txtStore').value = selectedRowData.codigo;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/OperationController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    switch (option) {
        case '001':
            return await create(data, url);
        case '003':
            return await destroy(data, url);
        default:
    }
}