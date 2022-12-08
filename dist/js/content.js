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

//----------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
//---CONTENT---------------------------CONTENT LOADER----------------------LOADER---------------------------------------
//---------------------------------------------------------------------------------------------------CONTENT------------
//---------------------------------------------------------------------------------------------------LOADER-------------
export class ContentLoader {
    pages;
    lastUpdate
    unsavedData
    constructor(json) {
        if(json==null) {
            this.pages=[];
            PAGES.forEach(page=> this.pages.push([]));
            this.updateDate();
            console.log(this);
            this.unsavedData=true;
        }else{
            this.pages=[];
            let obj=JSON.parse(json,cardReviver());
            console.log(obj)
            this.lastUpdate=obj.lastUpdate;
            this.unsavedData=false;
            for (let i = 0; i < obj.pages.length; i++) {
                this.pages[i]=[];
                for(let j = 0; j< obj.pages[i].length;j++){
                    const rawCard = obj.pages[i][j];
                    if(rawCard){
                        this.pages[i][j] = new Card(rawCard.title,
                            rawCard.card_description,
                            rawCard.article,
                            rawCard.img_src,
                            rawCard.url,
                            rawCard.id,
                            rawCard.date,
                            rawCard.section);
                        console.log(this.pages[i][j])
                    }
                }
            }

            // this.pages = JSON.parse(json);
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
        download(JSON.stringify(this), 'cocodata');
    }

    addContent(card,section){
        if(!isNaN(section))section=PAGES[section];
        this.unsavedData=true;
        this.updateDate()
        card.date=new Date();
        console.log(section+" pages conytent is: \n" + this.pages)
        this.pages[section.num].push(card);
    }
    removeContent(card){
        this.unsavedData=true;
        this.pages.remove(card);
    }
    getSection(section){
        // if(!isNaN(section))section=PAGES[section];
        console.log('Get section: '+section.name);
        console.log(this)
        return this.pages[section.num];
    }
    getContent(section,id){
        //todo
    }

    addAllSectionContent(target,section){
        console.log('adding content to '+ section)
        let list = this.getSection(section);
        // list= list.sort((a,b) => (a.date > b.date) ? 1 : ((b.date > a.date) ? -1 : 0));
        for (let i = 0; i < list.length; i++) {
            console.log(list[i])
            target.insertAdjacentHTML('beforeend',list[i].getHtml())
            list[i].activate();
        }


    }
}







//----------------------------------------------------------------------------------------------------------------------
//----///////--------///\\-------||\\\\\-----||\\\\\-------------------------------------------------------------------
//----||------------//---\\------||----\\----||----\\-------------------------------------------------------------------
//----||-----------//-----\\-----||----//----||-----\\------------------------------------------------------------------
//----||----------//////\\\\\----||///\\-----||-----//------------------------------------------------------------------
//----||---------//---------\\---||----\\----||----//-------------------------------------------------------------------
//----\\\\\\\---//-----------\\--||-----\\---||/////--------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------
export function constructCard(title, card_description, article, img_src,url,section) {
    if(url!=null){
        url=url.includes('./')||url.includes('http')?url.trim():'https://'+url.trim();
    }else {
        url=null;
    }
    console.log('adding new card: '+ title)
    return new Card(title.trim(),
        card_description.trim(),
        article == null ? null : article,
        img_src.includes("/")?img_src.trim():'./dist/img/'+img_src.trim(),
        url,
        section.num+"_"+title.trim().replace(/[^0-9a-zA-Z_]/g, "").toLowerCase(),
        new Date(),
        section)
}

export class Card {
    title;
    card_description;
    article;
    img_src;
    url;
    id;
    date;
    section;
    expanded;
    html;
    expandedHtml;
   
    constructor( title,card_description,article,img_src,url,id,date,section) {
        this.title=title;
        this.card_description=card_description;
        this.article=article;
        this.img_src=img_src;
        this.url=url;
        this.id=id;
        this.date=date;
        this.section=section;
        this.expanded=false;
        this.constructHtml();

    }
    toJSON () {
        return {
            '@type':'card',
            title: this.title,
            card_description: this.card_description,
            article:this.article,
            img_src:this.img_src,
            url:this.url,
            id:this.id,
            date:this.date,
            section:this.section
        };
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
    let a = document.createElement("a");
    let file = new Blob([content], {type: "application/json"});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
function cardReviver (key, value) {
    if (value?.['@type'] === 'card') {
        return new Card(value.title, value.card_description, value.article, value.img_src,value.url,value.id,value.date,value.section);
    }
    return value;
}
