import { FecharCompartilhamento } from "./share";
let gadgetPositionerEl = document.getElementById("gadget-positioner");
let traducao = JSON.parse(gadgetPositionerEl.dataset.i18n);

let commentaryEl = document.getElementById("commentary");
let sendCommentEl = document.getElementById("sendComment");
let formCommmentEl = document.getElementById("formCommment");
let emailCommentEl = document.getElementById("emailComment");
let commentAreaEl = document.getElementById("commentArea");
let iconCommentaryEl = document.getElementById("iconCommentary");


let comentarioAberto = false;
commentaryEl.addEventListener('click', (e) => AbrirComentario(e));
formCommmentEl.addEventListener('click', (e) => {
    e.stopPropagation();
})
sendCommentEl.addEventListener('click', (e) =>{
    e.preventDefault();
    EnviarComentario(emailCommentEl, commentAreaEl);
});

function CliqueFora(e) {
    // Se o clique não foi no formulário e nem no ícone de abrir
    if (!formCommmentEl.contains(e.target) && !commentaryEl.contains(e.target)) {
        FecharComentario();
    }
}

function AbrirComentario(e){
    e.stopPropagation();
    if(!comentarioAberto){
        iconCommentaryEl.innerHTML = `<i class="fa-solid fa-message"></i>`;
        comentarioAberto = true;
        formCommmentEl.style.display = "block";
        formCommmentEl.style.opacity = "1";
        window.addEventListener('click', CliqueFora);
        FecharCompartilhamento();
    }
    else{
        FecharComentario();
    }
}

export function FecharComentario() {
    iconCommentaryEl.innerHTML = `<i class="fa-regular fa-message"></i>`;
    formCommmentEl.style.display = "none";
    formCommmentEl.style.opacity = "0";
    comentarioAberto = false;
    window.removeEventListener('click', CliqueFora);
}

/**
 * Envia o comentário ao banco de dados, esperando o nome do usuário (podendo ser nulo) e um comentário obrigatório
 * - Ambos em forma de input ou textArea
 * @param {string} user 
 * @param {string} comment 
 */
async function EnviarComentario(user, comment){
    if(comment !== '')
        {
            try {
                const response = await fetch('https://crivras.vercel.app/api/sendcommentary', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nomeUsuario: user.value, comentario: comment.value })
            });
            
            if (response.ok) {
                ExibirFeedback(true);
                user.value = '';
                comment.value = '';
            }
        } 
        catch (error) {
            ExibirFeedback(false)
        }   
    }
    FecharComentario();
}


let containerFeedbackCommentEl = document.getElementById("containerFeedbackComment");

function ExibirFeedback(success){
    let iconEl = document.getElementById("iconFeedback");
    let mensagemSucesso = document.getElementById("msgFeedback");
    
    if(success){
        iconEl.innerHTML = `<i class="fa-solid fa-check"></i>`;
        iconEl.style.color = "green";
        mensagemSucesso.textContent = traducao.success_message;
    }
    else{
        iconEl.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
        iconEl.style.color = "red";
        mensagemSucesso.textContent = traducao.error_message;
    }

    containerFeedbackCommentEl.style.display = "flex";
    containerFeedbackCommentEl.style.opacity = "1";

    containerFeedbackCommentEl.addEventListener("click", FecharFeedback);
    window.addEventListener('click', CliqueForaFeedback);
    setTimeout(() =>{FecharFeedback()}, 3000);
}

function FecharFeedback(){
    containerFeedbackCommentEl.style.display = "none";
    containerFeedbackCommentEl.style.opacity = "0";
    window.removeEventListener('click', CliqueForaFeedback);
}

function CliqueForaFeedback(e) {
    if (!containerFeedbackCommentEl.contains(e.target) && !commentaryEl.contains(e.target)) {
        FecharFeedback();
    }
}