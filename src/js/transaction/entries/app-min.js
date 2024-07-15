import openModal,{send}from"./modalOptions-min.js";import{clearInput}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{validateRequired,validateNumber}from"../../module/validate-min.js";import createSelectOptions from"../../module/select-min.js";import{viewInvoice}from"../../module/services/services-min.js";import{generateSerie}from"../../module/generate-min.js";document.addEventListener("DOMContentLoaded",(async()=>{const e=document.querySelector("#modal"),t=document.querySelector("#buttonModal"),a=document.querySelector("#btnCancel"),r=document.querySelector("#frmEntry"),o=document.querySelector("#txtAction"),l=document.querySelector("#btnClose"),i=document.querySelector("#btnOpenWindow"),n=document.querySelector("#btnAdd"),c=document.querySelector("#btnPrint"),d=document.querySelector("#btnGenerateSerie");let s=[];await createSelectOptions("#txtArticle","../../app/controllers/StockController.php","codigo_articulo","nombre_articulo");let u=new DataTable("#tblEntries",{dom:"Bfrtip",async:!0,ajax:{url:"../../app/controllers/EntryController.php",type:"GET",dataSrc:""},pageLength:15,loading:!0,columns:[{title:"Código",data:"codigo"},{title:"Fecha",data:"fecha"},{title:"Numero/Compra",data:"NumeroCompra"},{title:"Numero/Orden",data:"numero"},{title:"Encargado de auditoria",data:"oficialuno"},{title:"Oficial de logística",data:"oficialdos"},{title:"Oficial de compras",data:"oficialtres"},{title:"Estado",data:"estado",render:function(e){return`\n                    <div class="flex flex-row gap-2 items-center justify-between">\n                        <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${"ACTIVO"===e?"bg-green-100 text-green-800 border-green-400":"bg-red-100 text-red-800 border-red-400"}">${e}</span>\n                    </div>\n                `}}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(a,r,l,i){o.value="001",openModal(a,r,l,i,e,t,s,s,f)},className:"font-bold"},{text:'<i class="fas fa-minus-circle text-red-500"></i> Anular',action:function(t,a,r,l){let i=a.row({selected:!0}).data();i?(o.value="002",e.querySelector("#txtCode").value=i.codigo,e.querySelector("#btnModal").click()):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)},className:"font-bold"},{text:'<i class="fas fa-calendar-times text-red-500"></i> Expiradas',action:function(t,a,r,l){o.value="003",e.querySelector("#btnModal").click()},className:"font-bold"},{text:'<i class="fa-solid fa-eye text-orange-500"></i> Ver',action:function(a,r,l,i){o.value="005",openModal(a,r,l,i,e,t,s,f)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}}),f=new DataTable("#tblItems",{dom:"Bfrtip",async:!0,dataSrc:s,pageLength:15,loading:!0,columns:[{title:"Codigo",data:"correlativo"},{title:"Cantidad",data:"cantidad"},{title:"Código/Orden de Compra",data:"codigo_compra"},{title:"Descripción",data:"descripcion"},{title:"Serie",data:"serie"},{title:"Precio unitario",data:"precio_unidad"},{title:"Descuento unitario",data:"descuento"},{title:"Total",data:"total"}],searching:!1,select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-trash text-rose-500"></i> Eliminar',action:function(e,t,a,r){let o=t.row({selected:!0}).data();o?function(e){const t=s.findIndex((t=>t.correlativo===e));-1!==t&&(s.splice(t,1),f.clear(),f.rows.add(s),f.draw())}(o.correlativo):alert("Aviso","Debe seleccionar un registro para eliminar.","info","OK",!1)},className:"btn-delete font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});function v(){s=[],n.classList.remove("hidden"),n.disabled=!1,e.querySelector("#btnModal").disabled=!1,e.querySelector("#btnModal").classList.remove("hidden"),e.querySelector("#btnPrint").disabled=!0,e.querySelector("#btnPrint").classList.add("hidden");let t=f.table().container().querySelectorAll(".btn-delete");if(t&&t.length>0)for(let e=0;e<t.length;e++)t[e].classList.remove("disabled");f.clear(),f.rows.add(s),f.draw()}c.addEventListener("click",(async()=>{e.querySelector("#txtCode").value?e.querySelector("#txtCode").value&&await viewInvoice(`../../app/controllers/EntryController.php?print=true&id=${e.querySelector("#txtCode").value}`):alert("Aviso","Debe completar todos los campos.","warning","Ok",!0)})),a.addEventListener("click",(()=>{clearInput(r),v()})),l.addEventListener("click",(()=>{clearInput(r),v()})),n.addEventListener("click",(()=>{if(!validateRequired(e.querySelector("#txtArticle").value))return void alert("Error","Debe seleccionar un articulo","warning","Ok",!0);let t=r.querySelector("#txtQuantity"),a=r.querySelector("#txtSeries"),o=r.querySelector("#txtPrice"),l=r.querySelector("#txtDiscountUnit");if(!t.value&&!o.value&&!l.value)return void alert("Error","Debe ingresar la cantidad, precio y descuento","warning","Ok",!0);if(!validateNumber(t.value))return void alert("Error","La cantidad debe ser un numero","warning","Ok",!0);if(!validateNumber(o.value))return void alert("Error","El precio debe ser un numero","warning","Ok",!0);if(!validateNumber(l.value))return void alert("Error","El descuento debe ser un numero","warning","Ok",!0);let i=parseFloat(t.value)*parseFloat(o.value)-parseFloat(l.value)*parseFloat(t.value);s.push({correlativo:s.length+1,cantidad:t.value,codigo_compra:e.querySelector("#txtArticle").value,descripcion:e.querySelector("#txtArticle").options[e.querySelector("#txtArticle").selectedIndex].text,serie:""!==a.value?a.value:"N/A",precio_unidad:o.value,descuento:l.value,total:i.toFixed(2)}),f.clear(),f.rows.add(s),f.draw()})),d.addEventListener("click",(async()=>{let t=generateSerie(4,3);validateRequired(e.querySelector("#txtSeries").value)&&(e.querySelector("#txtSeries").value=""),e.querySelector("#txtSeries").value=t})),r.addEventListener("submit",(async a=>{a.preventDefault();let r=e.querySelector("#txtAction").value;switch(r){case"001":if(function(){if(!validateRequired(e.querySelector("#txtCode").value))return alert("Error","El codigo no puede estar vació.","warning","Ok",!0),!1;if(!validateNumber(e.querySelector("#txtCode").value))return alert("Error","El codigo debe ser un numero.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtAction").value))return alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtProvider").value))return alert("Campo requerido","Por favor ingrese el proveedor o donante.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtResponsible").value))return alert("Campo requerido","Por favor ingrese el responsable.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtDate").value))return alert("Campo requerido","Por favor ingrese la fecha.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtTypeEntry").value))return alert("Campo requerido","Por favor ingrese el tipo de entrada.","warning","Ok",!0),!1;if(!s.length>0)return alert("Error","Por favor ingrese al menos un item.","warning","Ok",!0),!1;return!0}()){let t={numero:e.querySelector("#txtCode").value,proveedor:e.querySelector("#txtProvider").value,rtn_proveedor:""!==e.querySelector("#txtRTNProvider").value?e.querySelector("#txtRTNProvider").value:"N/A",oficial_logistica:""!==e.querySelector("#txtLogistic").value?e.querySelector("#txtLogistic").value:"N/A",fecha:e.querySelector("#txtDate").value,responsable:e.querySelector("#txtResponsible").value,tipo_entrada:e.querySelector("#txtTypeEntry").value,encargado_auditoria:""!==e.querySelector("#txtAuditor").value?e.querySelector("#txtAuditor").value:"N/A",oficial_compra:""!==e.querySelector("#txtOficial").value?e.querySelector("#txtOficial").value:"N/A",observacion:""!==e.querySelector("#txtNote").value?e.querySelector("#txtNote").value:"N/A",detalle:s},a=await send(t,r);if(a){let e=a?.success?"Transacción exitosa":"Error en la transacción",t=a?.success?"success":"warning";alert(e,a.message,t,"Ok",!0)}u.ajax.reload(),l.click()}break;case"002":(function(){if(!validateRequired(e.querySelector("#txtAction").value||!validateRequired(e.querySelector("#txtCode").value)))return alert("Error","Por favor refresque la pagina.","warning","Ok",!0),!1;if(!validateRequired(e.querySelector("#txtCode").value))return alert("Error","El codigo no puede estar vació.","warning","Ok",!0),!1;return!0})()&&swal("Estas seguro que desea anular la entrada?",{title:"Eliminar entrada",icon:"warning",dangerMode:!0,buttons:{yes:{text:"Si",value:"yes"},not:{text:"No",value:"not"}}}).then((async t=>{switch(t){case"yes":let t={codigo:e.querySelector("#txtCode").value},a=await send(t,r);if(a){let e=a?.success?"Transaccion exitosa":"Error en la transaccion",t=a?.success?"success":"warning";alert(e,a.message,t,"Ok",!0)}u.ajax.reload(),l.click();break;case"not":break}}));break;case"003":u&&u.destroy(),u=new DataTable("#tblEntries",{dom:"Bfrtip",async:!0,ajax:{url:"../../app/controllers/EntryController.php?expired=true",type:"GET",dataSrc:""},pageLength:15,loading:!0,columns:[{title:"Código",data:"codigo"},{title:"Fecha",data:"fecha"},{title:"Numero/Compra",data:"NumeroCompra"},{title:"Numero/Orden",data:"numero"},{title:"Encargado de auditoria",data:"oficialuno"},{title:"Oficial de logística",data:"oficialdos"},{title:"Oficial de compras",data:"oficialtres"},{title:"Estado",data:"estado",render:function(e){return`\n                                <div class="flex flex-row gap-2 items-center justify-between">\n                                    <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${"ACTIVO"===e?"bg-green-100 text-green-800 border-green-400":"bg-red-100 text-red-800 border-red-400"}">${e}</span>\n                                </div>\n                            `}}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(a,r,l,i){o.value="001",openModal(a,r,l,i,e,t,s,f)},className:"font-bold"},{text:'<i class="fas fa-minus-circle text-red-500"></i> Anular',action:function(t,a,r,l){let i=a.row({selected:!0}).data();i?(o.value="002",e.querySelector("#txtCode").value=i.codigo,e.querySelector("#btnModal").click()):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)},className:"font-bold"},{text:'<i class="fas fa-th-list text-emerald-500"></i> Mostrar todos los registros',action:function(t,a,r,l){o.value="004",e.querySelector("#btnModal").click()},className:"font-bold"},{text:'<i class="fa-solid fa-eye text-orange-500"></i> Ver',action:function(a,r,l,i){o.value="005",openModal(a,r,l,i,e,t,s,f)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});break;case"004":u&&u.destroy(),u=new DataTable("#tblEntries",{dom:"Bfrtip",async:!0,ajax:{url:"../../app/controllers/EntryController.php",type:"GET",dataSrc:""},pageLength:15,loading:!0,columns:[{title:"Código",data:"codigo"},{title:"Fecha",data:"fecha"},{title:"Numero/Compra",data:"NumeroCompra"},{title:"Numero/Orden",data:"numero"},{title:"Encargado de auditoria",data:"oficialuno"},{title:"Oficial de logística",data:"oficialdos"},{title:"Oficial de compras",data:"oficialtres"},{title:"Estado",data:"estado",render:function(e){return`\n                                <div class="flex flex-row gap-2 items-center justify-between">\n                                    <span class="text-xs w-full font-medium mr-2 px-2.5 py-0.5 rounded border ${"ACTIVO"===e?"bg-green-100 text-green-800 border-green-400":"bg-red-100 text-red-800 border-red-400"}">${e}</span>\n                                </div>\n                            `}}],select:!0,responsive:!0,paging:!0,buttons:[{text:'<i class="fa-solid fa-circle-plus text-green-500"></i> Crear',action:function(a,r,l,i){o.value="001",openModal(a,r,l,i,e,t,s,f)},className:"font-bold"},{text:'<i class="fas fa-minus-circle text-red-500"></i> Anular',action:function(t,a,r,l){let i=a.row({selected:!0}).data();i?(o.value="002",e.querySelector("#txtCode").value=i.codigo,e.querySelector("#btnModal").click()):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)},className:"font-bold"},{text:'<i class="fas fa-calendar-times text-red-500"></i> Expiradas',action:function(t,a,r,l){o.value="003",e.querySelector("#btnModal").click()},className:"font-bold"},{text:'<i class="fa-solid fa-eye text-orange-500"></i> Ver',action:function(a,r,l,i){o.value="005",openModal(a,r,l,i,e,t,s,f)},className:"font-bold"}],language:{url:"https://cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"}});break;default:break}})),i.addEventListener("click",(()=>{let e=950,t=550,a=window.screen.width-e,r=(window.screen.height-t)/2;(isNaN(e)||e<=0)&&(e=950),(isNaN(t)||t<=0)&&(t=550);let o=window.location.href+"/../../inventory/stocks.php?add=true",l=window.open(o,"_blank",`width=${e}, height=${t}, top=${r}, left=${a}`);null!=l&&l.focus()}))}));