import { validateRequired } from "../../module/validate-min.js";
import { getDocument } from "../../module/services/services-min.js";

document.addEventListener('DOMContentLoaded', () => {
    const exportButtons = document.querySelectorAll('.export-button');
    const searchButton = document.querySelector('#btnSearch');
    const responsible = document.querySelector('#txtResponsible');
    let loading = false;

    let tableResponsible = new DataTable('#tblResponsible', {
        dom: 'lBfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/ReportController.php?isGet=true&get=responsible',
            type: 'GET',
            dataSrc: '',
        },
        loading: true,
        pageLength: 25,
        columns: [
            { title: 'Código factura', data: "codigo_factura" },
            { title: 'Numero', data: "numero" },
            { title: 'Fecha de transacción', data: "fecha_transaccion" },
            { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
            { title: 'Responsable', data: "responsable" },
            { title: 'Total', data: "total" },
        ],
        select: false,
        responsive: true,
        paging: true,
        searching: false,
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    searchButton.addEventListener('click', async () => {
        let url = `../../app/controllers/ReportController.php?isGet=true&get=responsible`;

        if (validateRequired(responsible.value)) {
            url = `../../app/controllers/ReportController.php?isGet=true&get=responsible&responsible=${responsible.value}`;
        }

        if (tableResponsible) {
            tableResponsible.destroy();
        }

        tableResponsible = new DataTable('#tblResponsible', {
            dom: 'lBfrtip',
            async: true,
            ajax: {
                url: url,
                type: 'GET',
                dataSrc: '',
            },
            loading: true,
            pageLength: 25,
            columns: [
                { title: 'Código factura', data: "codigo_factura" },
                { title: 'Numero', data: "numero" },
                { title: 'Fecha de transacción', data: "fecha_transaccion" },
                { title: 'Fecha de vencimiento', data: "fecha_vencimiento" },
                { title: 'Responsable', data: "responsable" },
                { title: 'Total', data: "total" },
            ],
            select: false,
            responsive: true,
            paging: true,
            searching: false,
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
            }
        });
    });

    exportButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            loading = true;
            updateLoadingIndicator();

            let documentType = button.getAttribute('data-document-type');
            let responsibleSearch = responsible.value ?? null;

            switch (documentType) {
                case 'pdf':
                    await getDocument(`../../app/controllers/ReportController.php?option=pdf&category=rpr&responsible=${responsibleSearch}`, 'Reporte por responsable de entrega', 'pdf');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'excel':
                    await getDocument(`../../app/controllers/ReportController.php?option=xlsx&category=rpr&responsible=${responsibleSearch}`, 'Reporte por responsable de entrega', 'xlsx');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'csv':
                    await getDocument(`../../app/controllers/ReportController.php?option=csv&category=rpr&responsible=${responsibleSearch}`, 'Reporte por responsable de entrega', 'csv');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'xml':
                    await getDocument(`../../app/controllers/ReportController.php?option=xml&category=rpr&responsible=${responsibleSearch}`, 'Reporte por responsable de entrega', 'xml');
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