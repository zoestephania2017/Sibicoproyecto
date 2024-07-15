import { alert } from '../../module/alert-min.js';
import { setModalTitle, setNameModalButton } from '../../module/modal-min.js';
import { update } from '../../module/services/services-min.js';

export default function openModalCreate(e, dt, node, config, modal, buttonModal) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtActionExist').value;

    switch (action) {
        case '001':
            setParameters(selectedRowData, modal, buttonModal, 'modalTitleExist', 'Agregar Existencias', 'btnModalExist', 'Agregar existencias');
            break;
    }
}

async function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    modal.querySelector('#txtCodeExist').value = selectedRowData.codigo_articulo;
    modal.querySelector('#txtArticleExist').value = selectedRowData.nombre_articulo;
    modal.querySelector('#txtQuantityExist').value = selectedRowData.disponibilidad;

    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/StockController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    switch (option) {
        case '001':
            return await update(data, url);
    }
}