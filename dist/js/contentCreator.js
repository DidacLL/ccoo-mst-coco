// import {Card} from "./content.js";
//
// function createForm(){
//     document.querySelector("#section-select").addEventListener("change",()=>checkSelector());
//     document.querySelector("#type-select").addEventListener("change",()=>checkType());
//     document.querySelector("#btn-generate").disabled=true;
//     document.querySelector("#btn-edit").disabled=true;
//     document.querySelector('#btn-process').disabled = true
//     document.querySelector('#btn-process').addEventListener("click",()=>processContent())
// }
// let prevContent;
//
// function checkAllInputs() {
//     let d = document, [inputs, btnProcess] = [
//         d.querySelectorAll('[type="text"]'),
//         d.querySelector('#btn-process')]
//     for (let i = 0; i < inputs.length; i++) {
//         inputs[i].addEventListener('input', () => {
//             let values = []
//             inputs.forEach(v => values.push(v.value))
//             btnProcess.disabled = values.includes('')
//         })
//     }
// }
// function checkType() {
//     const value = document.querySelector('#type-select').value;
//     let formContentBox=document.querySelector('#content-box');
//     if(value==1) {
//         removeAllChildNodes(formContentBox);
//         formContentBox.insertAdjacentHTML('afterbegin', `
//
//             <p class="label row no-wrap m-2" >Content</p>
//             <div class="form-outline row m-2 ">
//             <textarea id="card-content" class="form-control col-sm-10 m-2" rows="10" cols="100"
//                       placeholder="CONTENIDO (admite código HTML)"></textarea>
//                       <div id="content-current-buttons"class="row no-wrap m-2">
//                       <div id="content-current-pictures"class="row no-wrap m-2">
//
//             <div id="content-buttons" class="row no-wrap m-2">
//                 <div id="add_btn_btn" class="btn-primary p-3 m-3 ">añadir botón</div>
//                 <div id="add_pic_btn" class="btn-primary p-3 m-3 ">añadir imagen</div>
//             </div>
//         </div>`);
//     }else if(value==2){
//         removeAllChildNodes(formContentBox);
//         formContentBox.insertAdjacentHTML('afterbegin',`
//         <p class="label row no-wrap m-2" >Destination</p>
//         <div class="form-outline row no-wrap m-2">
//             <input type="text" id="card-action" class="form-control col-sm-10 m-2"
//                    placeholder="Introducir la URL de destino"/>
//         </div>`);
//     }
//     expandOptions(document.querySelector('#section-select').value>0 && value>0);
// }
// function checkSelector() {
//     expandOptions(document.querySelector('#section-select').value>0
//         && document.querySelector('#type-select').value>0);
// }
// function expandOptions(show){
//     $('#editOptions').collapse(show?'show':'hide');
// }
//
// function saveCard() {
//     return download(JSON.stringify(prevContent,null,'\t'),'prevContent')
// }
//
// function processContent(){
//
//     let value = document.querySelector("#type-select").value;
//     prevContent = new Card(
//             document.querySelector("#card-title").value,
//             document.querySelector("#card-description").value,
//             value==1? document.querySelector("#card-content").value:null,
//             document.querySelector("#card-picture").value,
//             value==2?document.querySelector("#card-action").value:null
//         );
//
//     let preview= document.querySelector('#preview');
//     removeAllChildNodes(preview);
//     preview.insertAdjacentHTML("beforeend", prevContent.html);
//     prevContent.activate(preview.lastChild);
//     document.querySelector("#btn-generate").disabled=false;
//     document.querySelector("#btn-generate").addEventListener('click',()=>saveCard());
// }
//
// window.onload= function (){
//     createForm();
//     checkAllInputs();
// }
// function removeAllChildNodes(parent) {
//     while (parent.firstChild) {
//         parent.removeChild(parent.firstChild);
//     }
// }
// function download(content, fileName) {
//     var a = document.createElement("a");
//     var file = new Blob([content], {type:  "application/json"});
//     a.href = URL.createObjectURL(file);
//     a.download = fileName;
//     a.click();
// }