import{alert}from"../../module/alert-min.js";import{validateRequired}from"../../module/validate-min.js";import{getDocument}from"../../module/services/services-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".export-button"),t=document.querySelector("#txtRecords");let a=!1;function o(){const e=document.getElementById("loading-indicator");e.style.display=a?"block":"none"}new DataTable("#tblSales",{dom:"lBfrtip",async:!0,ajax:{url:"../../app/controllers/ReportController.php?isGet=true&get=sales",type:"GET",dataSrc:""},loading:!0,pageLength:25,columns:[{title:"Código factura",data:"codigo_factura"},{title:"Numero",data:"numero"},{title:"Fecha de transacción",data:"fecha_transaccion"},{title:"Fecha de vencimiento",data:"fecha_vencimiento"},{title:"Articulo",data:"articulo"},{title:"Cantidad",data:"cantidad"},{title:"Descuento",data:"descuento"},{title:"Impuesto",data:"impuesto"},{title:"Subtotal",data:"sub_total"},{title:"Total",data:"total"}],select:!1,responsive:!0,paging:!0,searching:!1,language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}}),e.forEach((e=>{e.addEventListener("click",(async()=>{a=!0,o();let r=e.getAttribute("data-document-type");if(!validateRequired(t.value))return void alert("Campo requerido","Debe seleccionar la cantidad de registros que desea exportar.","warning","Ok",!0);let l=t.value;switch(r){case"pdf":await getDocument(`../../app/controllers/ReportController.php?option=pdf&category=rpv&limit=${l}`,"Reporte de ventas","pdf"),a=!1,o();break;case"excel":await getDocument(`../../app/controllers/ReportController.php?option=xlsx&category=rpv&limit=${l}`,"Reporte de ventas","xlsx"),a=!1,o();break;case"csv":await getDocument(`../../app/controllers/ReportController.php?option=csv&category=rpv&limit=${l}`,"Reporte de ventas","csv"),a=!1,o();break;case"xml":await getDocument(`../../app/controllers/ReportController.php?option=xml&category=rpv&limit=${l}`,"Reporte de ventas","xml"),a=!1,o();break;default:a=!1,o()}}))}))}));