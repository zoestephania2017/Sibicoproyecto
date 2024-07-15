import { setModalTitle, setNameModalButton, setFormReadOnly } from '../../module/modal-min.js'
import { alert } from '../../module/alert-min.js'
import { create, destroy, read } from '../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal, items, tblItems) {
    var selectedRowData = dt.row({ selected: true }).data();
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            modal.querySelector('#txtDate').value = new Date().toISOString().split('T')[0];
            setModalTitle('modalTitle', 'Crear Acta de Entrega');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        case '005':
            setFormReadOnly('frmSale');
            setParameters(selectedRowData, modal, buttonModal, 'modalTitle', 'Ver Acta de Entrega', 'btnModal', 'Ver acta de entrega', items, tblItems);
            break;
        default:
            break;
    }
}

async function setParameters(selectedRowData, modal, buttonModal, modalTitleID, modalTitle, buttonModalID, buttonName, items, tblItems) {
    if (!selectedRowData) {
        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
        return;
    }

    let response = await read(`../../app/controllers/SaleController.php?sale=${selectedRowData.codigo_factura}`);
    const details = response[0].details;

    modal.querySelector('#txtCode').value = response[0]?.codigo_factura;
    modal.querySelector('#txtTypeDocument').value = response[0]?.acta;
    modal.querySelector('#txtDate').value = response[0]?.fecha_transaccion;
    modal.querySelector('#txtReceiver').value = response[0]?.cliente;
    modal.querySelector('#txtNote').value = response[0]?.nota;
    modal.querySelector('#txtPhone').value = response[0]?.telefono;
    modal.querySelector('#txtDelivery').value = response[0]?.responsable;
    modal.querySelector('#txtInstitution').value = response[0]?.codigo_institucion;
    modal.querySelector('#txtRTN').value = response[0]?.rtn;
    modal.querySelector('#txtPosition').value = response[0]?.cargo;
    modal.querySelector('#divCorrelative').classList.remove('hidden');
    modal.querySelector('#txtCorrelative').value = response[0]?.numero;

    let total = getTotal(details);

    modal.querySelector('#txtTotal1').value = total;
    modal.querySelector('#txtTotal').value = total;
    modal.querySelector('#txtISVEx').value = response[0]?.importe_exonerado;
    modal.querySelector('#txtISVExempt').value = response[0]?.importe_exento;
    modal.querySelector('#txtIGV15').value = response[0]?.importe_gravado_15;
    modal.querySelector('#txtIGV18').value = response[0]?.importe_gravado_18;
    modal.querySelector('#txtISV15').value = response[0]?.impuesto;
    modal.querySelector('#txtISV18').value = response[0]?.impuesto_18;

    if (response) {

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
    modal.querySelector('#divCost1').classList.add('hidden');
    modal.querySelector('#divCost2').classList.add('hidden');
    modal.querySelector('#divCost3').classList.add('hidden');
    modal.querySelector('#divTotal').classList.remove('hidden');
    modal.querySelector('#btnAdd').disabled = true;
    modal.querySelector('#btnAdd').classList.add('hidden');
    modal.querySelector('#btnPrint').disabled = false;
    modal.querySelector('#btnPrint').classList.remove('hidden');
    buttonModal.click();
    setModalTitle(modalTitleID, modalTitle);
    setNameModalButton(buttonModalID, buttonName);
}

function getTotal(details) {
    let total = 0.0;

    details.forEach(element => {
        total += parseFloat(element.total);
    });

    return total;
}

export async function send(data = {}, option = '001') {
    const url = '../../app/controllers/SaleController.php';

    if (!data) {
        return {
            success: false,
            message: 'Los datos son requeridos.',
        }
    }

    switch (option) {
        case '001':
            return await create(data, url);
        case '001C':
            return await create(data, '../../app/controllers/ClientController.php');
        case '002':
            return await destroy(data, url);
        default:
    }
}