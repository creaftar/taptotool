let buttonCadastroEl = document.getElementById('cadastrar-email');
let userMailEl = document.getElementById('user-mail');
let privacyCheckboxEl = document.querySelector('input[name="accept-privacy"]'); 

// Seleciona o label correspondente ao checkbox
let privacyLabelEl = document.querySelector('label[for="accept-privacy"]');

let enviado = false;

buttonCadastroEl.addEventListener('click', EnviarEmail);

async function EnviarEmail(){
    if (userMailEl.value.trim() !== '' && privacyCheckboxEl.checked && !enviado) {
        
        enviado = true;
        buttonCadastroEl.disabled = true;
        buttonCadastroEl.innerHTML = '<i class="fa-solid fa-check"></i>';
        buttonCadastroEl.style.backgroundColor = 'rgba(var(--padrao), 0.8)';
        
        if (privacyLabelEl) {
            privacyLabelEl.style.color = '';
        }

        try {
            const response = await fetch('https://crivras.vercel.app/api/sendmail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nomeUsuario: userMailEl.value })
            });

            if (response.ok) {
                userMailEl.value = '';
                privacyCheckboxEl.checked = false;
            }
        } 
        catch (error) {
            console.error('Algo deu errado, tente novamente mais tarde.');
        }   
    } else if (!privacyCheckboxEl.checked) {
        // 1. Altera a cor do text/label para vermelho
        if (privacyLabelEl) {
            privacyLabelEl.style.color = 'red';
            
            // 2. Centraliza o label na tela com rolagem suave
            privacyLabelEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
}