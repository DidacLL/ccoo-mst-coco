//----------------------------------------------------------------------------------------------------- Global Variables
import {constructCard, ContentLoader} from "./content.js";
import {Card} from "./content.js";
import {PAGES} from "./content.js";

const COCODATA_PATH = '../dist/cocodata.json';

const EDITOR_HTML = `
<div id= "editor-header" class="m-5 no-wrap">
    <h2>Admin Mode</h2>
    <button id="btn-save" class="btn-primary px-3 py-1 mx-3 disabled"> Save </button>
    <button id="btn-cancel" class="btn-primary px-3 py-1 mx-3"> Exit </button>
    <button id="btn-help" class="btn-primary px-3 py-1 mx-3"> Help </button>
</div>
<form class="m-5">
    <label for="section-select"> Selecciona la sección </label>
    <select id="section-select" class="form-control sm-10 m-3">
        <option selected value="-1"> elige...</option>
                <option value="0">Home</option>
                <option value="1">Comunicados</option>
                <option value="2">Documentos</option>
                <option value="3">Magazines</option>
                <option value="4">Pildoras</option>
                <option value="5">Plantillas</option>
                <option value="6">Apps</option>
                <option value="7">Sobre nosotros</option>
            </select>
    <label for="type-select"> Selecciona el tipo </label>
    <select id="type-select" class="form-control sm-10 m-3">
        <option selected value="0"> elige...</option>
        <option value="1">Article</option>
        <option value="2">Link</option>
        <option value="3">Shortcut</option>
        
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
</div>`;

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
    }
}

function loadCocoData() {
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (this.status === 200) {

                console.log('COCO-DATA.JSON loaded!!')
                // contentVault=Object.assign(new ContentLoader(), this.responseText);
                contentVault = new ContentLoader(this.responseText);
                contentVault.addAllSectionContent(document.querySelector('#main_body'),PAGES[0]);

                console.log(contentVault)
            } else {
                console.log('Failed to load COCO-DATA.JSON')
                contentVault = new ContentLoader(null);
            }
        }
    }
    xhttp.open("GET", COCODATA_PATH, true);
    xhttp.send();
}

function closeEditMode() {
    removeAllChildNodes(document.querySelector('#blank_space'))
    document.body.style.overflow = 'hidden';
    editMode = false;
}

function openEditMode() {
    if (editMode) {
        closeEditMode();
        openEditMode();
    } else {
        document.querySelector('#blank_space').insertAdjacentHTML('afterbegin', EDITOR_HTML);
        editMode = true;
        createForm();
        checkAllInputs();
        document.getElementsByTagName("body")[0].style.overflow = 'scroll';
    }

}

function changeMenu() {
    if (editMode) closeEditMode();
}

function setMenuListeners() {
    document.querySelector('#menu-publish-btn').addEventListener('click', () => openEditMode());
    document.querySelectorAll('.dropdown-item')
        .forEach(item => item.addEventListener('click', () => item !== document.querySelector('#menu-publish-btn') ? changeMenu() : null));
}

window.onload = function () {
    console.log("starting on load")
    // changeCurrentContent(pages.Home);
    cocoResize();
    if (!contentVault) loadCocoData();
    setMenuListeners();

}


function cocoResize() {

}

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------CONTENT CREATOR------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------

function createForm() {
    let saveBtn = document.querySelector('#btn-save');
    saveBtn.disabled = !contentVault.unsavedData;
    saveBtn.addEventListener('click', () => saveAllChanges());
    document.querySelector("#section-select").addEventListener("change", () => checkSelector());
    document.querySelector("#type-select").addEventListener("change", () => checkType());
    document.querySelector("#btn-generate").disabled = true;
    document.querySelector("#btn-cancel").addEventListener("click", () => closeEditMode())
    document.querySelector('#btn-process').disabled = true;
    document.querySelector('#btn-process').addEventListener("click", () => processContent())
    console.log(document.querySelector("#btn-generate").disabled)

}

