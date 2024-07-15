import { alert } from "../../module/alert-min.js";
import createSelectOptions from "../../module/select-min.js";
import { validateNumber, validateRequired } from "../../module/validate-min.js";
import { create } from "../../module/services/services-min.js";
import { clearInput } from "../../module/modal-min.js";

document.addEventListener("DOMContentLoaded", (async () => {
    const formInitial = document.querySelector("#frmInitial");
    const buttonAdd = document.querySelector("#btnAdd");
    const selectBrand = document.querySelector("#txtBrand");
    const selectModel = document.querySelector("#txtModel");

    let items = [];

    await createSelectOptions('#txtBrand', '../../app/controllers/BrandController.php', 'codigo', 'nombre_marca');
    await createSelectOptions('#txtSide', '../../app/controllers/InitialController.php?side=true', 'codigo', 'nombre');
    await createSelectOptions('#txtType', '../../app/controllers/InitialController.php?type=true', 'codigo_tipo_producto', 'nombre_tipo_producto');

    let tblItems = new DataTable('#tblItems', {
        dom: 'Bfrtip',
        async: true,
        dataSrc: items,
        columns: [
            { title: 'ID', data: "code" },
            { title: 'Marca', data: "brand" },
            { title: 'Modelo', data: "model" },
            { title: 'Año', data: "year" },
            { title: 'Tipo', data: "type" },
            { title: 'Lado', data: "side" },
            { title: 'Articulo', data: "article" },
            { title: 'Cantidad', data: "quantity" },
            { title: 'Precio', data: "price" },
            { title: 'Descripción', data: "description" },
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
                        alert('Aviso', 'Debe seleccionar un registro para eliminar.', 'info', 'OK', false);
                        return;
                    }

                    deleteItem(selectedRowData.codigo);
                },
                className: 'btn-delete font-bold'
            },
        ],
        language: {
            url: 'https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json',
        }
    });

    formInitial.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (items.length === 0) {
            alert('Aviso', 'Debe ingresar al menos un registro.', 'info', 'OK', false);
            return;
        }

        let response = await create(items, '../../app/controllers/InitialController.php');

        if (response) {
            let title = response?.success ? 'Transacción exitosa' : 'Error en la transacción';
            let icon = response?.success ? 'success' : 'warning';

            alert(title, response.message, icon, 'Ok', true);

            if (response.success) {
                clearInput(formInitial);

                items = [];
                tblItems.clear();
                tblItems.rows.add(items);
                tblItems.draw();
            }
        }
    });

    selectBrand.addEventListener("change", async (e) => {
        let selection = formInitial.querySelector('#txtBrand').value = e.target.value;

        await createSelectOptions('#txtModel', '../../app/controllers/InitialController.php?model=' + selection, 'codigo', 'nombre_modelo');
    })

    selectModel.addEventListener("change", async (e) => {
        let selection = formInitial.querySelector('#txtModel').value = e.target.value;

        await createSelectOptions('#txtYear', '../../app/controllers/InitialController.php?year=' + selection, 'codigo', 'nombre');
    })

    function deleteItem(id) {
        const index = items.findIndex(item => item.id === id);

        if (index !== -1) {
            items.splice(index, 1);

            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();
        }
    }

    buttonAdd.addEventListener("click", () => {
        if (validate()) {
            let item = {
                code: items.length + 1,
                brand: formInitial.querySelector('#txtBrand').options[formInitial.querySelector('#txtBrand').selectedIndex].text,
                brandID: formInitial.querySelector('#txtBrand').value,
                model: formInitial.querySelector('#txtModel').options[formInitial.querySelector('#txtModel').selectedIndex].text,
                modelID: formInitial.querySelector('#txtModel').value,
                year: formInitial.querySelector('#txtYear').options[formInitial.querySelector('#txtYear').selectedIndex].text,
                yearID: formInitial.querySelector('#txtYear').value,
                type: formInitial.querySelector('#txtType').options[formInitial.querySelector('#txtType').selectedIndex].text,
                typeID: formInitial.querySelector('#txtType').value,
                side: formInitial.querySelector('#txtSide').options[formInitial.querySelector('#txtSide').selectedIndex].text,
                sideID: formInitial.querySelector('#txtSide').value,
                article: formInitial.querySelector('#txtArticle').value,
                quantity: formInitial.querySelector('#txtQuantity').value,
                price: formInitial.querySelector('#txtPrice').value,
                description: formInitial.querySelector('#txtDescription').value === "" ? "N/A" : formInitial.querySelector('#txtDescription').value
            }

            items.push(item);
            tblItems.clear();
            tblItems.rows.add(items);
            tblItems.draw();

            clearInputAssign();
        }
    });

    function validate() {
        if (!validateRequired(formInitial.querySelector('#txtBrand').value)) {
            alert("Campo requerido", "La marca es requerida.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtModel').value)) {
            alert("Campo requerido", "El modelo es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtYear').value)) {
            alert("Campo requerido", "El año es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtType').value)) {
            alert("Campo requerido", "El tipo es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtSide').value)) {
            alert("Campo requerido", "El lado es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtArticle').value)) {
            alert("Campo requerido", "El artículo es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtQuantity').value)) {
            alert("Campo requerido", "La cantidad es requerida.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateNumber(formInitial.querySelector('#txtQuantity').value)) {
            alert("Tipo de dato incorrecto", "La cantidad debe ser un número.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateRequired(formInitial.querySelector('#txtPrice').value)) {
            alert("Campo requerido", "El precio es requerido.", 'warning', 'Ok', true);
            return false;
        }

        if (!validateNumber(formInitial.querySelector('#txtPrice').value)) {
            alert("Tipo de dato incorrecto", "El precio debe ser un número.", 'warning', 'Ok', true);
            return false;
        }

        return true;
    }

    function clearInputAssign() {
        formInitial.querySelector('#txtBrand').value = "";
        formInitial.querySelector('#txtModel').value = "";
        formInitial.querySelector('#txtYear').value = "";
        formInitial.querySelector('#txtType').value = "";
        formInitial.querySelector('#txtSide').value = "";
        formInitial.querySelector('#txtArticle').value = "";
        formInitial.querySelector('#txtQuantity').value = "";
        formInitial.querySelector('#txtPrice').value = "";
        formInitial.querySelector('#txtDescription').value = "";
    }
}));