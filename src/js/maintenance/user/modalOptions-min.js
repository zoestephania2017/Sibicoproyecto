import{setModalTitle,setNameModalButton,setFormReadOnly}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{create,update,destroy}from"../../module/services/services-min.js";export default function openModal(e,t,r,o,a,l){var s=t.row({selected:!0}).data();switch(a.querySelector("#txtAction").value){case"001":setModalTitle("modalTitle","Crear Usuario"),setNameModalButton("btnModal","Guardar datos"),l.click();break;case"002":setParameters(s,a,l,"modalTitle","Editar Usuario","btnModal","Editar usuario");break;case"003":setFormReadOnly("frmUser"),setParameters(s,a,l,"modalTitle","Eliminar Usuario","btnModal","Eliminar usuario");break;default:break}}function setParameters(e,t,r,o,a,l,s){e?(t.querySelector("#txtCode").value=e.correlativo,t.querySelector("#txtName").value=e.nombre,t.querySelector("#txtSurname").value=e.apellido,t.querySelector("#txtAddress").value=e.direccion,t.querySelector("#txtUser").value=e.usuario,t.querySelector("#txtLandlinePhone").value=e.telefono_fijo,t.querySelector("#txtMobilePhone").value=e.telefono_movil,t.querySelector("#txtProfile").value=e.codigo_perfil,r.click(),setModalTitle(o,a),setNameModalButton(l,s)):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)}export async function send(e={},t="001"){const r="../../app/controllers/UserController.php";if(!e)return{success:!1,message:"Los datos son requeridos."};switch(t){case"001":return await create(e,r);case"002":return await update(e,r);case"003":return await destroy(e,r);default:}}export async function operations(e={}){return e?await update(e,"../../app/controllers/OperationController.php"):{success:!1,message:"Los datos son requeridos."}}