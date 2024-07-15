export async function create(data, url) {
    const { data: responseData } = await axios.post(url, data);
    return responseData;
}

export async function update(data, url) {
    const { data: responseData } = await axios.put(url, data);
    return responseData;
}

export async function destroy(data, url) {
    const { data: responseData } = await axios.delete(url, { data: data, });
    return responseData;
}

export async function readOne(data, url) {
    const { data: responseData } = await axios.get(url, data);
    return responseData;
}

export async function read(url) {
    const { data: responseData } = await axios.get(url);
    return responseData;
}

export async function getInvoice(urlServer, name) {
    try {
        const response = await axios.get(urlServer, { responseType: 'blob' });

        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadLink.href = url;
        downloadLink.setAttribute('download', `${name}.pdf`);

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error al descargar el archivo PDF', error);
        return false;
    }
}

export async function viewInvoice(urlServer) {
    try {
        const newTab = window.open(urlServer, '_blank');
        newTab.focus();
    } catch (error) {
        console.log('Error al descargar el archivo PDF', error);
        return false;
    }
}

export async function postInvoice(data, urlServer, name) {
    try {
        const response = await axios.post(urlServer, data, { responseType: 'blob' });

        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([response.data]));
        downloadLink.href = url;
        downloadLink.setAttribute('download', `${name}.pdf`);

        document.body.appendChild(downloadLink);
        downloadLink.click();

        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error al descargar el archivo PDF', error);
        return false;
    }
}

export async function getUser() {
    const { data: responseData } = await axios.get('../../app/controllers/UserProfileController.php');
    return responseData;
}

export async function getDocument(urlServer, name, extension) {
    try {
        const response = await axios.get(urlServer, { responseType: 'blob' });
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([response.data]));

        downloadLink.href = url;
        downloadLink.setAttribute('download', `${name}.${extension}`);
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        window.URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error al descargar el archivo PDF', error);
        return false;
    }
}