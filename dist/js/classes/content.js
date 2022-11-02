import saveAs from "../FileSaver";

class Card {
    content;
    html;
    element;

    constructor(content) {
        this.html=this.constructHtml(content);

    }

    constructHtml(content){
        return `<div id="card_${content.filename}" class="card">
                    <div class="card-header">
                        <img class="card-img-top" src="${content.img_src}" alt="Card image cap">
                    </div>
                    <div class="card-body">
                          <h5 class="card-title">${content.title}</h5>
                          <p class="card-text">${content.description}</p>  
                    </div>
               </div>`
    }
    action(){

    }
}
class Download extends Card{

    constructor(title,description,file_src,) {
        file_src= file_src.contains("/")?file_src:'./dist/files'
        super(title,description,null,file_src,null);
    }
}
class Content {
    title;
    card_description;
    article;
    img_src;


    constructor(title, card_description, article, img_src) {
        this.title = title;
        this.card_description = card_description;
        this.article = article;
        this.img_src = img_src;

        this.title=title;
        this.filename=filename.replace('.json','');
    }
}

function saveDataToFile(data,name) {
    var blob = new Blob(data, { type: "text/plain;charset=utf-8" });
    saveAs(blob,name+".json");
}


