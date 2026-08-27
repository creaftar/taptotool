import { zoomIn, zoomOut  } from "../../create/redimensionar.js";
let zoomAdd = document.getElementById('zoomadd');
let zoomRmv = document.getElementById('zoomrmv');

if(!zoomAdd.haszoomIn){
    zoomAdd.addEventListener('click', zoomIn);
    zoomAdd.haszoomIn = true;
}
if(!zoomRmv.zoomOut){
    zoomRmv.addEventListener('click', zoomOut);
    zoomRmv.haszoomOut = true;
}