import openModal,{send}from"./modalOptions-min.js";import{clearInput}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{validateRequired,validateNumber}from"../../module/validate-min.js";import createSelectOptions from"../../module/select-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#modal"),a=document.querySelector("#buttonModal"),t=document.querySelector("#btnCancel"),r=document.querySelector("#frmYear"),o=document.querySelector("#txtAction"),l=document.querySelector("#btnClose");createSelectOptions("#txtModel","../../app/controllers/ModelController.php","codigo_modelo","nombre_modelo");let n=new DataTable("#tblYears",{dom:"Bfrtip",ajax:{url:"../../app/controllers/YearController.php",type:"GET",dataSrc:""},pageLength:16,loading:!0,columns:[{title:"Código",data:"codigo"},{title:"Modelo",data:"nombre"},{title:"Marca",data:"modelo"}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(t,r,l,n){o.value="001",openModal(t,r,l,n,e,a)},className:"font-bold"},{text:'<i class="fa-solid fa-file-pen text-orange-500"></i> Editar',action:function(t,r,l,n){o.value="002",openModal(t,r,l,n,e,a)},className:"font-bold"},{text:'<i class="fa-solid fa-trash text-red-500"></i> Eliminar',action:function(t,r,l,n){o.value="003",openModal(t,r,l,n,e,a)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});t.addEventListener("click",(()=>{clearInput(r)})),l.addEventListener("click",(()=>{clearInput(r)})),r.addEventListener("submit",(async t=>{t.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":if(o()){let a={nombre:e.querySelector("#txtYear").value,codigo_modelo:e.querySelector("#txtModel").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}n.ajax.reload()}break;case"002":if(o()&&i()){let a={codigo:e.querySelector("#txtCode").value,nombre:e.querySelector("#txtYear").value,codigo_modelo:e.querySelector("#txtModel").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}n.ajax.reload()}break;case"003":swal("Estas seguro que deseas eliminar el año?",{title:"Eliminar año",icon:"warning",dangerMode:!0,buttons:{yes:{text:"Si",value:"yes"},not:{text:"No",value:"not"}}}).then((async t=>{switch(t){case"yes":if(i()){let a={codigo:e.querySelector("#txtCode").value},t=await send(a,r);if(t){let e=t?.success?"Transacción exitosa":"Error en la transacción",a=t?.success?"success":"warning";alert(e,t.message,a,"Ok",!0)}n.ajax.reload(),l.click()}break;case"not":a.click();break}}));break;default:break}function o(){return validateRequired(e.querySelector("#txtYear").value)?validateRequired(e.querySelector("#txtModel").value)?!!validateRequired(e.querySelector("#txtAction").value)||(alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1):(alert("Campo requerido","La modelo es requerido.","warning","Ok",!0),!1):(alert("Campo requerido","El año es requerido.","warning","Ok",!0),!1)}function i(){return validateRequired(e.querySelector("#txtCode").value)&&!!validateNumber(e.querySelector("#txtCode").value)||(alert("Campo requerido","A ocurrido un error, por favor refresque la pagina.","warning","Ok",!0),!1)}a.click()}))}));