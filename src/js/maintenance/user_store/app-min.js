import openModal,{send}from"./modalOptions-min.js";import{clearInput}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{validateRequired,validateNumber}from"../../module/validate-min.js";import createSelectOptions from"../../module/select-min.js";import{validateVariable}from"../../module/url-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#modal"),t=document.querySelector("#buttonModal"),a=(document.querySelector("#btnModal"),document.querySelector("#btnCancel")),r=document.querySelector("#frmUser"),o=document.querySelector("#txtAction"),l=document.querySelector("#btnClose"),n=validateVariable("code");!async function(){if(await createSelectOptions("#txtStore","../../app/controllers/StoreController.php","codigo","nombre"),!n.exists&&n.isEmpty)alert("Aviso","Al parecer no existe el código, por favor regresa a la pagina de perfiles y intente nuevamente.","warning","OK",!1)}();let i=new DataTable("#tblUsers",{dom:"Bfrtip",async:!0,ajax:{url:`../../app/controllers/OperationController.php?code=${n?.value}`,type:"GET",dataSrc:""},pageLength:16,loading:!0,columns:[{title:"Código",data:"codigo"},{title:"Nombre",data:"nombre"}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(a,r,l,i){o.value="001",e.querySelector("#txtCode").value=n.value,openModal(a,r,l,i,e,t)},className:"font-bold"},{text:'<i class="fa-solid fa-trash text-red-500"></i> Eliminar',action:function(a,r,l,i){o.value="003",e.querySelector("#txtCode").value=n.value,openModal(a,r,l,i,e,t)},className:"font-bold"},{text:'<i class="fas fa-arrow-circle-left text-blue-500"></i> Regresar a Usuarios',action:function(){window.location="../maintenance/user.php"},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});a.addEventListener("click",(()=>{clearInput(r)})),l.addEventListener("click",(()=>{clearInput(r)})),r.addEventListener("submit",(async a=>{a.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":if(function(){if(!validateRequired(e.querySelector("#txtStore").value))return alert("Campo requerido","El campo tienda es requerido.","warning","Ok",!0),!1;return!0}()&&o()){let a={codigo:e.querySelector("#txtCode").value,codigo_tienda:e.querySelector("#txtStore").value},o=await send(a,r);if(o){let e=o?.success?"Transacción exitosa":"Error en la transacción",t=o?.success?"success":"warning";alert(e,o.message,t,"Ok",!0)}i.ajax.reload(),t.click()}break;case"003":swal("Estas seguro que deseas eliminar el acceso a la tienda?",{title:"Eliminar acceso a la tienda",icon:"warning",dangerMode:!0,buttons:{yes:{text:"Si",value:"yes"},not:{text:"No",value:"not"}}}).then((async a=>{switch(a){case"yes":if(o()){let t={codigo:e.querySelector("#txtCode").value,codigo_tienda:e.querySelector("#txtStore").value},a=await send(t,r);if(a){let e=a?.success?"Transacción exitosa":"Error en la transacción",t=a?.success?"success":"warning";alert(e,a.message,t,"Ok",!0)}i.ajax.reload(),l.click()}break;case"not":t.click();break}}));break;default:break}function o(){return validateRequired(e.querySelector("#txtCode").value)&&!!validateNumber(e.querySelector("#txtCode").value)||(alert("Campo requerido","A ocurrido un error, por favor refresque la pagina.","warning","Ok",!0),!1)}t.click()}))}));