import openModal,{send}from"./modalOptions-min.js";import{clearInput}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{validateRequired}from"../../module/validate-min.js";import{read}from"../../module/services/services-min.js";document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelector("#modal"),t=document.querySelector("#buttonModal"),r=document.querySelector("#btnCancel"),a=document.querySelector("#frmRepayment"),n=document.querySelector("#txtAction"),o=document.querySelector("#btnClose"),i=document.querySelector("#btnSearchDetail");let l=[],c=new DataTable("#tblRepayments",{dom:"Bfrtip",async:!0,ajax:{url:"../../app/controllers/RepaymentController.php",type:"GET",dataSrc:""},pageLength:15,loading:!0,columns:[{title:"Devolución",data:"correlativo"},{title:"Código de la factura",data:"codigo_factura"},{title:"Fecha",data:"fecha"},{title:"Estado",data:"estado",render:function(e){return`\n                    <div class="flex flex-row gap-2 items-center justify-between">\n                        <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${"ACTIVO"===e?"bg-green-100 text-green-800 border-green-400":"bg-red-100 text-red-800 border-red-400"}">${e}</span>\n                    </div>\n                `}}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(r,a,o,i){n.value="001",openModal(r,a,o,i,e,t,l,d)},className:"font-bold"},{text:'<i class="fa-solid fa-eye text-orange-500"></i> Ver',action:function(r,a,o,i){n.value="002",openModal(r,a,o,i,e,t,l,d)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}}),d=new DataTable("#tblItems",{dom:"Bfrtip",async:!0,dataSrc:l,columns:[{title:"ID",data:"correlativo"},{title:"Código",data:"codigo_articulo"},{title:"Cantidad",data:"cantidad"},{title:"Descripción",data:"descripcion"},{title:"Serie",data:"serie"},{title:"Precio unidad",data:"precio_unidad"},{title:"Total",data:"total"},{title:"Tipo de devolución",data:null,render:function(e,t,r){return`\n                        <div class="flex flex-row gap-2 items-center justify-between">\n                            <label class="inline-flex items-center">\n                                <input type="radio" name="tipoDevolucion_${r.codigo_articulo}" value="Efectivo" class="form-radio h-5 w-5 text-blue-600">\n                                <span class="ml-2">Efectivo</span>\n                            </label>\n                            <label class="inline-flex items-center">\n                                <input type="radio" name="tipoDevolucion_${r.codigo_articulo}" value="Producto" class="form-radio h-5 w-5 text-blue-600">\n                                <span class="ml-2">Producto</span>\n                            </label>\n                        </div>\n                    `}}],searching:!1,select:!1,responsive:!0,paging:!0,language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});function u(){l=[],e.querySelector("#gridDetail").classList.remove("hidden"),e.querySelector("#gridDetail").classList.add("grid"),e.querySelector("#gridReturn").classList.add("hidden"),e.querySelector("#gridReturn").classList.remove("grid"),e.querySelector("#btnModal").disabled=!1,e.querySelector("#btnModal").classList.remove("hidden"),d.column(7).visible(!0),d.clear(),d.rows.add(l),d.draw()}r.addEventListener("click",(()=>{clearInput(a),u()})),o.addEventListener("click",(()=>{clearInput(a),u()})),i.addEventListener("click",(async()=>{let t=a.querySelector("#txtCode").value;if(!validateRequired(t))return void alert("Campo requerido","Debe ingresar un código de entrega.","warning","Ok",!0);let r=await read(`../../app/controllers/RepaymentController.php?repayment=${t}`);if(!r||!r.length)return void alert("Error","No se encontraron resultados.","warning","Ok",!0);e.querySelector("#txtReceiver").value=r[0].cliente,e.querySelector("#txtResponsible").value=r[0].responsable,e.querySelector("#txtDateInit").value=r[0].fecha_transaccion,e.querySelector("#txtDateEnd").value=r[0].fecha_vencimiento,e.querySelector("#txtNote").value=r[0].nota,e.querySelector("#txtInvoiceID").value=r[0].codigo_factura;let n=r[0].details;l.splice(0,l.length),l.push(...n),d.clear(),d.rows.add(l),d.draw()})),a.addEventListener("submit",(async t=>{t.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":let t=function(){const e=[];return d.rows().every((function(t,r,a){const n=this.data(),o=n.codigo_articulo,i=document.querySelector(`input[name="tipoDevolucion_${o}"]:checked`);i&&e.push({codigo_articulo:o,tipo_devolucion:i.value,cantidad:n.cantidad,descripcion:n.descripcion,serie:n.serie,precio_unidad:n.precio_unidad,total:n.total})})),e}();if(function(){if(!validateRequired(e.querySelector("#txtAction").value))return alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtInvoiceID").value))return alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtCode").value))return alert("Campo requerido","Por favor ingrese un código de entrega.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtReceiver").value))return alert("Campo requerido","Por favor ingrese el nombre de la persona que recibe el documento.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtResponsible").value))return alert("Campo requerido","Por favor ingrese el nombre del responsable.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtDateInit").value))return alert("Campo requerido","Por favor ingrese la fecha de creación del documento.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtDateEnd").value))return alert("Campo requerido","Por favor ingrese la fecha de vencimiento del documento.","warning","Ok",!0),!1;if(0===l.length)return alert("Error de validación","Por favor ingrese al menos un item.","warning","Ok",!0),!1;return!0}()){if(0===t.length)return void alert("Error","Debe seleccionar el tipo de devolución.","warning","Ok",!0);let a={codigo:e.querySelector("#txtCode").value,codigo_factura:e.querySelector("#txtInvoiceID").value,cliente:e.querySelector("#txtReceiver").value,responsable:e.querySelector("#txtResponsible").value,fecha_transaccion:e.querySelector("#txtDateInit").value,fecha_vencimiento:e.querySelector("#txtDateEnd").value,nota:e.querySelector("#txtNote").value,items:t},n=await send(a,r);if(n){let e=n?.success?"Transacción exitosa":"Error en la transacción",t=n?.success?"success":"warning";alert(e,n.message,t,"Ok",!0)}c.ajax.reload(),o.click()}break;default:break}}))}));