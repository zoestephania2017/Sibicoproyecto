import { read } from './services/services-min.js'
import { getValidElement } from './modal-min.js'

export default async function createSelectOptions(id, url, idSelect = "codigo", field = "") {
    let data = await read(url);

    const select = getValidElement(id);

    select.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerHTML = "Seleccione una opción";
    select.appendChild(defaultOption);

    if (data) {
        data.forEach(element => {
            const option = document.createElement('option');
            option.value = element[idSelect];
            option.innerHTML = element[field];
            select.appendChild(option);
        });
    }

    return data;
}


export function resetSelectOptions(id) {
    const select = getValidElement(id);

    while (select.firstChild) {
        select.removeChild(select.firstChild);
    }

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.innerHTML = 'Seleccione una opción';
    select.appendChild(defaultOption);
}