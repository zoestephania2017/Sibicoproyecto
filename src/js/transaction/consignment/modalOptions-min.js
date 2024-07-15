import{setModalTitle,setNameModalButton,setFormReadOnly}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{create,destroy,read}from"../../module/services/services-min.js";export default function openModal(e,t,a,o,r,s,l,n,i){var c=t.row({selected:!0}).data();switch(r.querySelector("#txtAction").value){case"001":setModalTitle("modalTitle","Agregar nueva consignación"),setNameModalButton("btnModal",'<i class="fa-solid fa-circle-plus"></i> Guardar datos'),s.click();break;case"005":setFormReadOnly("frmConsignment"),setParameters(c,r,s,"modalTitle","Ver consignación","btnModal","Ver consignación",l,n,i);break;default:break}}async function setParameters(e,t,a,o,r,s,l,n,i,c){if(!e)return void alert("Aviso","Debe seleccionar un registro.","info","OK",!1);const d=await read(`../../app/controllers/ConsignmentController.php?consignment=${e.codigo_factura}`),u=d[0].details;if(d){t.querySelector("#txtCode").value=d[0]?.codigo_factura,t.querySelector("#txtConsignment").value=d[0]?.numero,t.querySelector("#txtClient").value=d[0]?.cliente,t.querySelector("#txtDate").value=d[0]?.fecha_creacion,t.querySelector("#txtDateExpiration").value=d[0]?.fecha_vencimiento,t.querySelector("#txtResponsible").value=d[0]?.responsable,t.querySelector("#txtNote").value=d[0]?.nota,n.push(...u),assignTotals(i,u,d[0]);let e=c.table().container().querySelectorAll(".btn-delete");if(e&&e.length>0)for(let t=0;t<e.length;t++)e[t].classList.add("disabled");c.clear(),c.rows.add(n),c.draw()}t.querySelector("#btnPrint").classList.remove("hidden"),t.querySelector("#btnPrint").disabled=!1,t.querySelector(`#${s}`).disabled=!0,t.querySelector(`#${s}`).classList.add("hidden"),t.querySelector("#txtDiscountCheck").classList.add("hidden"),t.querySelector("#txtISVCheck").classList.add("hidden"),t.querySelector("#btnAdd").disabled=!0,t.querySelector("#btnAdd").classList.add("hidden"),a.click(),setModalTitle(o,r),setNameModalButton(s,l)}function assignTotals(e,t,a){let o=0,r=parseFloat(a.descuento),s=parseFloat(a.impuesto),l=0;t.forEach((e=>{o+=parseFloat(e.total)})),l=Math.round(100*(o-r+s))/100,e(o,r,s,l)}export async function send(e={},t="001"){const a="../../app/controllers/ConsignmentController.php";if(!e)return{success:!1,message:"Los datos son requeridos."};switch(t){case"001":return await create(e,a);case"002":return await destroy(e,a);default:}}