import createSelectOptions from"../../../module/select-min.js";import{validateVariable}from"../../../module/url-min.js";import{clearInput}from"../../../module/modal-min.js";import{alert}from"../../../module/alert-min.js";import openModal,{send}from"./modalOptions-min.js";import{validateRequired,validateNumber}from"../../../module/validate-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#modal"),t=document.querySelector("#buttonModal"),a=document.querySelector("#btnCancel"),r=document.querySelector("#frmAccess"),o=document.querySelector("#txtAction"),l=document.querySelector("#btnClose"),c=validateVariable("code");!async function(){if(await createSelectOptions("#txtAccess","../../app/controllers/ProfileAccessController.php","codigo","nombre"),!c.exists&&c.isEmpty)alert("Aviso","Al parecer no existe el código, por favor regresa a la pagina de perfiles y intente nuevamente.","warning","OK",!1)}();let n=new DataTable("#tblAccess",{dom:"Bfrtip",ajax:{url:`../../app/controllers/ProfileAccessController.php?profile=${c?.value}`,type:"GET",dataSrc:""},pageLength:16,loading:!0,columns:[{title:"Codigo",data:"codigo"},{title:"Nombre",data:"nombre"}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Agregar Acceso',action:function(a,r,l,n){e.querySelector("#txtCode").value=c.value,o.value="001",openModal(a,r,l,n,e,t)},className:"font-bold"},{text:'<i class="fa-solid fa-trash text-red-500"></i> Eliminar Acceso',action:function(a,r,l,n){e.querySelector("#txtCode").value=c.value,o.value="003",openModal(a,r,l,n,e,t)},className:"font-bold"},{text:'<i class="fas fa-arrow-circle-left text-blue-500"></i> Regresar a Perfiles',action:function(){window.location="../maintenance/profile.php"},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});a.addEventListener("click",(()=>{clearInput(r)})),l.addEventListener("click",(()=>{clearInput(r)})),r.addEventListener("submit",(async a=>{a.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":if(o()&&c()){let t={codigo_perfil:e.querySelector("#txtCode").value,codigo_acceso:e.querySelector("#txtAccess").value},a=await send(t,r);if(a){let e=a?.success?"Transacción exitosa":"Error en la transacción",t=a?.success?"success":"warning";alert(e,a.message,t,"Ok",!0)}n.ajax.reload()}break;case"003":o()&&c()&&swal("Estas seguro que deseas eliminar el acceso?",{title:"Eliminar acceso",icon:"warning",dangerMode:!0,buttons:{yes:{text:"Si",value:"yes"},not:{text:"No",value:"not"}}}).then((async a=>{switch(a){case"yes":if(c()){let t={codigo_perfil:e.querySelector("#txtCode").value,codigo_acceso:e.querySelector("#txtAccess").value},a=await send(t,r);if(a){let e=a?.success?"Transacción exitosa":"Error en la transacción",t=a?.success?"success":"warning";alert(e,a.message,t,"Ok",!0)}n.ajax.reload(),l.click()}break;case"not":t.click();break}}));break;default:}function o(){return validateRequired(e.querySelector("#txtAccess").value)?!!validateRequired(e.querySelector("#txtAction").value)||(alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1):(alert("Campo requerido","El nombre es requerido.","warning","Ok",!0),!1)}function c(){return validateRequired(e.querySelector("#txtCode").value)&&!!validateNumber(e.querySelector("#txtCode").value)||(alert("Campo requerido","A ocurrido un error, por favor refresque la pagina.","warning","Ok",!0),!1)}t.click()}))}));