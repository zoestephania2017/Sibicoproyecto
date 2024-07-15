import{setModalTitle,setNameModalButton,setFormReadOnly}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{create,update,destroy}from"../../module/services/services-min.js";export default function openModal(e,a,t,r,o,s){var l=a.row({selected:!0}).data();switch(o.querySelector("#txtAction").value){case"001":setModalTitle("modalTitle","Crear Marca"),setNameModalButton("btnModal","Guardar datos"),s.click();break;case"002":setParameters(l,o,s,"modalTitle","Editar Marca","btnModal","Editar marca");break;case"003":setFormReadOnly("frmBrand"),setParameters(l,o,s,"modalTitle","Eliminar Marca","btnModal","Eliminar marca");break;default:break}}function setParameters(e,a,t,r,o,s,l){e?(a.querySelector("#txtCode").value=e.codigo,a.querySelector("#txtName").value=e.nombre_marca,t.click(),setModalTitle(r,o),setNameModalButton(s,l)):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)}export async function send(e={},a="001"){const t="../../app/controllers/BrandController.php";if(!e)return{success:!1,message:"Los datos son requeridos."};switch(a){case"001":return await create(e,t);case"002":return await update(e,t);case"003":return await destroy(e,t);default:}}