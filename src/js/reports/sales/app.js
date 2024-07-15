import { alert } from "../../module/alert-min.js";
import { validateRequired } from "../../module/validate-min.js";
import { getDocument } from "../../module/services/services-min.js";

document.addEventListener('DOMContentLoaded', () => {
    const exportButtons = document.querySelectorAll('.export-button');
    const quantityRecords = document.querySelector('#txtRecords');
    let loading = false;

    new DataTable('#tblSales', {
        dom: 'lBfrtip',
        async: true,
        ajax: {
            url: '../../app/controllers/ReportController.php?isGet=true&get=sales',
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
            { title: 'Articulo', data: "articulo" },
            { title: 'Cantidad', data: "cantidad" },
            { title: 'Descuento', data: "descuento" },
            { title: 'Impuesto', data: "impuesto" },
            { title: 'Subtotal', data: "sub_total" },
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

    exportButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            loading = true;
            updateLoadingIndicator();

            let documentType = button.getAttribute('data-document-type');

            if (!validateRequired(quantityRecords.value)) {
                alert('Campo requerido', 'Debe seleccionar la cantidad de registros que desea exportar.', 'warning', 'Ok', true);
                return;
            }

            let quantity = quantityRecords.value;

            switch (documentType) {
                case 'pdf':
                    await getDocument(`../../app/controllers/ReportController.php?option=pdf&category=rpv&limit=${quantity}`, 'Reporte de ventas', 'pdf');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'excel':
                    await getDocument(`../../app/controllers/ReportController.php?option=xlsx&category=rpv&limit=${quantity}`, 'Reporte de ventas', 'xlsx');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'csv':
                    await getDocument(`../../app/controllers/ReportController.php?option=csv&category=rpv&limit=${quantity}`, 'Reporte de ventas', 'csv');
                    loading = false;
                    updateLoadingIndicator();
                    break;
                case 'xml':
                    await getDocument(`../../app/controllers/ReportController.php?option=xml&category=rpv&limit=${quantity}`, 'Reporte de ventas', 'xml');
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