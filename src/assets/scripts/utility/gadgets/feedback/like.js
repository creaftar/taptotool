import { db } from "../../../imports/firebase.js";
import { doc, setDoc, increment } from "@firebase/firestore";

let pageName = window.location.pathname.split('/');
pageName = pageName[pageName.length - 2];

let likeEl = document.getElementById("like");
let deslikeEl = document.getElementById("deslike");

let storage = JSON.parse(localStorage.getItem("metrics")) || {};
let _liked = storage[pageName];
let pesoVoto = 0;

let timerDebounce; // Ela começa vazia

if(storage[pageName] === true) AddLike();
else if(storage[pageName] === false) AddDeslike(); 

likeEl.addEventListener('click', CountLike);
deslikeEl.addEventListener('click', CountDeslike);

function CountLike(){
    pesoVoto = 1;
    if(_liked === false){
        pesoVoto = 2;
        RemoveDeslike();
        SalvarComDelay();
    }
    else if(_liked === true){
        pesoVoto = -1;
        _liked = undefined;
        RemoveLike();
        AlterarStatusLS(_liked);
        SalvarComDelay();
        return;
    }
    AddLike();
    _liked = true;
    AlterarStatusLS(_liked);
    SalvarComDelay();
}

function CountDeslike(){
    pesoVoto = -1;
    if(_liked === true){
        pesoVoto = -2;
        RemoveLike();
        SalvarComDelay();
    }
    else if(_liked === false){
        pesoVoto = 1;
        _liked = undefined;
        RemoveDeslike();
        AlterarStatusLS(_liked);
        SalvarComDelay();
        return;
    }
    AddDeslike();
    _liked = false;
    AlterarStatusLS(_liked);
    SalvarComDelay();
}

function AddLike(){
    likeEl.innerHTML = `<i class="fa-solid fa-heart"></i>`;
}

function AddDeslike(){
    deslikeEl.innerHTML = `<i class="fa-solid fa-thumbs-down"></i>`;
}

function RemoveLike(){
    likeEl.innerHTML = `<i class="fa-regular fa-heart"></i>`;
}

function RemoveDeslike(){
    deslikeEl.innerHTML = `<i class="fa-regular fa-thumbs-down"></i>`;
}

function AlterarStatusLS(status) {
    let obj = JSON.parse(localStorage.getItem("metrics")) || {};
    obj[pageName] = status; 
    localStorage.setItem("metrics", JSON.stringify(obj));
}

function SalvarComDelay(){
    clearTimeout(timerDebounce);
    timerDebounce = setTimeout(() => {
        SalvarLike(); 
    }, 3000);
}

async function SalvarLike() {
    const docRef = doc(db, "metrics", pageName);
    await setDoc(docRef, { likes: increment(pesoVoto) }, { merge: true });
    pesoVoto = 0;
}