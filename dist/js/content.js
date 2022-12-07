export const PAGES= Object.freeze([
    {name:"home",num:0},
    {name:"comunicados",num:1},
    {name:"documentos",num:2},
    {name:"magazines",num:3},
    {name:"pildoras",num:4},
    {name:"plantillas",num:5},
    {name:"tools",num:6},
    {name:"about",num:7}
])

function constructPage(pageName) {

}
//from https://www.xul.fr/javascript/map-and-object.php
    function mapToObject(m) {
        let lo = {}
        for (let [k, v] of m) {
            if (v instanceof Map) {
                lo[k] = mapToObject(v)
            } else {
                lo[k] = v
            }
        }
        return lo
    }

    function objectToMap(o) {
        let m = new Map()
        for (let k of Object.keys(o)) {
            if (o[k] instanceof Object) {
                m.set(k, objectToMap(o[k]))
            } else {
                m.set(k, o[k])
            }
        }
        return m
    }

export class ContentLoader {
    pages
    lastUpdate
    unsavedData
    constructor(json) {
        if(json==null) {
            this.pages= new Map();
            PAGES.forEach(page=> this.pages.set(page.name,new Map()));
            this.updateDate();
            console.log(this);
            this.unsavedData=true;
        }else{
            this.pages = objectToMap(JSON.parse(json));
            this.unsavedData=false;
        }
    }

    updateDate() {
        let da= new Date();
        this.lastUpdate = da.getFullYear() * 10000 + da.getMonth() * 100 + da.getDay();
    }

    saveContentData() {
        this.updateDate();
        this.unsavedData=false;
        download(JSON.stringify(mapToObject(this.pages)), 'cocodata');
    }

    addContent(card,section){
        if(!isNaN(section))section=PAGES[section].name;
        this.unsavedData=true;
        this.updateDate()
        card.date=new Date();
        console.log(section)
        this.pages.get(section).set(card.id,card);
    }
    removeContent(card){
        this.unsavedData=true;
        this.pages.remove(card);
    }
    getSection(section){
        console.log('Get section: '+section);
        if(!isNaN(section))section=PAGES[section];
        return this.pages.get(section);

    }
    getContent(section,id){
        //todo
    }

    addAllSectionContent(target,section){
        let list = Array.from(this.getSection(section).values());
        list= list.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
        for (let i = 0; i < list.length; i++) {
            console.log(list[i])
            target.insertAdjacentHTML('beforeend',list[i].getHtml())
            list[i].activate();
        }


    }
}
export class Card {
    title;
    card_description;
    article;
    img_src;
    url;
    id;
    date;
    constructor(title, card_description, article, img_src,url) {
        console.log(article)
        this.title = title.trim();
        this.card_description = card_description.trim();
        this.article = article==null?null:article;
        this.id=title.trim().replace(/[^0-9a-zA-Z_ ]/g, "").replace(' ',"_").toLowerCase();

        if(url!=null){
            url=url.trim();
            this.url = url.includes('./')?url:url.includes('http')?url.trim():'https://'+url.trim();
        }
        this.img_src = img_src.includes("/")?img_src.trim():'./dist/img/'+img_src.trim();
        this.title=title;
        Object.defineProperty(this, 'expanded', {value: 'static', writable: true});
        this.expanded=false;
        this.constructHtml();
        console.log('HTML: '+ this.html)
        console.log('JSON: ')
        console.log(JSON.stringify(this))
    }
    activate() {
        let auxId= (this.expanded?'#ex_card_':'#card_')+this.id
        console.log('activating: '+auxId)
        document.querySelector(auxId).addEventListener("click", this.url == null ? () => this.expand() : () => this.openLink())
    }
    expand(){
        console.log("EXPANDING: "+this.id)
        let auxId= (this.expanded?'#ex_card_':'#card_')+this.id;
        let oldElem = document.querySelector(auxId);
        if(!this.expanded) {
            this.expanded=true;
            oldElem.parentElement.insertAdjacentHTML("afterbegin",
                this.getHtml()
            );
            auxId = '#ex_card_' + this.id;
            oldElem.remove();
            this.activate()
            return document.querySelector(auxId)
        }
        this.expanded=false;
        oldElem.parentElement.insertAdjacentHTML("afterbegin",this.getHtml())
        auxId = '#card_' + this.id;
        oldElem.remove();
        this.activate()
        return document.querySelector(auxId)
    }
    openLink(){
        window.open(this.url, '_blank').focus();
    }
    constructHtml(){
        Object.defineProperty(this, 'html', {value: 'static', writable: true});
        let auxId= 'card_'+ this.id;
        const urlTag= this.url==null?'':'<div class="btn btn-primary">Abrir</a>\n'
        return this.html=`<div id="${auxId}"class="card">
                    <div class="card-header">
                        <img class="card-img-top" src="${this.img_src}" alt="Card image cap">
                    </div>
                    <div class="card-body">
                          <h5 class="card-title">${this.title}</h5>
                          <p class="card-text">${this.card_description}</p>  
                          ${urlTag}
                    </div>
               </div>`
    }
    constructExpandedHtml(){
        Object.defineProperty(this, 'expandedHtml', {value: 'static', writable: true});

        let auxId= 'ex_card_'+this.id;
        return this.expandedHtml=`<div id="${auxId}"class="card expanded">
                    <div class="card-header expanded">
                        <img class="card-img-top expanded" id="${auxId}_img" src="${this.img_src}" alt="Card image cap">
                        <h5 class="card-title">${this.title}</h5>
                    </div>
                    <div class="card-body expanded">
                          <div class="card-text expanded">${this.article}</div>  
                    </div>
               </div>`
    }

    getHtml(){
        if(this.expanded){
            if (this.expandedHtml)return this.expandedHtml;
            return this.constructExpandedHtml();
        }
        if (this.html) return this.html;
        return this.constructHtml();
    }
}
function download(content, fileName) {
    var a = document.createElement("a");
    var file = new Blob([content], {type:  "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
