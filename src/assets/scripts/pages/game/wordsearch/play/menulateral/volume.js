/*export const somDigitar = document.getElementById('typing-sound');
export const somDeletar = document.getElementById('delete-sound');*/
export const somAcerto = document.getElementById('correct-sound');
export const somErro = document.getElementById('wrong-sound');
export const somVitoria = document.getElementById('win-sound');

const volumeSlider = document.getElementById('volume-slider');

AjustarVolume(); 

function AjustarVolume(){
    var vol = localStorage.getItem("volume");
    
    if(vol != null){
        vol = vol.replace(/"/g, ''); // Remove as aspas
        vol = parseFloat(vol);
        volumeSlider.value = vol;
        
        // Define o volume base
        somAcerto.volume = vol;
        somVitoria.volume = vol;
        
        // 🔥 REGRA: Volume do erro é o volume base - 0.3 (Garante mínimo de 0)
        somErro.volume = Math.max(0, vol - 0.3);
    }
    else{
        volumeSlider.value = 0.4;
        somAcerto.volume = 0.4;
        somVitoria.volume = 0.4;    
        
        // 🔥 REGRA: Se o padrão é 0.7, o do erro vira 0.4    
        somErro.volume = 0.1;        
    }
    
    volumeSlider.addEventListener('input', function() {
        const valorAtual = parseFloat(volumeSlider.value);

        // Atualiza o volume principal
        somAcerto.volume = valorAtual;
        somVitoria.volume = valorAtual;
    
        // 🔥 REGRA DINÂMICA: Conforme arrasta, o erro acompanha ficando 0.3 abaixo
        somErro.volume = Math.max(0, valorAtual - 0.3);
    
        localStorage.setItem('volume', JSON.stringify(valorAtual));
    });
}