import saveAs from "../FileSaver";

class Card {
    title;
    description;
    article;
    img_src;
    link;

    constructor(title,description,article,img_src,link) {
        this.title=title;
        this.description = description;
        this.article=article;
        this.img_src=img_src.contains('/')?img_src:'./dist/img/'+img_src;
        this.link=link;
    }
}
class Download extends Card{

    constructor(title,description,file_src,) {
        file_src= file_src.contains("/")?file_src:'./dist/files'
        super(title,description,null,file_src,null);
    }
}

function saveDataToFile(data,name) {
    var blob = new Blob(data, { type: "text/plain;charset=utf-8" });
    saveAs(blob,name+".json");
}
