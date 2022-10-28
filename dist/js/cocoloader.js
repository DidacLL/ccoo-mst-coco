//----------------------------------------------------------------------------------------------------- Global Variables
let resizeTimer;
let currentContent;
let mainResumeContent;



//----------------------------------------------------------------------------------------------------- Listeners
window.onresize=function (){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(function (){cocoResize()},100);
}
document.onload= function (){
    cocoResize();

}


function cocoResize() {
   // let mainWidth= visualViewport.width;
   // let mainHeight= visualViewport.height;
   // let isVertical= mainWidth<mainHeight;
   // let vw=(mainWidth/100);
   // let columns = Math.round(mainWidth / (180+ (vw*2)));
   // let rest = (mainWidth / columns)-250;
   // const cards = document.querySelectorAll('.card');
   //
   //  cards.forEach(card => {
   //      card.setAttribute('width', (rest>2*vw)?'250px':Math.round(mainWidth/columns)+'px');
   //      card.style.margin= rest>2*vw? Math.round(rest)+'px': (2*vw)+'px';
   //  });


}
