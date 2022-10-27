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


}


function cocoResize() {
   //TODO
}
