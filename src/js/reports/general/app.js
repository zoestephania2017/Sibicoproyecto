import { validateRequired } from "../../module/validate-min.js";
import { getDocument } from "../../module/services/services-min.js";

document.addEventListener("DOMContentLoaded", () => {
    const exportButtons = document.querySelectorAll(".export-button");
    const searchButton = document.querySelector("#btnSearch");
    const number = document.querySelector("#txtNumber");
    const transactionDate = document.querySelector("#txtDate");
    const expirationDate = document.querySelector("#txtExpiration");
    const status = document.querySelector("#txtStatus");

    let loading = false;

    let tableGeneral = new DataTable("#tblGeneral", {
        dom: "lBfrtip",
        async: true,
        ajax: {
            url: "../../app/controllers/ReportController.php?isGet=true&get=generals&number=null&date=null&expiration=null&status=null",
            type: "GET",
            dataSrc: "",
        },
        loading: true,
        pageLength: 25,
        columns: [
            { title: "Código factura", data: "codigo_factura" },
            { title: "Numero", data: "numero" },
            { title: "Fecha de transacción", data: "fecha_transaccion" },
            { title: "Fecha de vencimiento", data: "fecha_vencimiento" },
            { title: "Cliente", data: "cliente" },
            { title: "Responsable", data: "responsable" },
            {
                title: "Estado",
                data: "estado",
                render: function (data) {
                    switch (data) {
                        case "ACTIVO":
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-400">${data}</span>
                            </div>
                        `;
                        case "ANULADO":
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-400">${data}</span>
                            </div>
                        `;
                        case "DEVOLUCION":
                            return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-400">${data}</span>
                            </div>
                        `;
                    }
                },
            },
            { title: "Descuento", data: "descuento" },
            { title: "Impuesto", data: "impuesto" },
            { title: "Subtotal", data: "sub_total" },
            { title: "Total", data: "total" },
        ],
        select: false,
        responsive: true,
        paging: true,
        searching: false,
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
        },
    });

    searchButton.addEventListener("click", () => {
        let url = `../../app/controllers/ReportController.php?isGet=true&get=generals&number=${validateRequired(number.value) ? number.value : "null"
            }&date=${validateRequired(transactionDate.value) ? transactionDate.value : "null"
            }&expiration=${validateRequired(expirationDate.value) ? expirationDate.value : "null"
            }&status=${validateRequired(status.value) ? status.value : "null"}`;

        if (tableGeneral) {
            tableGeneral.destroy();
        }

        tableGeneral = new DataTable("#tblGeneral", {
            dom: "lBfrtip",
            async: true,
            ajax: {
                url: url,
                type: "GET",
                dataSrc: "",
            },
            loading: true,
            pageLength: 25,
            columns: [
                { title: "Código factura", data: "codigo_factura" },
                { title: "Numero", data: "numero" },
                { title: "Fecha de transacción", data: "fecha_transaccion" },
                { title: "Fecha de vencimiento", data: "fecha_vencimiento" },
                { title: "Cliente", data: "cliente" },
                { title: "Responsable", data: "responsable" },
                {
                    title: "Estado",
                    data: "estado",
                    render: function (data) {
                        switch (data) {
                            case "ACTIVO":
                                return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-green-100 text-green-800 border-green-400">${data}</span>
                            </div>
                        `;
                            case "ANULADO":
                                return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-red-100 text-red-800 border-red-400">${data}</span>
                            </div>
                        `;
                            case "DEVOLUCION":
                                return `
                            <div class="flex flex-row gap-2 items-center justify-between">
                                <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border bg-yellow-100 text-yellow-800 border-yellow-400">${data}</span>
                            </div>
                        `;
                        }
                    },
                },
                { title: "Descuento", data: "descuento" },
                { title: "Impuesto", data: "impuesto" },
                { title: "Subtotal", data: "sub_total" },
                { title: "Total", data: "total" },
            ],
            select: false,
            responsive: true,
            paging: true,
            searching: false,
            language: {
                url: "https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json",
            },
        });
    });

    exportButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            loading = true;
            updateLoadingIndicator();

            let documentType = button.getAttribute('data-document-type');
            let params = `number=${validateRequired(number.value) ? number.value : "null"}&date=${validateRequired(transactionDate.value) ? transactionDate.value : "null"}&expiration=${validateRequired(expirationDate.value) ? expirationDate.value : "null"}&status=${validateRequired(status.value) ? status.value : "null"}`;

            switch (documentType) {
                case 'pdf':
                    await getDocument(`../../app/controllers/ReportController.php?option=pdf&category=rpg&${params}`, 'Reporte general', 'pdf');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'excel':
                    await getDocument(`../../app/controllers/ReportController.php?option=xlsx&category=rpg&${params}`, 'Reporte general', 'xlsx');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'csv':
                    await getDocument(`../../app/controllers/ReportController.php?option=csv&category=rpg&${params}`, 'Reporte general', 'csv');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'xml':
                    await getDocument(`../../app/controllers/ReportController.php?option=xml&category=rpg&${params}`, 'Reporte general', 'xml');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                default:
                    loading = false;
                    updateLoadingIndicator();
            }
        });
    });

    function updateLoadingIndicator() {
        const loadingIndicator = document.getElementById('loading-indicator');
        if (loading) {
            loadingIndicator.style.display = 'block';
        } else {
            loadingIndicator.style.display = 'none';
        }
    }
});
