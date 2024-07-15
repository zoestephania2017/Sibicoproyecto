import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, read } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal, items, tblItems) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Crear Devolución');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '002':
            setFormReadOnly('frmRepayment');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Ver Devolución', 'btnModal', 'Ver devolución', items, tblItems);
        default:
            break;
    }
}

async function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName, items, tblItems) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    const response = await read(`../../app/controllers/RepaymentController.php?id=${selectedRowData.correlativo}`);
    const details = response[0].details;

    if (response) {
        modal.querySelector('#gridDetail').classList.add('hidden');
        modal.querySelector('#gridDetail').classList.remove('grid');

        modal.querySelector('#gridReturn').classList.remove('hidden');
        modal.querySelector('#gridReturn').classList.add('grid');

        modal.querySelector('#txtReturn').value = response[0]?.correlativo;
        modal.querySelector('#txtInvoice').value = response[0]?.codigo_factura;
        modal.querySelector('#txtDateReturnInit').value = response[0]?.fecha;
        modal.querySelector('#txtResponsibleReturn').value = 'N/A';

        items.push(...details);

        tblItems.column(7).visible(false);
        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    }

    modal.querySelector(`#${buttonModalID}`).disabled = true;
    modal.querySelector(`#${buttonModalID}`).classList.add('hidden');
    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/RepaymentController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    switch (option) {
        case '001':
            return await create(data, url);
        default:
    }
}