let newContent;

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

    function loadContentList() {
        let pagename = PAGES[document.querySelector('#select-section-link').value].name;
        console.log('LOADING SECTION LIST: ' + pagename);
        if (contentVault) {
            let section = contentVault.getSection(pagename);
            let contSelect = document.querySelector('#select-content-link');
            section.forEach(elem => contSelect.options[contSelect.options.length] = new Option(elem.title, elem.id));
        }
    }

    if (value == 1) {
        removeAllChildNodes(formContentBox);
        formContentBox.insertAdjacentHTML('afterbegin', `

            <p class="label row no-wrap m-2" >Content</p>
            <div class="form-outline row m-2 ">
            <textarea id="card-content" class="form-control col-sm-10 m-2" rows="10" cols="100"
                      placeholder="CONTENIDO (admite código HTML)"></textarea>
                      <div id="content-current-buttons" class="row no-wrap m-2">
                      <div id="content-current-pictures" class="row no-wrap m-2">
                   
            <div id="content-buttons" class="row no-wrap m-2">
                <button id="add_btn_btn" class="btn-primary p-3 m-3 ">añadir botón</button>
                <button id="add_pic_btn" class="btn-primary p-3 m-3 ">añadir imagen</button>
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
    } else if (value == 3) {
        let editOptions = document.querySelector('#editOptions');
        removeAllChildNodes(editOptions);
        editOptions.insertAdjacentHTML('afterbegin', `
        <p class="label row no-wrap m-2" >Destination</p>
        <div class="form-outline row no-wrap m-2">
            <select  id="select-section-link" class="form-control sm-10 m-3">
                <option selected value="-1"> elige...</option>
                <option value="0">Home</option>
                <option value="1">Comunicados</option>
                <option value="2">Documentos</option>
                <option value="3">Magazines</option>
                <option value="4">Pildoras</option>
                <option value="5">Plantillas</option>
                <option value="6">Apps</option>
                <option value="7">Sobre nosotros</option>
            </select>
             <select  id="select-content-link" class="form-control sm-10 m-3">
                <option selected value="0"> elige...</option>
            </select>
        
        </div>`);

        document.querySelector('#select-section-link').addEventListener('change', () => loadContentList());
    }
    expandOptions(document.querySelector('#section-select').value >= 0 && value > 0);
}

function checkSelector() {
    expandOptions(document.querySelector('#section-select').value >= 0
        && document.querySelector('#type-select').value > 0);
}

function expandOptions(show) {
    $('#editOptions').collapse(show ? 'show' : 'hide');
}

function updateMainBody() {

}

function saveNewCard() {
    let section=PAGES[document.querySelector('#section-select').value];
    
    contentVault.addContent(newContent,section);
    newContent=null;
    contentVault.unsavedData=true;
    emptyForm();
    removeAllChildNodes(document.querySelector('#preview'));
    removeAllChildNodes(document.querySelector('#main_body'));
    contentVault.addAllSectionContent(document.querySelector('#main_body'),section)
    //todo: change to contentVault adding and delete newContent
    // return download(JSON.stringify(newContent, null, '\t'), 'newContent')
}

function emptyForm() {
    if (newContent) {
        //TODO CONFIRMATION MODAL UNSAVED DATA
    }
    closeEditMode();
    openEditMode();

    //EMPTY ALL FIELDS
}

function fillForm(content) {
    //TODO fill all fields with existing content
}

function saveAllChanges() {
    contentVault.saveContentData();
    //TODO Download json
}

function processContent() {

    let value = document.querySelector("#type-select").value;
    newContent = constructCard(
        document.querySelector("#card-title").value,
        document.querySelector("#card-description").value,
        value == 1 ? document.querySelector("#card-content").value : null,
        document.querySelector("#card-picture").value,
        value == 2 ? document.querySelector("#card-action").value : null,
        PAGES[document.querySelector('#section-select').value]
    );

    let preview = document.querySelector('#preview');
    removeAllChildNodes(preview);
    preview.insertAdjacentHTML("beforeend", newContent.getHtml());
    
    newContent.activate();
    document.querySelector("#btn-generate").disabled = false;
    document.querySelector("#btn-generate").addEventListener('click', () => saveNewCard());
}


//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------UTILS-----------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
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