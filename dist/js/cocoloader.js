//----------------------------------------------------------------------------------------------------- Global Variables
import {ContentLoader} from "./content.js";
import {Card} from "./content.js";


let resizeTimer;
let currentContent;
const header = document.querySelector("#main_header")
const body = document.querySelector('#colg_body')

let contentVault;
let mainResumeContent;
let editMode = false;

//----------------------------------------------------------------------------------------------------- Listeners
window.onresize = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        cocoResize()
    }, 100);
}

function loadHome() {

}

function cleanAllContent() {
    body.innerHTML = "";
    currentContent = null;
}

function changeCurrentContent(page) {

    cleanAllContent();
    // switch (page) {
    //     case pageNames.Home:
    //         loadHome();
    //         break;
    //    
    //     case pageNames.Comunicados:
    //         load();
    //         break;
    //     case pageNames.Pildoras: 
    //        
    //         break;
    //     case pageNames.Plantillas:
    //         break;
    //     case pageNames.Magazines:
    //         break;
    //     case pageNames.About:
    //         break;
    //
    //     case pageNames.Documentos:
    //         break;
    //     case pageNames.Tools:
    //         break;
    //     default:
    // }
}

function loadFile(path, elem) {
    let xhttp;
    if (path) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    elem.innerHTML = this.responseText;
                    console.log(this.responseText);
                }
            }
        }
        xhttp.open("GET", path, true);
        xhttp.send();
        return;
    }
}

function getFile(path) {
    let xhttp;
    let res;
    if (path) {
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    contentVault = new ContentLoader(this.responseText);
                } else {
                    contentVault = new ContentLoader(null);
                }
            }
        }
        xhttp.open("GET", path, true);
        xhttp.send();

        return res;
    }
}

function closeEditMode() {
    removeAllChildNodes(document.querySelector('#blank_space'))
    document.body.style.overflow='hidden';
    editMode = false;
}

function addNewContent() {
    if(editMode){
        closeEditMode();
        addNewContent();
    }else {
        document.querySelector('#blank_space').insertAdjacentHTML('afterbegin', `
        <div class="flex-row m-5">
            <h2>Rellena los campos para crear el nuevo contenido.</h2>
        </div>
        <form class="m-5">
            <label for="section-select"> Selecciona la sección </label>
            <select id="section-select" class="form-control sm-10 m-3">
                <option selected value="0"> elige...</option>
                <option value="1">Home</option>
                <option value="2">Comunicados</option>
                <option value="3">Documentos</option>
                <option value="4">Magazines</option>
                <option value="5">Pildoras</option>
                <option value="6">Plantillas</option>
                <option value="7">Apps</option>
                <option value="8">Sobre nosotros</option>
            </select>
            <label for="type-select"> Selecciona el tipo </label>
            <select id="type-select" class="form-control sm-10 m-3">
                <option selected value="0"> elige...</option>
                <option value="1">Article</option>
                <option value="2">Link</option>
            </select>
            <div class="collapse " id="editOptions">
                <p class="label row no-wrap m-2" >Title</p>
                <div class="form-outline row no-wrap m-2">
                    <input type="text" id="card-title" class="form-control col-sm-10 m-2" data-mdb-showcounter="true"
                           maxlength="35"
                           placeholder="TITULO"/>
                    <label class="label label-default mt-3" id="count_title" for="card-title">Title</label>
                </div>
                <p class="label row no-wrap m-2" >Description</p>
                <div class="form-outline row no-wrap m-2">
                    <input type="text" id="card-description" class="form-control col-sm-10 m-2" data-mdb-showcounter="true"
                           maxlength="35" placeholder="DESCRIPCION breve para la previsualización"/>
                    <label class="label label-default mt-3" id="count_description" for="card-description"></label>
                </div>
                <div id="content-box">
                </div>
                <p class="label row no-wrap m-2" >Header Picture</p>
                <div class="form-outline row no-wrap m-2">
                    <input type="text" id="card-picture" class="form-control col-sm-10 m-2"
                           placeholder="IMAGEN Introducir nombre del archivo alojado en './dist/img' o URL"/>
                </div>
            </div>
            <div class="form-outline row no-wrap m-2" id="preview"></div>
        </form>
        <div class=" footer mt-auto py-3 ">
            <button id="btn-process" class="btn-primary p-3 m-3 disabled"> Previsualizar</button>
            <button id="btn-generate" class="btn-primary p-3 m-3"> Añadir</button>
            <button id="btn-cancel" class="btn-primary p-3 m-3"> Cancelar</button>
        </div>`);
        editMode = true;
        createForm();
        checkAllInputs();
        document.getElementsByTagName("body")[0].style.overflow = 'scroll';
    }

}

