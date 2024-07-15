import openModal, { send } from "./modalOptions-min.js";
import { clearInput } from "../../module/modal-min.js";
import { alert } from "../../module/alert-min.js";
import { validateRequired, validateNumber } from "../../module/validate-min.js";
import createSelectOptions from "../../module/select-min.js";
import { viewInvoice } from "../../module/services/services-min.js";
import { generateSerie } from "../../module/generate-min.js";

document.addEventListener("DOMContentLoaded", async () => {
    const modal = document.querySelector("#modal");
    const buttonModal = document.querySelector("#buttonModal");
    const buttonCancel = document.querySelector("#btnCancel");
    const formEntry = document.querySelector("#frmEntry");
    const actionModal = document.querySelector("#txtAction");
    const buttonClose = document.querySelector("#btnClose");
    const buttonOpenWindow = document.querySelector("#btnOpenWindow");
    const buttonAdd = document.querySelector("#btnAdd");
    const buttonPrint = document.querySelector("#btnPrint");
    const buttonGenerateSerie = document.querySelector("#btnGenerateSerie");
    let items = [];

    await createSelectOptions(
        "#txtArticle",
        "../../app/controllers/StockController.php",
        "codigo_articulo",
        "nombre_articulo"
    );

    let tableEntries = new DataTable("#tblEntries", {
        dom: "Bfrtip",
        async: true,
        ajax: {
            url: "../../app/controllers/EntryController.php",
            type: "GET",
            dataSrc: "",
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: "Código", data: "codigo" },
            { title: "Fecha", data: "fecha" },
            { title: "Numero/Compra", data: "NumeroCompra" },
            { title: "Numero/Orden", data: "numero" },
            { title: "Encargado de auditoria", data: "oficialuno" },
            { title: "Oficial de logística", data: "oficialdos" },
            { title: "Oficial de compras", data: "oficialtres" },
            {
                title: "Estado",
                data: "estado",
                render: function (data) {
                    return `
                    <div class="flex flex-row gap-2 items-center justify-between">
                        <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${data === "ACTIVO"
                            ? "bg-green-100 text-green-800 border-green-400"
                            : "bg-red-100 text-red-800 border-red-400"
                        }">${data}</span>
                    </div>
                `;
                },
            },
        ],
        select: true,
        responsive: true,
        paging: true,
        buttons: [
            {
                text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                action: function (e, dt, node, config) {
                    actionModal.value = "001";
                    openModal(
                        e,
                        dt,
                        node,
                        config,
                        modal,
                        buttonModal,
                        items,
                        items,
                        tblItems
                    );
                },
                className: "font-bold",
            },
            {
                text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert(
                            "Aviso",
                            "Debe seleccionar un registro.",
                            "info",
                            "OK",
                            false
                        );
                        return;
                    }

                    actionModal.value = "002";
                    modal.querySelector("#txtCode").value = selectedRowData.codigo;
                    modal.querySelector("#btnModal").click();
                },
                className: "font-bold",
            },
            {
                text: '<i class="fas fa-calendar-times text-red-500"></i> Expiradas',
                action: function (e, dt, node, config) {
                    actionModal.value = "003";
                    modal.querySelector("#btnModal").click();
                },
                className: "font-bold",
            },
            {
                text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                action: function (e, dt, node, config) {
                    actionModal.value = "005";
                    openModal(e, dt, node, config, modal, buttonModal, items, tblItems);
                },
                className: "font-bold",
            },
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
        },
    });

    let tblItems = new DataTable("#tblItems", {
        dom: "Bfrtip",
        async: true,
        dataSrc: items,
        pageLength: 15,
        loading: true,
        columns: [
            { title: "Codigo", data: "correlativo" },
            { title: "Cantidad", data: "cantidad" },
            { title: "Código/Orden de Compra", data: "codigo_compra" },
            { title: "Descripción", data: "descripcion" },
            { title: "Serie", data: "serie" },
            { title: "Precio unitario", data: "precio_unidad" },
            { title: "Descuento unitario", data: "descuento" },
            { title: "Total", data: "total" },
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

                    deleteItem(selectedRowData.correlativo);
                },
                className: "btn-delete font-bold",
            },
        ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
        },
    });

    buttonPrint.addEventListener("click", async () => {
        if (!modal.querySelector("#txtCode").value) {
            alert("Aviso", "Debe completar todos los campos.", "warning", "Ok", true);
            return;
        }

        if (modal.querySelector("#txtCode").value) {
            await viewInvoice(
                `../../app/controllers/EntryController.php?print=true&id=${modal.querySelector("#txtCode").value
                }`
            );
            return;
        }
    });

    function clearAll() {
        items = [];

        buttonAdd.classList.remove("hidden");
        buttonAdd.disabled = false;
        modal.querySelector("#btnModal").disabled = false;
        modal.querySelector("#btnModal").classList.remove("hidden");
        modal.querySelector("#btnPrint").disabled = true;
        modal.querySelector("#btnPrint").classList.add("hidden");

        let deleteButtons = tblItems
            .table()
            .container()
            .querySelectorAll(".btn-delete");

        if (deleteButtons && deleteButtons.length > 0) {
            for (let i = 0; i < deleteButtons.length; i++) {
                deleteButtons[i].classList.remove("disabled");
            }
        }

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    }

    function deleteItem(id) {
        const index = items.findIndex(item => item.correlativo === id);

        if (index !== -1) {
            items.splice(index, 1);

            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();
        }
    }

    buttonCancel.addEventListener("click", () => {
        clearInput(formEntry);
        clearAll();
    });

    buttonClose.addEventListener("click", () => {
        clearInput(formEntry);
        clearAll();
    });

    buttonAdd.addEventListener("click", () => {
        if (!validateRequired(modal.querySelector("#txtArticle").value)) {
            alert("Error", "Debe seleccionar un articulo", "warning", "Ok", true);
            return;
        }

        let quantity = formEntry.querySelector("#txtQuantity");
        let serie = formEntry.querySelector("#txtSeries");
        let price = formEntry.querySelector("#txtPrice");
        let discountUnit = formEntry.querySelector("#txtDiscountUnit");

        if (!quantity.value && !price.value && !discountUnit.value) {
            alert(
                "Error",
                "Debe ingresar la cantidad, precio y descuento",
                "warning",
                "Ok",
                true
            );
            return;
        }

        if (!validateNumber(quantity.value)) {
            alert("Error", "La cantidad debe ser un numero", "warning", "Ok", true);
            return;
        }

        if (!validateNumber(price.value)) {
            alert("Error", "El precio debe ser un numero", "warning", "Ok", true);
            return;
        }

        if (!validateNumber(discountUnit.value)) {
            alert("Error", "El descuento debe ser un numero", "warning", "Ok", true);
            return;
        }

        let total = parseFloat(quantity.value) * parseFloat(price.value);
        let totalWithDiscount =
            total - parseFloat(discountUnit.value) * parseFloat(quantity.value);

        items.push({
            correlativo: items.length + 1,
            cantidad: quantity.value,
            codigo_compra: modal.querySelector("#txtArticle").value,
            descripcion:
                modal.querySelector("#txtArticle").options[
                    modal.querySelector("#txtArticle").selectedIndex
                ].text,
            serie: serie.value !== "" ? serie.value : "N/A",
            precio_unidad: price.value,
            descuento: discountUnit.value,
            total: totalWithDiscount.toFixed(2),
        });

        tblItems.clear();
        tblItems.rows.add(items);
        tblItems.draw();
    });

    buttonGenerateSerie.addEventListener("click", async () => {
        let serie = generateSerie(4, 3);

        if (validateRequired(modal.querySelector('#txtSeries').value)) {
            modal.querySelector('#txtSeries').value = '';
        }

        modal.querySelector('#txtSeries').value = serie;
    })

    formEntry.addEventListener("submit", async (e) => {
        e.preventDefault();

        let option = modal.querySelector("#txtAction").value;

        switch (option) {
            case "001":
                if (validateForm()) {
                    let saveData = {
                        numero: modal.querySelector("#txtCode").value,
                        proveedor: modal.querySelector("#txtProvider").value,
                        rtn_proveedor:
                            modal.querySelector("#txtRTNProvider").value !== ""
                                ? modal.querySelector("#txtRTNProvider").value
                                : "N/A",
                        oficial_logistica:
                            modal.querySelector("#txtLogistic").value !== ""
                                ? modal.querySelector("#txtLogistic").value
                                : "N/A",
                        fecha: modal.querySelector("#txtDate").value,
                        responsable: modal.querySelector("#txtResponsible").value,
                        tipo_entrada: modal.querySelector("#txtTypeEntry").value,
                        encargado_auditoria:
                            modal.querySelector("#txtAuditor").value !== ""
                                ? modal.querySelector("#txtAuditor").value
                                : "N/A",
                        oficial_compra:
                            modal.querySelector("#txtOficial").value !== ""
                                ? modal.querySelector("#txtOficial").value
                                : "N/A",
                        observacion:
                            modal.querySelector("#txtNote").value !== ""
                                ? modal.querySelector("#txtNote").value
                                : "N/A",
                        detalle: items,
                    };

                    let response = await send(saveData, option);

                    if (response) {
                        let title = response?.success
                            ? "Transacción exitosa"
                            : "Error en la transacción";
                        let icon = response?.success ? "success" : "warning";

                        alert(title, response.message, icon, "Ok", true);
                    }

                    tableEntries.ajax.reload();
                    buttonClose.click();
                }
                break;
            case "002":
                if (validateOverride()) {
                    swal("Estas seguro que desea anular la entrada?", {
                        title: "Eliminar entrada",
                        icon: "warning",
                        dangerMode: true,
                        buttons: {
                            yes: {
                                text: "Si",
                                value: "yes",
                            },
                            not: {
                                text: "No",
                                value: "not",
                            },
                        },
                    }).then(async (value) => {
                        switch (value) {
                            case "yes":
                                let dataOverride = {
                                    codigo: modal.querySelector("#txtCode").value,
                                };

                                let response = await send(dataOverride, option);

                                if (response) {
                                    let title = response?.success
                                        ? "Transaccion exitosa"
                                        : "Error en la transaccion";
                                    let icon = response?.success ? "success" : "warning";

                                    alert(title, response.message, icon, "Ok", true);
                                }

                                tableEntries.ajax.reload();
                                buttonClose.click();
                                break;
                            case "not":
                                break;
                        }
                    });
                }
                break;
            case "003":
                if (tableEntries) {
                    tableEntries.destroy();
                }

                tableEntries = new DataTable("#tblEntries", {
                    dom: "Bfrtip",
                    async: true,
                    ajax: {
                        url: "../../app/controllers/EntryController.php?expired=true",
                        type: "GET",
                        dataSrc: "",
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: "Código", data: "codigo" },
                        { title: "Fecha", data: "fecha" },
                        { title: "Numero/Compra", data: "NumeroCompra" },
                        { title: "Numero/Orden", data: "numero" },
                        { title: "Encargado de auditoria", data: "oficialuno" },
                        { title: "Oficial de logística", data: "oficialdos" },
                        { title: "Oficial de compras", data: "oficialtres" },
                        {
                            title: "Estado",
                            data: "estado",
                            render: function (data) {
                                return `
                                <div class="flex flex-row gap-2 items-center justify-between">
                                    <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${data === "ACTIVO"
                                        ? "bg-green-100 text-green-800 border-green-400"
                                        : "bg-red-100 text-red-800 border-red-400"
                                    }">${data}</span>
                                </div>
                            `;
                            },
                        },
                    ],
                    select: true,
                    responsive: true,
                    paging: true,
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                            action: function (e, dt, node, config) {
                                actionModal.value = "001";
                                openModal(
                                    e,
                                    dt,
                                    node,
                                    config,
                                    modal,
                                    buttonModal,
                                    items,
                                    tblItems
                                );
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert(
                                        "Aviso",
                                        "Debe seleccionar un registro.",
                                        "info",
                                        "OK",
                                        false
                                    );
                                    return;
                                }

                                actionModal.value = "002";
                                modal.querySelector("#txtCode").value = selectedRowData.codigo;
                                modal.querySelector("#btnModal").click();
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fas fa-th-list text-emerald-500"></i> Mostrar todos los registros',
                            action: function (e, dt, node, config) {
                                actionModal.value = "004";
                                modal.querySelector("#btnModal").click();
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                            action: function (e, dt, node, config) {
                                actionModal.value = "005";
                                openModal(
                                    e,
                                    dt,
                                    node,
                                    config,
                                    modal,
                                    buttonModal,
                                    items,
                                    tblItems
                                );
                            },
                            className: "font-bold",
                        },
                    ],
                    language: {
                        url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
                    },
                });
                break;
            case "004":
                if (tableEntries) {
                    tableEntries.destroy();
                }

                tableEntries = new DataTable("#tblEntries", {
                    dom: "Bfrtip",
                    async: true,
                    ajax: {
                        url: "../../app/controllers/EntryController.php",
                        type: "GET",
                        dataSrc: "",
                    },
                    pageLength: 15,
                    loading: true,
                    columns: [
                        { title: "Código", data: "codigo" },
                        { title: "Fecha", data: "fecha" },
                        { title: "Numero/Compra", data: "NumeroCompra" },
                        { title: "Numero/Orden", data: "numero" },
                        { title: "Encargado de auditoria", data: "oficialuno" },
                        { title: "Oficial de logística", data: "oficialdos" },
                        { title: "Oficial de compras", data: "oficialtres" },
                        {
                            title: "Estado",
                            data: "estado",
                            render: function (data) {
                                return `
                                <div class="flex flex-row gap-2 items-center justify-between">
                                    <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${data === "ACTIVO"
                                        ? "bg-green-100 text-green-800 border-green-400"
                                        : "bg-red-100 text-red-800 border-red-400"
                                    }">${data}</span>
                                </div>
                            `;
                            },
                        },
                    ],
                    select: true,
                    responsive: true,
                    paging: true,
                    buttons: [
                        {
                            text: '<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',
                            action: function (e, dt, node, config) {
                                actionModal.value = "001";
                                openModal(
                                    e,
                                    dt,
                                    node,
                                    config,
                                    modal,
                                    buttonModal,
                                    items,
                                    tblItems
                                );
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fas fa-minus-circle text-red-500"></i> Anular',
                            action: function (e, dt, node, config) {
                                let selectedRowData = dt.row({ selected: true }).data();

                                if (!selectedRowData) {
                                    alert(
                                        "Aviso",
                                        "Debe seleccionar un registro.",
                                        "info",
                                        "OK",
                                        false
                                    );
                                    return;
                                }

                                actionModal.value = "002";
                                modal.querySelector("#txtCode").value = selectedRowData.codigo;
                                modal.querySelector("#btnModal").click();
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fas fa-calendar-times text-red-500"></i> Expiradas',
                            action: function (e, dt, node, config) {
                                actionModal.value = "003";
                                modal.querySelector("#btnModal").click();
                            },
                            className: "font-bold",
                        },
                        {
                            text: '<i class="fa-solid fa-eye text-orange-500"></i> Ver',
                            action: function (e, dt, node, config) {
                                actionModal.value = "005";
                                openModal(
                                    e,
                                    dt,
                                    node,
                                    config,
                                    modal,
                                    buttonModal,
                                    items,
                                    tblItems
                                );
                            },
                            className: "font-bold",
                        },
                    ],
                    language: {
                        url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
                    },
                });
                break;
            default:
                break;
        }

        function validateForm() {
            if (!validateRequired(modal.querySelector("#txtCode").value)) {
                alert(
                    "Error",
                    "El codigo no puede estar vació.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            if (!validateNumber(modal.querySelector("#txtCode").value)) {
                alert("Error", "El codigo debe ser un numero.", "warning", "Ok", true);
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtAction").value)) {
                alert("Error", "Por favor refresque la pagina.", "warning", "Ok", true);
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtProvider").value)) {
                alert(
                    "Campo requerido",
                    "Por favor ingrese el proveedor o donante.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtResponsible").value)) {
                alert(
                    "Campo requerido",
                    "Por favor ingrese el responsable.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtDate").value)) {
                alert(
                    "Campo requerido",
                    "Por favor ingrese la fecha.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtTypeEntry").value)) {
                alert(
                    "Campo requerido",
                    "Por favor ingrese el tipo de entrada.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            if (!items.length > 0) {
                alert(
                    "Error",
                    "Por favor ingrese al menos un item.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            return true;
        }

        function validateOverride() {
            if (
                !validateRequired(
                    modal.querySelector("#txtAction").value ||
                    !validateRequired(modal.querySelector("#txtCode").value)
                )
            ) {
                alert("Error", "Por favor refresque la pagina.", "warning", "Ok", true);
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtCode").value)) {
                alert(
                    "Error",
                    "El codigo no puede estar vació.",
                    "warning",
                    "Ok",
                    true
                );
                return false;
            }

            return true;
        }
    });

    buttonOpenWindow.addEventListener("click", () => {
        let width = 950;
        let height = 550;
        let positionX = window.screen.width - width;
        let positionY = (window.screen.height - height) / 2;

        if (isNaN(width) || width <= 0) {
            console.error("Ancho inválido. Se usará el valor predeterminado.");
            width = 950;
        }

        if (isNaN(height) || height <= 0) {
            console.error("Alto inválido. Se usará el valor predeterminado.");
            height = 550;
        }

        let host = window.location.href;
        let destinationURL = host + "/../../inventory/stocks.php?add=true";

        let myWindow = window.open(
            destinationURL,
            "_blank",
            `width=${width}, height=${height}, top=${positionY}, left=${positionX}`
        );

        if (myWindow == null) {
            console.error(
                "La ventana emergente fue bloqueada por el navegador. Asegúrate de permitir ventanas emergentes para este sitio web."
            );
            return;
        }

        myWindow.focus();
    });
});
