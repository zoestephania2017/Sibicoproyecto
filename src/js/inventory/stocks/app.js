import { validateVariable } from "../../module/url-min.js";
import openModalCreate, { send } from "./openModalCreate-min.js";
import openModalExists, { send as sendExists } from "./openModalExists-min.js";
import createSelectOptions from "../../module/select-min.js";
import { read } from "../../module/services/services-min.js";
import { clearInput } from "../../module/modal-min.js";
import { alert } from "../../module/alert-min.js";
import { validateNumber, validateRequired } from "../../module/validate-min.js";
import { generateSerie } from "../../module/generate-min.js";

document.addEventListener('DOMContentLoaded', async () => {
    const buttonAdd = document.querySelector('#btnAdd');
    const buttonGenerateSerieCreate = document.querySelector('#btnGenerateSerieCreate');

    const buttonModalCreate = document.querySelector('#buttonModalCreate');
    const buttonModalExist = document.querySelector('#buttonModalExist');
    const buttonModalKardex = document.querySelector('#buttonModalKardex');
    const buttonModalShow = document.querySelector('#buttonModalShow');

    const buttonCloseCreate = document.querySelector('#btnCloseCreate');
    const buttonCloseExist = document.querySelector('#btnCloseExist');
    const buttonCloseKardex = document.querySelector('#btnCloseKardex');

    const buttonCancelCreate = document.querySelector('#btnCancelCreate');
    const buttonCancelExist = document.querySelector('#btnCancelExist');
    const buttonCancelKardex = document.querySelector('#btnCancelKardex');

    const modalCreate = document.querySelector('#modalCreate');
    const modalExists = document.querySelector('#modalExist');
    const modalShow = document.querySelector('#modalShow');

    const formCreate = document.querySelector('#frmCreate');
    const formExists = document.querySelector('#frmExist');

    const actionModalCreate = modalCreate.querySelector('#txtActionCreate');
    const actionModalExist = modalExists.querySelector('#txtActionExist');

    const radios = document.querySelectorAll('[name="radioOptions"]');
    const txtInputArticle = document.getElementById('txtInputArticle');
    const txtSelectArticle = document.getElementById('txtSelectArticle');

    let items = [];
    let tblKardex = null;
    let radioSelected = 'txtNewArticle';
    let showNotifications = true;

    let tableStocks = new DataTable('#tblStocks', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/StockController.php',
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Codigo', data: "codigo_articulo" },
            { title: 'Tipo', data: "tipo" },
            { title: 'Nombre del articulo', data: "nombre_articulo" },
            { title: 'Serie', data: "serie" },
            { title: 'Disponible', data: "disponibilidad" },
            { title: 'Imagen', data: "imagen" },
            { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fas fa-folder-plus text-green-500"></i> Agregar nuevo',
                action: function (e, dt, node, config) {
                    actionModalCreate.value = '001';
                    openModalCreate(e, dt, node, config, modalCreate, buttonModalCreate);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-plus-square text-emerald-500"></i> Agregar existencias',
                action: function (e, dt, node, config) {
                    actionModalExist.value = '001';
                    openModalExists(e, dt, node, config, modalExists, buttonModalExist);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-barcode text-blue-500"></i> Números de serie',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    window.location.href = `../../dashboard/inventory/serie/?product=${selectedRowData.codigo_articulo}`;
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-clipboard text-orange-500"></i> Kardex',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    loadKardex(selectedRowData.codigo_articulo);
                    buttonModalKardex.click();
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-info-circle text-sky-500"></i> Información del producto',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    modalShow.querySelector('#txtArticleShow').value = selectedRowData.nombre_articulo;
                    modalShow.querySelector('#txtQuantityShow').value = selectedRowData.disponibilidad;
                    modalShow.querySelector('#txtSerieShow').value = selectedRowData.serie;
                    buttonModalShow.click();
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        },
        drawCallback: function (settings) {
            const data = Array.from(this.api().rows().data());

            if (showNotifications && data && data.length > 0) {
                const currentDate = new Date();

                const expiringTodayOrSoon = data.filter(product => {
                    if (!product.fecha_vencimiento) {
                        return false;
                    }

                    const expirationDate = new Date(product.fecha_vencimiento);
                    const sevenDaysLater = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

                    return expirationDate <= sevenDaysLater;
                });

                expiringTodayOrSoon.forEach(product => {
                    const expirationDate = new Date(`${product.fecha_vencimiento}T00:00:00-06:00`);
                    const currentTime = new Date();

                    if (expirationDate.toDateString() === currentTime.toDateString()) {
                        const title = 'Producto que vence hoy.';
                        const message = `El producto <span class="font-bold">${product.nombre_articulo}</span> con el código <span class="font-bold">(${product.codigo_articulo})</span> vence hoy.`;
                        showNotification(title, message);
                        return;
                    }

                    if (expirationDate < currentTime) {
                        return;
                    }

                    const timeDiff = expirationDate - currentTime;
                    const daysRemaining = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                    const hoursRemaining = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

                    let timeMessage = '';
                    if (daysRemaining > 0) {
                        timeMessage += `${daysRemaining} día${daysRemaining > 1 ? 's' : ''}`;
                    }
                    if (hoursRemaining > 0) {
                        if (timeMessage !== '') {
                            timeMessage += ' y ';
                        }
                        timeMessage += `${hoursRemaining} hora${hoursRemaining > 1 ? 's' : ''}`;
                    }

                    if (timeMessage !== '') {
                        const title = 'Producto próximo a vencer';
                        const message = `El producto <span class="font-bold">${product.nombre_articulo}</span> con el código <span class="font-bold">(${product.codigo_articulo})</span> vence en <span class="font-semibold italic">${timeMessage}</span>.`;
                        showNotification(title, message);
                    }
                });

                showNotifications = false;
            }
        }
    });

    buttonGenerateSerieCreate.addEventListener('click', () => {
        let serie = generateSerie(5, 3);

        if (validateRequired(modalCreate.querySelector('#txtSeries').value)) {
            modalCreate.querySelector('#txtSeries').value = '';
        }

        modalCreate.querySelector('#txtSeries').value = serie;
    })

    let tblItems = new DataTable('#tblItems', {
        dom: 'Bfrtip',
        async: true,
        dataSrc: items,
        columns: [
            { title: 'ID', data: "id" },
            { title: 'Cantidad', data: "cantidad" },
            { title: 'Articulo', data: "articulo" },
            { title: 'Serie', data: "serie" },
            { title: 'Precio Unitario', data: "precio_unidad" },
            { title: 'Imagen', data: "imagen" },
            { title: 'Tipo', data: "tipo" },
            { title: 'Unidad', data: "unidad" },
            { title: 'Peso', data: "peso" },
            { title: 'Medida', data: "medida" },
            { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
        ],
        searching: false,
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-trash text-rose-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert(
                            "Aviso",
                            "Debe seleccionar un registro para eliminar.",
                            "info",
                            "OK",
                            false
                        );
                        return;
                    }

                    deleteItem(selectedRowData.id);
                },
                className: "btn-delete font-bold",
            },
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    await createSelectOptions('#txtType', '../../app/controllers/StockController.php?type=true', 'codigo', 'nombre');
    await assignArticles();

    formCreate.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modalCreate.querySelector('#txtActionCreate').value;

        switch (option) {
            case '001':
                if (validateFormCreate()) {
                    let dataSave = {
                        items: items
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success
                            ? "Transacción exitosa"
                            : "Error en la transacción";
                        let icon = response?.success ? "success" : "warning";

                        alert(title, response.message, icon, "Ok", true);
                    }

                    tableStocks.ajax.reload();
                    buttonCloseCreate.click();
                } else buttonModalCreate.click();
                break;
            default:
                break;
        }

        function validateFormCreate() {
            if (!validateRequired(actionModalCreate.value)) {
                alert('Aviso', 'Al parecer hay un error, por favor refresque la pagina.', 'warning', 'Ok', true);
                return false;
            }

            if (items.length === 0) {
                alert('Aviso', 'Debe agregar al menos un articulo.', 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    });

    formExists.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modalExists.querySelector('#txtActionExist').value;

        switch (option) {
            case '001':
                if (validateFormExists()) {
                    let dataSave = {
                        codigo: modalExists.querySelector('#txtCodeExist').value,
                        cantidad: modalExists.querySelector('#txtQuantity2Exist').value,
                        cantidad_disponible: modalExists.querySelector('#txtQuantityExist').value,
                        precio: modalExists.querySelector('#txtPriceExist').value,
                        descripcion: modalExists.querySelector('#txtDescriptionExist').value || 'N/A',
                    }

                    let response = await sendExists(dataSave, option);

                    if (response) {
                        let title = response?.success
                            ? "Transacción exitosa"
                            : "Error en la transacción";
                        let icon = response?.success ? "success" : "warning";

                        alert(title, response.message, icon, "Ok", true);
                    }

                    tableStocks.ajax.reload();
                    buttonCloseExist.click();
                } else buttonModalExist.click();
                break;
            default:
                break;
        }

        function validateFormExists() {
            if (!validateRequired(modalExists.querySelector('#txtCodeExist').value)) {
                alert('Aviso', 'Al parecer hay un error, por favor refresque la pagina.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateNumber(modalExists.querySelector('#txtCodeExist').value)) {
                alert('Aviso', 'Al parecer hay un error, por favor refresque la pagina.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalExists.querySelector('#txtArticleExist').value)) {
                alert('Aviso', 'El nombre del articulo es requerido.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalExists.querySelector('#txtPriceExist').value)) {
                alert('Aviso', 'El precio unitario es requerido.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateNumber(modalExists.querySelector('#txtQuantityExist').value)) {
                alert('Aviso', 'La cantidad disponible es requerida.', 'warning', 'Ok', true);
                return false;
            }

            if (!validateRequired(modalExists.querySelector('#txtQuantity2Exist').value)) {
                alert('Aviso', 'La cantidad es requerida.', 'warning', 'Ok', true);
                return false;
            }

            return true;
        }
    })

    txtSelectArticle.addEventListener('change', async () => {
        let productID = txtSelectArticle.value;

        let product = await read(`../../app/controllers/StockController.php?single=true&product=${productID}`);

        modalCreate.querySelector('#txtCodeCreate').value = product[0].codigo;
        modalCreate.querySelector('#txtMeasure').value = product[0].unidad;
        modalCreate.querySelector('#txtWeight').value = product[0].peso;
        modalCreate.querySelector('#txtVolume').value = product[0].volumen;
        modalCreate.querySelector('#txtSeries').value = product[0].serie;
        modalCreate.querySelector('#txtExpiration').value = product[0].fecha_vencimiento;
    });

    async function assignArticles() {
        const articles = await read('../../app/controllers/StockController.php?only=true');
        let select = document.querySelector('#txtSelectArticle');

        for (let i = 0; i < articles.length; i++) {
            select.innerHTML += `<option value="${articles[i].codigo}">${articles[i].descripcion}</option>`
        }
    }

    function deleteItem(id) {
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items.splice(index, 1);

            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();
        }
    }

    radios.forEach(radio => {
        radio.addEventListener('click', function () {
            if (radio.id === 'txtNewArticle') {
                txtInputArticle.classList.remove('hidden');
                txtSelectArticle.classList.add('hidden');

                radioSelected = 'txtNewArticle';
            } else if (radio.id === 'txtExistArticle') {
                txtInputArticle.classList.add('hidden');
                txtSelectArticle.classList.remove('hidden');

                radioSelected = 'txtExistArticle';
            }
        });

        radio.addEventListener('change', function () {
            if (radio.id === 'txtNewArticle') {
                modalCreate.querySelector('#txtMeasure').value = '';
                modalCreate.querySelector('#txtWeight').value = '0';
                modalCreate.querySelector('#txtPrice').value = '0';
                modalCreate.querySelector('#txtVolume').value = '0';
                modalCreate.querySelector('#txtSeries').value = '';
            }
        })
    });

    await validateIsExist();

    function loadKardex(productID = null) {
        if (tblKardex) {
            tblKardex.destroy();
        }

        tblKardex = new DataTable('#tblKardex', {
            dom: 'Bfrtip',
            async: true,
            ajax: {
                url: `../../app/controllers/StockController.php?kardex=true&product=${productID}`,
                type: 'GET',
                dataSrc: '',
            },
            pageLength: 30,
            loading: true,
            columns: [
                { title: 'Fecha transacción', data: "fecha_transaccion" },
                { title: 'Tipo', data: "nombre_tipo_documento" },
                { title: 'Código documento', data: "codigo_documento" },
                { title: 'Cantidad', data: "cantidad" },
                { title: 'Precio unitario', data: "precio_unidad" },
                { title: 'Descripción', data: "observaciones" },
                { title: 'Disponible', data: "cantidad_acum" },
                { title: 'Costo promedio', data: "valor_unidad_acum" },
                { title: 'Valor total acumulado', data: "valor_total_acum" },
            ],
            select: false,
            responsive: true,
            paging: true,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            }
        });
    }

    buttonCancelKardex.addEventListener('click', () => {
        tblKardex.destroy();
        tblKardex = null;
    });

    buttonCancelCreate.addEventListener('click', () => {
        clearInput(formCreate);
        items = [];

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    });

    buttonCloseKardex.addEventListener('click', () => {
        tblKardex.destroy();
        tblKardex = null;
    });

    buttonCloseCreate.addEventListener('click', () => {
        clearInput(formCreate);
        items = [];

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    });

    buttonCloseExist.addEventListener('click', () => {
        clearInput(formExists);
    });

    buttonCancelExist.addEventListener('click', () => {
        clearInput(formExists);
    })

    buttonAdd.addEventListener('click', () => {
        if (!validateRequired(modalCreate.querySelector('#txtType').value)) {
            alert('Aviso', 'Debe seleccionar un tipo.', 'info', 'OK', false);
            return;
        }

        if (radioSelected === 'txtNewArticle') {
            if (!validateRequired(txtInputArticle.value)) {
                alert('Aviso', 'Debe ingresar un artículo.', 'info', 'OK', false);
                return;
            }
        } else if (radioSelected === 'txtExistArticle') {
            if (!validateRequired(txtSelectArticle.value)) {
                alert('Aviso', 'Debe seleccionar un artículo.', 'info', 'OK', false);
                return;
            }
        }

        if (!validateRequired(modalCreate.querySelector('#txtMeasure').value)) {
            alert('Aviso', 'Debe ingresar una unidad de medida.', 'info', 'OK', false);
            return;
        }

        if (!validateRequired(modalCreate.querySelector('#txtWeight').value)) {
            alert('Aviso', 'Debe ingresar un peso.', 'info', 'OK', false);
            return;
        }

        if (!validateRequired(modalCreate.querySelector('#txtVolume').value)) {
            alert('Aviso', 'Debe ingresar un volumen.', 'info', 'OK', false);
            return;
        }

        if (!validateRequired(modalCreate.querySelector('#txtQuantity').value)) {
            alert('Aviso', 'Debe ingresar una cantidad.', 'info', 'OK', false);
            return;
        }

        if (!validateRequired(modalCreate.querySelector('#txtPrice').value)) {
            alert('Aviso', 'Debe ingresar un precio unitario.', 'info', 'OK', false);
            return;
        }

        let data = {
            id: items.length + 1,
            tipo: modalCreate.querySelector('#txtType').value,
            codigo: radioSelected === 'txtNewArticle' ? null : txtSelectArticle.value,
            articulo: radioSelected === 'txtNewArticle' ? txtInputArticle.value : txtSelectArticle.options[txtSelectArticle.selectedIndex].text,
            unidad: modalCreate.querySelector('#txtMeasure').value,
            peso: modalCreate.querySelector('#txtWeight').value,
            medida: modalCreate.querySelector('#txtVolume').value,
            cantidad: modalCreate.querySelector('#txtQuantity').value,
            serie: modalCreate.querySelector('#txtSeries').value || 'N/A',
            precio_unidad: modalCreate.querySelector('#txtPrice').value,
            fecha_vencimiento: modalCreate.querySelector('#txtExpiration').value || null,
            imagen: 'sinimagen.jpg',
        }

        items.push(data);
        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();

        clearInputModalCreate();
    });

    function showNotification(title, message) {
        const notificationContainer = document.getElementById('notificationContainer');
        const notification = document.createElement('div');
        const currentTime = new Date().toLocaleString('es-HN', {
            weekday: 'long',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
            timeZone: 'America/Tegucigalpa'
        });

        notification.innerHTML = `
            <div id="toast-notification" class="w-full max-w-xs p-4 text-white bg-slate-700 rounded-lg shadow mt-4" role="alert">
                <div class="flex items-center mb-3">
                    <span class="mb-1 text-sm font-semibold text-blue-500">Nueva notificación</span>
                    <button type="button" class="ml-auto -mx-1.5 -my-1.5 bg-slate-200 justify-center items-center flex-shrink-0 text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8" data-dismiss-target="#toast-notification" aria-label="Close">
                        <span class="sr-only">Close</span>
                        <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <div class="flex items-center">
                    <div class="ml-1 font-normal">
                        <div class="text-md font-semibold text-white mb-2">${title}</div>
                        <div class="text-md font-normal mb-6">${message}</div>
                        <span class="text-sm font-medium text-blue-500">${currentTime}</span>
                    </div>
                </div>
            </div>
        `;

        notificationContainer.appendChild(notification);

        const closeButton = notification.querySelector('button');
        closeButton.addEventListener('click', () => {
            notificationContainer.removeChild(notification);
        });
    }

    function clearInputModalCreate() {
        modalCreate.querySelector('#txtType').value = "";
        modalCreate.querySelector('#txtCodeCreate').value = "";
        modalCreate.querySelector('#txtMeasure').value = "";
        modalCreate.querySelector('#txtWeight').value = "";
        modalCreate.querySelector('#txtVolume').value = "";
        modalCreate.querySelector('#txtQuantity').value = "";
        modalCreate.querySelector('#txtSeries').value = "";
        modalCreate.querySelector('#txtPrice').value = "";
        modalCreate.querySelector('#txtExpiration').value = "";

        txtInputArticle.value = "";
        txtSelectArticle.value = "";
        radioSelected = 'txtNewArticle';
    }

    async function validateIsExist() {
        const add = validateVariable("add");

        if (add?.exists) {
            const buttonModalCreates = document.querySelector('#buttonModalCreate');
            const modalTitle = document.querySelector('#modalTitleCreate');
            const txtActionCreates = document.querySelector('#txtActionCreate');
            const buttonModalCreatesAdd = document.querySelector('#btnModalCreate');

            modalTitle.innerHTML = 'Agregar existencias';
            txtActionCreates.value = '001';
            buttonModalCreatesAdd.innerHTML = 'Guardar datos';
            buttonModalCreates.click();
        }
    }
});