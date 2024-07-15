import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, destroy, read } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal, items, tblItems) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            modal.querySelector('#txtDate').value = new Date().toISOString().split('T')[0];
            setModalTitle('modalTitle', 'Agregar nueva entrada');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '005':
            setFormReadOnly('frmEntry');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Ver entrada', 'btnModal', 'Ver entrada', items, tblItems);
            break;
        default:
            console.log('error');
            break;
    }
}

async function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName, items, tblItems) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    const response = await read(`../../app/controllers/EntryController.php?entry=${selectedRowData.codigo}`);
    const details = response[0].details;

    if (response) {
        modal.querySelector('#txtCode').value = response[0]?.codigo;
        modal.querySelector('#txtProvider').value = response[0]?.Proveedor;
        modal.querySelector('#txtRTNProvider').value = response[0]?.rtn;
        modal.querySelector('#txtLogistic').value = response[0]?.oficialuno;
        modal.querySelector('#txtDate').value = response[0]?.fecha;
        modal.querySelector('#txtResponsible').value = response[0]?.responsable;
        modal.querySelector('#txtNote').value = response[0]?.observacion;
        modal.querySelector('#txtTypeEntry').value = response[0]?.tipo;
        modal.querySelector('#txtAuditor').value = response[0]?.oficialdos;
        modal.querySelector('#txtOficial').value = response[0]?.oficialtres;

        items.push(...details);

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

    modal.querySelector(`#${buttonModalID}`).disabled = true;
    modal.querySelector(`#${buttonModalID}`).classList.add('hidden');
    modal.querySelector('#btnAdd').disabled = true;
    modal.querySelector('#btnAdd').classList.add('hidden');
    modal.querySelector('#btnPrint').disabled = false;
    modal.querySelector('#btnPrint').classList.remove('hidden');
    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/EntryController.php';

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