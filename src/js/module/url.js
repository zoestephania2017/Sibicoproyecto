export function getUrlParameter(name) {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams.get(name);
}

export function validateVariable(name) {
    const value = getUrlParameter(name);

    if (!value) {
        return {
            exists: false,
            value: null,
            isEmpty: true,
        };
    }

    return {
        exists: true,
        value,
        isEmpty: value === '',
    };
}