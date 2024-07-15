import openModal,{send}from"./modalOptions-min.js";import{clearInput}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{validateRequired,validateNumber}from"../../module/validate-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#modal"),a=document.querySelector("#buttonModal"),t=document.querySelector("#btnCancel"),r=document.querySelector("#frmProfile"),o=document.querySelector("#txtAction"),n=document.querySelector("#btnClose");let l=new DataTable("#tblProfiles",{dom:"Bfrtip",ajax:{url:"../../app/controllers/ProfileController.php",type:"GET",dataSrc:""},pageLength:16,loading:!0,columns:[{title:"Codigo",data:"codigo"},{title:"Nombre",data:"nombre"}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(t,r,n,l){o.value="001",openModal(t,r,n,l,e,a)},className:"font-bold"},{text:'<i class="fa-solid fa-file-pen text-orange-500"></i> Editar',action:function(t,r,n,l){o.value="002",openModal(t,r,n,l,e,a)},className:"font-bold"},{text:'<i class="fa-solid fa-key text-blue-500"></i> Asignar acceso',action:function(e,a,t,r){var o=a.row({selected:!0}).data();if(!o)return void alert("Aviso","Debe seleccionar un registro.","info","OK",!1);let n=o.codigo;window.location.href=`../maintenance/profile_access.php?code=${n}`},className:"font-bold"},{text:'<i class="fa-solid fa-trash text-red-500"></i> Eliminar',action:function(t,r,n,l){o.value="003",openModal(t,r,n,l,e,a)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});t.addEventListener("click",(()=>{clearInput(r)})),n.addEventListener("click",(()=>{clearInput(r)})),r.addEventListener("submit",(async t=>{t.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":if(o()){let a={nombre:e.querySelector("#txtName").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}l.ajax.reload()}break;case"002":if(o()&&i()){let a={codigo:e.querySelector("#txtCode").value,nombre:e.querySelector("#txtName").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}l.ajax.reload()}break;case"003":swal("Estas seguro que deseas eliminar el perfil?",{title:"Eliminar perfil",icon:"warning",dangerMode:!0,buttons:{yes:{text:"Si",value:"yes"},not:{text:"No",value:"not"}}}).then((async t=>{switch(t){case"yes":if(i()){let a={codigo:e.querySelector("#txtCode").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}l.ajax.reload(),n.click()}break;case"not":a.click();break}}));break;default:break}function o(){return validateRequired(e.querySelector("#txtName").value)?!!validateRequired(e.querySelector("#txtAction").value)||(alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1):(alert("Campo requerido","El nombre es requerido.","warning","Ok",!0),!1)}function i(){return validateRequired(e.querySelector("#txtCode").value)&&!!validateNumber(e.querySelector("#txtCode").value)||(alert("Campo requerido","A ocurrido un error, por favor refresque la pagina.","warning","Ok",!0),!1)}a.click()}))}));