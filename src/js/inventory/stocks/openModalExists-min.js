import{alert}from"../../module/alert-min.js";import{setModalTitle,setNameModalButton}from"../../module/modal-min.js";import{update}from"../../module/services/services-min.js";export default function openModalCreate(e,t,o,r,a,s){var i=t.row({selected:!0}).data();switch(a.querySelector("#txtActionExist").value){case"001":setParameters(i,a,s,"modalTitleExist","Agregar Existencias","btnModalExist","Agregar existencias");break}}async function setParameters(e,t,o,r,a,s,i){e?(t.querySelector("#txtCodeExist").value=e.codigo_articulo,t.querySelector("#txtArticleExist").value=e.nombre_articulo,t.querySelector("#txtQuantityExist").value=e.disponibilidad,o.click(),setModalTitle(r,a),setNameModalButton(s,i)):alert("Aviso","Debe seleccionar un registro.","info","OK",!1)}export async function send(e={},t="001"){if(!e)return{success:!1,message:"Los datos son requeridos."};switch(t){case"001":return await update(e,"../../app/controllers/StockController.php")}}