function changeMenu() {
    if(editMode)closeEditMode();
}

window.onload = function () {
    console.log("starting on load")
    // loadFile('../dist/content/about/intro.txt',body.children.item(1).children.item(1));
    // changeCurrentContent(pages.Home);
    cocoResize();
    getFile('../dist/cocodata.json');
    document.querySelector('#menu-publish-btn').addEventListener('click', () => addNewContent());
    document.querySelectorAll('.dropdown-item')
        .forEach(item=>item.addEventListener('click',()=> item!==document.querySelector('#menu-publish-btn')?changeMenu():null));

}



function cocoResize() {

}

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------CONTENT CREATOR------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

function createForm() {
    document.querySelector("#section-select").addEventListener("change", () => checkSelector());
    document.querySelector("#type-select").addEventListener("change", () => checkType());
    document.querySelector("#btn-generate").disabled = true;
    document.querySelector("#btn-cancel").addEventListener("click",()=>closeEditMode())
    document.querySelector('#btn-process').disabled = true;
    document.querySelector('#btn-process').addEventListener("click", () => processContent())
    console.log(document.querySelector("#btn-generate").disabled)

}

let prevContent;

function checkAllInputs() {
    let d = document, [inputs, btnProcess] = [
        d.querySelectorAll('[type="text"]'),
        d.querySelector('#btn-process')]
    for (let i = 0; i < inputs.length; i++) {
        inputs[i].addEventListener('input', () => {
            let values = []
            inputs.forEach(v => values.push(v.value))
            btnProcess.disabled = values.includes('')
        })
    }
}

function checkType() {
    const value = document.querySelector('#type-select').value;
    let formContentBox = document.querySelector('#content-box');
    if (value == 1) {
        removeAllChildNodes(formContentBox);
        formContentBox.insertAdjacentHTML('afterbegin', `

            <p class="label row no-wrap m-2" >Content</p>
            <div class="form-outline row m-2 ">
            <textarea id="card-content" class="form-control col-sm-10 m-2" rows="10" cols="100"
                      placeholder="CONTENIDO (admite código HTML)"></textarea>
                      <div id="content-current-buttons"class="row no-wrap m-2">
                      <div id="content-current-pictures"class="row no-wrap m-2">
                   
            <div id="content-buttons" class="row no-wrap m-2">
                <div id="add_btn_btn" class="btn-primary p-3 m-3 ">añadir botón</div>
                <div id="add_pic_btn" class="btn-primary p-3 m-3 ">añadir imagen</div>
            </div>
        </div>`);
    } else if (value == 2) {
        removeAllChildNodes(formContentBox);
        formContentBox.insertAdjacentHTML('afterbegin', `
        <p class="label row no-wrap m-2" >Destination</p>
        <div class="form-outline row no-wrap m-2">
            <input type="text" id="card-action" class="form-control col-sm-10 m-2"
                   placeholder="Introducir la URL de destino"/>
        </div>`);
    }
    expandOptions(document.querySelector('#section-select').value > 0 && value > 0);
}

function checkSelector() {
    expandOptions(document.querySelector('#section-select').value > 0
        && document.querySelector('#type-select').value > 0);
}

function expandOptions(show) {
    $('#editOptions').collapse(show ? 'show' : 'hide');
}

function saveCard() {
    return download(JSON.stringify(prevContent, null, '\t'), 'prevContent')
}

function processContent() {

    let value = document.querySelector("#type-select").value;
    prevContent = new Card(
        document.querySelector("#card-title").value,
        document.querySelector("#card-description").value,
        value == 1 ? document.querySelector("#card-content").value : null,
        document.querySelector("#card-picture").value,
        value == 2 ? document.querySelector("#card-action").value : null
    );

    let preview = document.querySelector('#preview');
    removeAllChildNodes(preview);
    preview.insertAdjacentHTML("beforeend", prevContent.html);
    prevContent.activate(preview.lastChild);
    document.querySelector("#btn-generate").disabled = false;
    document.querySelector("#btn-generate").addEventListener('click', () => saveCard());
}

// window.onload= function (){
// }
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}
function download(content, fileName) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}