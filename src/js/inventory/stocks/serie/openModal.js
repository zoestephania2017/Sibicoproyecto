import { setModalTitle, setNameModalButton } from '../../../module/modal-min.js'
import { create, destroy } from '../../../module/services/services-min.js'

export default function openModal(e, dt, node, config, modal, buttonModal) {
    let action = modal.querySelector('#txtAction').value;

    switch (action) {
        case '001':
            setModalTitle('modalTitle', 'Agregar Serie');
            setNameModalButton('btnModal', 'Guardar datos');
            buttonModal.click();
            break;
        default:
            break;
    }
}

export async function send(data = {}, option = '001') {
    const url = '../../../app/controllers/SerieController.php';

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