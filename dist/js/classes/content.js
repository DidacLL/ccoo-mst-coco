class Content {
    title;
    description;
    article;
    img_src;
    link;

    constructor(title,description,article,img_src,link) {
        this.title=title;
        this.description = description;
        this.article=article;
        this.img_src=img_src;
        this.link=link;
    }
}
//Read rootFolder.txt File
fetch("./rootFolder.txt").then(function(response) {
    return response
}).then(function(data) {
    return data.text()
}).then(function(Normal) {
    document.getElementById("app").innerHTML = Normal;
}).catch(function(err) {
    console.log('Fetch problem show: ' + err.message);
});


//Read InsideFolder.txt File
fetch("./src/insideFolder.txt").then(function(response) {
    response.text().then(function(text) {
        document.getElementById("appData").innerHTML =text
    });
});