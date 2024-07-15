import{setModalTitle,setNameModalButton,setFormReadOnly}from"../../module/modal-min.js";import{alert}from"../../module/alert-min.js";import{create,destroy,read}from"../../module/services/services-min.js";export default function openModal(e,t,r,a,o,l,s,d){var i=t.row({selected:!0}).data();switch(o.querySelector("#txtAction").value){case"001":o.querySelector("#txtDate").value=(new Date).toISOString().split("T")[0],setModalTitle("modalTitle","Agregar nueva entrada"),setNameModalButton("btnModal","Guardar datos"),l.click();break;case"005":setFormReadOnly("frmEntry"),setParameters(i,o,l,"modalTitle","Ver entrada","btnModal","Ver entrada",s,d);break;default:break}}async function setParameters(e,t,r,a,o,l,s,d,i){if(!e)return void alert("Aviso","Debe seleccionar un registro.","info","OK",!1);const n=await read(`../../app/controllers/EntryController.php?entry=${e.codigo}`),c=n[0].details;if(n){t.querySelector("#txtCode").value=n[0]?.codigo,t.querySelector("#txtProvider").value=n[0]?.Proveedor,t.querySelector("#txtRTNProvider").value=n[0]?.rtn,t.querySelector("#txtLogistic").value=n[0]?.oficialuno,t.querySelector("#txtDate").value=n[0]?.fecha,t.querySelector("#txtResponsible").value=n[0]?.responsable,t.querySelector("#txtNote").value=n[0]?.observacion,t.querySelector("#txtTypeEntry").value=n[0]?.tipo,t.querySelector("#txtAuditor").value=n[0]?.oficialdos,t.querySelector("#txtOficial").value=n[0]?.oficialtres,d.push(...c);let e=i.table().container().querySelectorAll(".btn-delete");if(e&&e.length>0)for(let t=0;t<e.length;t++)e[t].classList.add("disabled");i.clear(),i.rows.add(d),i.draw()}t.querySelector(`#${l}`).disabled=!0,t.querySelector(`#${l}`).classList.add("hidden"),t.querySelector("#btnAdd").disabled=!0,t.querySelector("#btnAdd").classList.add("hidden"),t.querySelector("#btnPrint").disabled=!1,t.querySelector("#btnPrint").classList.remove("hidden"),r.click(),setModalTitle(a,o),setNameModalButton(l,s)}export async function send(e={},t="001"){const r="../../app/controllers/EntryController.php";if(!e)return{success:!1,message:"Los datos son requeridos."};switch(t){case"001":return await create(e,r);case"002":return await destroy(e,r);default:}}