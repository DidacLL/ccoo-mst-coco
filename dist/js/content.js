const pageNames= Object.freeze({
    Home: Symbol("home"|1),
    Comunicados: Symbol("comunicados"|2),
    Documentos: Symbol("documentos"|3),
    Magazines: Symbol("magazines"|4),
    Pildoras: Symbol("pildoras"|5),
    Plantillas: Symbol("plantillas"|6),
    Tools: Symbol("tools"|7),
    About: Symbol("about"|8)
})

function constructPage(pageName) {

}

export class ContentLoader {
    pages
    constructor(json) {
        if(json==null) {
            this.pages= new Map();
            console.log(pageNames)
            this.pages.set(pageNames.Home.description,[])
            this.pages.set(pageNames.Comunicados.description,[])
            this.pages.set(pageNames.Documentos.description,[])
            this.pages.set(pageNames.Magazines.description,[])
            this.pages.set(pageNames.Pildoras.description,[])
            this.pages.set(pageNames.Plantillas.description,[])
            this.pages.set(pageNames.Tools.description,[])
            this.pages.set(pageNames.About.description,[])
            download(JSON.stringify(Object.fromEntries(this.pages)),'cocodata')
            // pageNames.forEach(name=>this.pages.set(name.description,null));

        }else{
            this.pages = new Map(Object.entries(JSON.parse(json)));
        }
    }
    addContent(card,section){
        let secSection=  Number.isNumber(section)?pageNames.get(section).description:section;
        let val = this.pages.get(secSection);
        val.push(card);
        this.pages.set(secSection,val);
    }
    removeContent(card){
        this.pages.remove(card);
    }

}
// import { saveAs } from 'file-saver';
export class Card {
    html;
    expandedHtml;
    element;
    title;
    card_description;
    article;
    img_src;
    url;
    id;
    constructor(title, card_description, article, img_src,url) {
        console.log(article)
        this.title = title.trim();
        this.card_description = card_description.trim();
        this.article = article==null?null:article;

        if(url!=null){
            url=url.trim();
            this.url = url.includes('./')?url:url.includes('http')?url.trim():'https://'+url.trim();
        }
        this.img_src = img_src.includes("/")?img_src.trim():'../img/'+img_src.trim();
        this.title=title;
        this.html=this.constructHtml(
            this.title,
            this.img_src,
            this.card_description,
            this.url==null?null:this.url);
    }
    activate(element) {
        let auxId= '#'+this.id
        document.querySelector(auxId).addEventListener("click", this.url == null ? () => this.expand() : () => this.openLink())
    }
    expand(){
        console.log("EXPANDING")
        let auxId = '#' + this.id;
        let oldElem = document.querySelector(auxId);
        if(!this.id.includes('ex_')) {
            oldElem.parentElement.insertAdjacentHTML("afterbegin",
                this.expandedHtml==null?
                this.constructExpandedHtml(
                    this.title,
                    this.img_src,
                    this.article,
                ) : this.expandedHtml
            )
            auxId = '#' + this.id;
            oldElem.remove();
            let newElem=document.querySelector(auxId);
            this.activate(newElem)
            this.element=newElem;
            return document.querySelector(auxId)
        }
        oldElem.parentElement.insertAdjacentHTML("afterbegin",this.html)
        this.id=this.id.replace('ex_','');
        auxId = '#' + this.id;
        oldElem.remove();
        let newElem=document.querySelector(auxId);
        this.activate(newElem)
        this.element=newElem;
        return document.querySelector(auxId)
    }


    openLink(){
        window.open(this.url, '_blank').focus();
    }

    constructHtml(title, img_src,description,url){
        let id= 'card_'+title.trim().replace(/[^a-zA-Z ]/g, "").replace(' ',"_").toLowerCase();
        this.id=id;
        const urlTag= url==null?'':'<div class="btn btn-primary">Abrir</a>\n'
        return `<div id="${id}"class="card">
                    <div class="card-header">
                        <img class="card-img-top" src="${img_src}" alt="Card image cap">
                    </div>
                    <div class="card-body">
                          <h5 class="card-title">${title}</h5>
                          <p class="card-text">${description}</p>  
                          ${urlTag}
                    </div>
               </div>`
    }
    constructExpandedHtml(title, img_src,content){
        let id= 'ex_card_'+(title.trim().replace(/[^a-zA-Z ]/g, "")
            .replace(' ',"_").toLowerCase().replace('ex',''));
        this.id=id;
        return `<div id="${id}"class="card expanded">
                    <div class="card-header expanded">
                        <img class="card-img-top expanded" id="${id}_img" src="${img_src}" alt="Card image cap">
                        <h5 class="card-title">${title}</h5>
                    </div>
                    <div class="card-body expanded">
                          <div class="card-text expanded">${content}</div>  
                    </div>
               </div>`
    }


}
function download(content, fileName) {
    var a = document.createElement("a");
    var file = new Blob([content], {type:  "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
