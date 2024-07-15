import { setModalTitle, setNameModalButton } from '../../module/modal-min.js'
import { create } from '../../module/services/services-min.js'

export default function openModalCreate(e, dt, node, config, modal, buttonModal) {
    let action = modal.querySelector('#txtActionCreate').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitleCreate', 'Crear un nuevo producto');
            setNameModalButton('btnModalCreate', 'Guardar datos');
            buttonModal.click();
            break;
        default:
            console.log('error');
            break;
    }
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
            return await create(data, url);
    }
}