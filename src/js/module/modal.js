export function setModalTitle(id = '', title = 'Default title') {
    const modalTitle = getValidElement(id);
    modalTitle.innerHTML = title;
}

export function setNameModalButton(id = '', name = 'Default name') {
    const buttonModal = getValidElement(id);
    buttonModal.innerHTML = name;
}

export function clearInput(component, removeReadonly = true, readonlyInputIds = [], removeHidden = []) {
    if (component) {
        const inputs = component.querySelectorAll('input, textarea, select');
        inputs.forEach((input) => {
            const isHiddenAndReadOnly = removeHidden.includes(input.id) && readonlyInputIds.includes(input.id);

            if (removeHidden.includes(input.id) && !isHiddenAndReadOnly) {
                input.classList.remove('hidden');
            }

            if (readonlyInputIds.includes(input.id) && !isHiddenAndReadOnly) {
                input.readOnly = true;
                input.setAttribute('disabled', 'disabled');
            }

            if (!isHiddenAndReadOnly) {
                clearInputValue(input);

                if (removeReadonly) {
                    input.removeAttribute('readonly');
                }

                input.removeAttribute('disabled');
            }
        });
    }
}

export function setFormReadOnly(formId) {
    const form = getValidElement(formId);
    const elements = form.querySelectorAll('input, textarea, select');

    elements.forEach((element) => {
        element.readOnly = true;
        element.setAttribute('disabled', 'disabled');
    });
}

export function getValidElement(id) {
    let formattedId = id;
    if (!formattedId.includes('#') && !formattedId.includes('.')) {
        formattedId = `#${formattedId}`;
    }
    const element = document.querySelector(formattedId);
    return element || document.querySelector('#');
}

function clearInputValue(input) {
    const type = input.type;
    switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'number':
        case 'tel':
        case 'hidden':
        case 'textarea':
        case 'date':
        case 'time':
            input.value = '';
            break;
        case 'checkbox':
        case 'radio':
            input.checked = false;
            break;
        case 'select-one':
            input.value = '';
            break;
        case 'select-multiple':
            input.selectedIndex = -1;
            break;
        default:
            break;
    }
}