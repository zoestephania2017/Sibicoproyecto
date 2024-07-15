import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, update, destroy } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Crear Usuario');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '002':
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Editar Usuario', 'btnModal', 'Editar usuario');
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

    modal.querySelector('#txtCode').value = selectedRowData.correlativo;
    modal.querySelector('#txtName').value = selectedRowData.nombre;
    modal.querySelector('#txtSurname').value = selectedRowData.apellido;
    modal.querySelector('#txtAddress').value = selectedRowData.direccion;
    modal.querySelector('#txtUser').value = selectedRowData.usuario;
    modal.querySelector('#txtLandlinePhone').value = selectedRowData.telefono_fijo;
    modal.querySelector('#txtMobilePhone').value = selectedRowData.telefono_movil;
    modal.querySelector('#txtProfile').value = selectedRowData.codigo_perfil;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/UserController.php';

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

export async function operations(data = {}) {
    const url = '../../app/controllers/OperationController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    return await update(data, url);
}