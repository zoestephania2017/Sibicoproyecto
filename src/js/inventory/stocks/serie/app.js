import { clearInput } from "../../../module/modal-min.js";
import { validateRequired, validateNumber } from "../../../module/validate-min.js";
import openModal, { send } from "./openModal-min.js";
import { alert } from "../../../module/alert-min.js";
import { generateSerie } from "../../../module/generate-min.js";

document.addEventListener('DOMContentLoaded', async () => {
    const modal = document.querySelector('#modal');
    const buttonModal = document.querySelector('#buttonModal');
    const buttonCancel = document.querySelector('#btnCancel');
    const formSerie = document.querySelector('#frmSerie');
    const actionModal = document.querySelector('#txtAction');
    const buttonClose = document.querySelector('#btnClose');
    const buttonGenerateSerie = document.querySelector('#btnGenerateSerie');
    const productID = await getID();

    let tableSeries = new DataTable('#tblSeries', {
        dom: 'Bfrtip',
        async: true,
        ajax: {
            url: `../../../app/controllers/SerieController.php?product=${productID}`,
            type: 'GET',
            dataSrc: '',
        },
        pageLength: 15,
        loading: true,
        columns: [
            { title: 'Nombre del articulo', data: "nombre" },
            { title: 'Serie', data: "serie" },
            { title: 'Imagen del documento', data: "imagen" },
            {
                title: 'Estado',
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
                text: '<i class="fas fa-folder-plus text-green-500"></i> Agregar',
                action: function (e, dt, node, config) {
                    actionModal.value = '001';
                    modal.querySelector('#txtCode').value = productID;
                    openModal(e, dt, node, config, modal, buttonModal);
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fa-solid fa-trash text-red-500"></i> Eliminar',
                action: function (e, dt, node, config) {
                    let selectedRowData = dt.row({ selected: true }).data();

                    if (!selectedRowData) {
                        alert('Aviso', 'Debe seleccionar un registro.', 'info', 'OK', false);
                        return;
                    }

                    actionModal.value = '002';
                    modal.querySelector('#txtCode').value = selectedRowData.codigo_producto;
                    modal.querySelector('#txtSerie').value = selectedRowData.serie;
                    modal.querySelector("#btnModal").click();
                },
                className: 'font-bold'
            },
            {
                text: '<i class="fas fa-arrow-circle-left text-blue-500"></i> Regresar a Existencias',
                action: function () {
                    window.location = '../stocks.php';
                },
                className: 'font-bold'
            }
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    buttonCancel.addEventListener('click', () => {
        clearInput(formSerie);
    })

    buttonClose.addEventListener('click', () => {
        clearInput(formSerie);
    });

    buttonGenerateSerie.addEventListener('click', () => {
        let serie = generateSerie(5, 3);

        if (validateRequired(modal.querySelector('#txtSerie').value)) {
            modal.querySelector('#txtSerie').value = '';
        }

        modal.querySelector('#txtSerie').value = serie;
    })

    formSerie.addEventListener('submit', async (e) => {
        e.preventDefault();

        let option = modal.querySelector("#txtAction").value;

        switch (option) {
            case '001':
                if (validateForm()) {
                    let dataSave = {
                        codigo: modal.querySelector("#txtCode").value,
                        serie: modal.querySelector("#txtSerie").value,
                    }

                    let response = await send(dataSave, option);

                    if (response) {
                        let title = response?.success
                            ? "Transacción exitosa"
                            : "Error en la transacción";
                        let icon = response?.success ? "success" : "warning";

                        alert(title, response.message, icon, "Ok", true);
                    }

                    tableSeries.ajax.reload();
                    buttonClose.click();
                }
                break;
            case '002':
                if (validateForm()) {
                    swal("Estas seguro que deseas eliminar la serie?", {
                        title: "Eliminar serie",
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
                                let dataDelete = {
                                    codigo: modal.querySelector("#txtCode").value,
                                    serie: modal.querySelector("#txtSerie").value,
                                }

                                let response = await send(dataDelete, option);

                                if (response) {
                                    let title = response?.success
                                        ? "Transacción exitosa"
                                        : "Error en la transacción";
                                    let icon = response?.success ? "success" : "warning";

                                    alert(title, response.message, icon, "Ok", true);
                                }

                                tableSeries.ajax.reload();
                                buttonClose.click();
                                break;
                            case "not":
                                break;
                        }
                    });
                }
        }

        function validateForm() {
            if (!validateRequired(modal.querySelector("#txtCode").value)) {
                alert("Error", "El código no puede estar vació.", "warning", "Ok", true);
                return false;
            }

            if (!validateNumber(modal.querySelector("#txtCode").value)) {
                alert("Error", "El código debe ser un numero.", "warning", "Ok", true);
                return false;
            }

            if (!validateRequired(modal.querySelector("#txtSerie").value)) {
                alert("Error", "El serie no puede estar vació.", "warning", "Ok", true);
                return false;
            }

            return true;
        }
    });

    async function getID() {
        const urlParams = new URLSearchParams(window.location.search);

        return urlParams.get('product');
    }
});