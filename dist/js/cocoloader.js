//----------------------------------------------------------------------------------------------------- Global Variables
let resizeTimer;
let currentContent;
const header=document.querySelector("#main_header")
const body=document.querySelector('#colg_body')
const pages= Object.freeze({
    Home: Symbol("home"|0),
    Comunicados: Symbol("comunicados"|1),
    Pildoras: Symbol("pildoras"|1),
    Plantillas: Symbol("plantillas"|2),
    Magazines: Symbol("magazines"|2),
    Documentos: Symbol("documentos"|2),
    Tools: Symbol("tools"|3),
    About: Symbol("about"|3)
})
let mainResumeContent;



//----------------------------------------------------------------------------------------------------- Listeners
window.onresize=function (){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function (){cocoResize()},100);
}

function loadHome() {
    
}

function cleanAllContent() {
    body.innerHTML="";
    currentContent=null;
}

function changeCurrentContent(page) {
    
    cleanAllContent();
    switch (page) {
        case pages.Home:
            loadHome();
            break;
        
        case pages.Comunicados:
            load();
            break;
        case pages.Pildoras: 
            
            break;
        case pages.Plantillas:
            break;
        case pages.Magazines:
            break;
        case pages.About:
            break;

        case pages.Documentos:
            break;
        case pages.Tools:
            break;
        default:
    }
}

function loadFile(path,elem){
    let xhttp;
    if(path){
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange= function (){
            if(this.readyState===4){
                if(this.status===200){
                    elem.innerHTML=this.responseText;
                    console.log(this.responseText);
                    }
            }
        }
        xhttp.open("GET",path,true);
        xhttp.send();
        return;
    }
}

window.onload= function (){
    console.log("starting on load")
    loadFile('../dist/content/about/intro.txt',body.children.item(1).children.item(1));
    // changeCurrentContent(pages.Home);
    cocoResize();
}



function cocoResize() {
   //  let main_body= document.querySelector('#main_body')
   // let mainWidth= main_body.getBoundingClientRect().width;
   // let mainHeight= main_body.getBoundingClientRect().height;
   // let isVertical= mainWidth<mainHeight;
   //  const cards = document.querySelectorAll('.card');
   //  let cardWidth= cards[0].getBoundingClientRect().width;
   // 
   //  let vw=(mainWidth/100);
   //  let vh=(mainHeight/100);
   //  let columns = Math.round(mainWidth / cardWidth);
   //  let rest= mainWidth- (cardWidth * columns)
   //  if(rest>=vw) {
   //      let restCard= Math.round(rest/columns);
   //       cards.forEach(card => {
   //           console.log('Initial cardwidth='+cardWidth+" rest="+rest+" restcard="+restCard)
   //           card.style.maxWidth+=restCard;
   //           card.style.width+=restCard;
   //           card.clientWidth=cardWidth+restCard;
   //          
   //           console.log(card.getBoundingClientRect().width)
   //       });
   //  }


}
