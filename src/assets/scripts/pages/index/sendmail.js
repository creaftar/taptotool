let buttonCadastroEl = document.getElementById('cadastrar-email');
let userMailEl = document.getElementById('user-mail');
let enviado = false;

buttonCadastroEl.addEventListener('click', EnviarEmail);

async function EnviarEmail(){
    if(userMailEl.value !== '' && !enviado)
    {
        enviado = true;
        buttonCadastroEl.innerHTML = '<i class="fa-solid fa-envelope-open"></i> enviado!';
        buttonCadastroEl.style.border = 'solid 1px rgba(var(--padrao), var(--opacidade-fraca))';
        buttonCadastroEl.style.backgroundColor = 'var(--fundo-body)';
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
            }
        } 
        catch (error) {
            console.error('Algo deu errado, tente novamente mais tarde.');
        }   
    }
}