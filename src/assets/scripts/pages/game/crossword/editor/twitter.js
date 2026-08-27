import { langURL } from '../ferramentas/traducao/traducao.js';

export function gerarChamadaTweet(titulo) {
    const chamada = chamadaViaLang(titulo);
    // Seleciona uma chamada aleatória do array
    return chamada; 
} 

function chamadaViaLang(titulo){
  const chamadasBR = [    
        `🧩 Confira nossa nova cruzadinha de ${titulo}! 🧩`, 
        `🧠 Desafie-se com nossa última cruzadinha de ${titulo}! 🧠`,
        `🎯 Pronto para um novo desafio? Jogue agora a ${titulo}! 🎯`,
        `📚 Venha resolver nossa cruzadinha fresquinha de ${titulo}! 📚`,
        `🔍 Nova cruzadinha disponível: ${titulo}, jogue agora! 🔍`,
        `💡 Novo desafio: ${titulo}! Tente agora nossa cruzadinha!`,
        `Essa é para os mestres das palavras! Jogue já a ${titulo}! ✍️`,
        `Está preparado para uma nova cruzadinha? Tente a ${titulo} aqui! 🌐`,
        `🏆 Hora de mostrar seu talento com palavras! Jogue agora a ${titulo}!`,
        `📚 Nova palavra-cruzada disponível: ${titulo}, clique e jogue!`,
        `🧩 Quebra-cabeça de palavras novo em folha: ${titulo}! Tente agora!`,
        `📚 Nosso mais novo quebra-cabeça de palavras está no ar: ${titulo}!`,
        `🌐 Se aventure em nossa cruzadinha mais recente: ${titulo}!`,
        `🏆 A hora do desafio chegou! Nova cruzadinha para você: ${titulo}!`,
        `Explore a nova cruzadinha: ${titulo} e divirta-se! 💡`,
        `🕹️ A diversão está garantida com nossa nova cruzadinha: ${titulo}!`,
        `📚 Um novo quebra-cabeça para você resolver: ${titulo}!`,
        `Desafie-se com esta nova palavra-cruzada: ${titulo}! 🧠`,
        `🕹️ Dê uma pausa e resolva nossa nova cruzadinha: ${titulo}!`,
        `🌟 Está na hora da diversão com nossa cruzadinha fresca: ${titulo}!`,
        `🕹️ Desafie seu cérebro com nossa cruzadinha de hoje: ${titulo}!`,
        `🌐 Novo dia, novo desafio! Tente nossa cruzadinha: ${titulo}!`,
        `📝 Desafie-se com nosso quebra-cabeça mais recente: ${titulo}!`,
        `Preparado para o desafio? Nova cruzadinha disponível: ${titulo}!`,
        `Hora de resolver nossa nova cruzadinha: ${titulo}! Jogue aqui! 🧩`,
        `🕹️ Aproveite nosso novo desafio de palavras: ${titulo}!`,
        `Vamos lá, encare nossa cruzadinha de hoje: ${titulo}! 📅`,
        `Se divirta com nossa mais nova cruzadinha: ${titulo}! 🧠`,
        `Uma nova palavra cruzada para você resolver: ${titulo}! 📚`,
        `Está na hora de uma nova cruzadinha: ${titulo}! 🌟`,
        `Nova cruzadinha no ar: ${titulo}! Jogue agora! 📅`,
        `Divirta-se resolvendo nossa nova cruzadinha: ${titulo}! 🕹️`,
        `Desafie seus amigos com nossa cruzadinha de hoje: ${titulo}! 🧠`,
        `Cruzadinha nova: ${titulo}! Está pronto para resolver? 📝`,
        `Nova cruzadinha disponível: ${titulo}! 📅`,
        `Aventure-se em nossa nova cruzadinha: ${titulo}! 🧠`,
        `Teste sua inteligência com nossa cruzadinha nova: ${titulo}! 🧠`,
        `Resolva a nova cruzadinha e divirta-se: ${titulo}! 📝`,
        `Prepare-se para a diversão com nossa cruzadinha: ${titulo}! 🧠`,
        `🧩 Confira nossa nova cruzadinha de ${titulo}! 🧩`, 
        `Desafie-se com nossa última cruzadinha de ${titulo}! 🧠`,
        `🎯 Pronto para um novo desafio? Jogue agora a ${titulo}!`,
        `📚 Venha resolver nossa cruzadinha fresquinha de ${titulo}!`,
        `🔍 Nova cruzadinha disponível: ${titulo}, jogue agora!`,
        `💡 Novo desafio: ${titulo}! Tente agora nossa cruzadinha!`,
        `Essa é para os mestres das palavras! Jogue já a ${titulo}! ✍️`,
        `Está preparado para uma nova cruzadinha? Tente a ${titulo} aqui! 🌐`,
        `🏆 Hora de mostrar seu talento com palavras! Jogue agora a ${titulo}!`,
        `Nova palavra cruzada disponível: ${titulo}, clique e jogue! 📚`,
        `Quebra-cabeça de palavras novo em folha: ${titulo}! Tente agora!`,
        `Nosso mais novo quebra-cabeça de palavras está no ar: ${titulo}!`,
        `Se aventure em nossa cruzadinha mais recente: ${titulo}! 🌐`,
        `Este desafio vai te surpreender! Jogue já a ${titulo}! ✍️`,
        `A hora do desafio chegou! Nova cruzadinha para você: ${titulo}!`,
        `Explore a nova cruzadinha: ${titulo} e divirta-se! 💡`,
        `A diversão está garantida com nossa nova cruzadinha: ${titulo}! 🕹️`,
        `Um novo quebra-cabeça para você resolver: ${titulo}! 📚`,
        `Desafie-se com esta nova palavra cruzada: ${titulo}!`,
        `Dê uma pausa e resolva nossa nova cruzadinha: ${titulo}!`,
        `Está na hora da diversão com nossa cruzadinha fresca: ${titulo}! 🌟`,
        `Desafie seu cérebro com nossa cruzadinha de hoje: ${titulo}!`,
        `Novo dia, novo desafio! Tente nossa cruzadinha: ${titulo}! 🌐`,
        `Desafie-se com nosso quebra-cabeça mais recente: ${titulo}!`,
        `Preparado para o desafio? Nova cruzadinha disponível: ${titulo}!`,
        `Hora de resolver nossa nova cruzadinha: ${titulo}! Jogue aqui!`,
        `Aproveite nosso novo desafio de palavras: ${titulo}!`,
        `Vamos lá, encare nossa cruzadinha de hoje: ${titulo}!`,
        `Se divirta com nossa mais nova cruzadinha: ${titulo}! 🕹️`,
        `Uma nova palavra-cruzada para você resolver: ${titulo}!`,
        `Está na hora de uma nova cruzadinha: ${titulo}!`,
        `Nova cruzadinha no ar: ${titulo}! Jogue agora!`,
        `Divirta-se resolvendo nossa nova cruzadinha: ${titulo}!`,
        `Desafie seus amigos com nossa cruzadinha de hoje: ${titulo}!`,
        `Cruzadinha nova: ${titulo}! Está pronto para resolver?`,
        `Nova cruzadinha disponível: ${titulo}!`,
        `Aventure-se em nossa nova cruzadinha: ${titulo}! 🧠`,
        `Teste sua inteligência com nossa cruzadinha nova: ${titulo}! 🧠`,
        `Resolva a nova cruzadinha e divirta-se: ${titulo}!`,
        `Prepare-se para a diversão com nossa cruzadinha: ${titulo}! 🕹️`,
        `Você consegue resolver a cruzadinha de ${titulo}?`, 
        `Vem se divertir com a cruzadinha de ${titulo}!`, 
        `Prepare-se para um novo desafio: ${titulo}!`, 
        `A nova cruzadinha de ${titulo} já está disponível!`, 
        `Teste suas habilidades com a cruzadinha de ${titulo}!`, 
        `Encare o desafio de ${titulo} agora mesmo!`, 
        `Já jogou a cruzadinha de ${titulo} hoje?`, 
        `É hora de resolver a ${titulo}!`, 
        `Vamos ver se você consegue completar a ${titulo}!`, 
        `A nova cruzadinha de ${titulo} espera por você!`, 
        `Cruzadinha do dia: ${titulo}! Pronto para jogar?`, 
        `Desafie-se com a cruzadinha de ${titulo}!`, 
        `Está preparado para a cruzadinha de ${titulo}?`, 
        `Vem jogar a nova cruzadinha "${titulo}" e se divertir!`, 
        `🌟 Nova cruzadinha: ${titulo}! 🌟`,
        `Desafie seu conhecimento com a ${titulo}!`, 
        `Nova palavra-cruzada: ${titulo}!`, 
        `Prepare-se para a nova cruzadinha de ${titulo}!`, 
        `Você está pronto para a ${titulo}?`, 
        `Experimente a nova cruzadinha de ${titulo}!`, 
        `Hora de jogar a cruzadinha de ${titulo}!`, 
        `Venha resolver a ${titulo} e se desafiar!`, 
        `Pronto para enfrentar a ${titulo}?`, 
  ];

  const chamadasEN = [
        `🧠 Crossword puzzle lovers, your challenge awaits: ${titulo}!`,
        `The ultimate crossword challenge is here: ${titulo}! 🕹️`,
        `A fresh crossword puzzle is here: ${titulo}! Try now!`,    
        `Let's get puzzling! New crossword available: ${titulo}! 📢`,
        `🧠 A new word puzzle just for you: ${titulo}! Click to solve!`,
        `Break time! Enjoy our latest crossword: ${titulo}! 🧩`,
        `Puzzle time! Solve our latest crossword: ${titulo}! 🧠`,
        `📝 New crossword puzzle! Click to play ${titulo} now!`,
        `🕹️ Are you ready for a new crossword puzzle? Try ${titulo}!`,
        `📅 Crossword lovers, a new puzzle awaits you: ${titulo}!`,
        `🌟 Challenge yourself with today's crossword: ${titulo}!`,
        `🧩 A new puzzle for your enjoyment: ${titulo}! Play now! 🎮`,
        `Let's see if you can crack this crossword: ${titulo}! 🧩`,
        `📢 New crossword alert! Click to play ${titulo}!`,
        `🕹️ Take a break and solve our latest crossword: ${titulo}!`,
        `📅 Today's crossword is ready for you: ${titulo}! Play here!`,
        `🌟 New day, new crossword: ${titulo}! Click and solve!`,
        `Are you the crossword master? Prove it with ${titulo} now! 🧠`,
        `🧩 Ready, set, crossword: ${titulo}! Click to start playing!`,
        `🕹️ The ultimate crossword challenge is here: ${titulo}!`,
        `Feeling smart? Try our newest crossword puzzle: ${titulo}! 🧠`,
        `🔍 Test your brain with our latest crossword: ${titulo}!`,
        `📅 Ready for the crossword of the day? Click to play ${titulo}!`,
        `📝 Crossword fans, a new puzzle is live: ${titulo}! Play now!`,
        `It's crossword time! Can you solve ${titulo}? 🧩`,
        `Ready for the crossword challenge: ${titulo}? Click here! 🧠`,
        `Can you handle this crossword challenge: ${titulo}? Click to play!`,
        `New puzzle, new challenge! Click and enjoy: ${titulo}! 📝`,
        `Let's see how fast you can solve this crossword: ${titulo}! 🧩`,
        `Test your vocabulary with our latest crossword: ${titulo}! 📝`,
        `🧩 It's puzzle time! Try our newest crossword: ${titulo}!`,
        `Crossword challenge! Can you beat ${titulo}? 📢`,
        `Ready for a brain workout? Play our crossword: ${titulo}! 💪`,
        `New puzzle alert! Click to start playing ${titulo}! 🧩`,
        `A fresh crossword puzzle is here: ${titulo}! Try now! 🧠`,
        `Test your skills with our latest crossword: ${titulo}! 📝`,
        `🕹️ Are you ready for a new crossword puzzle? Try ${titulo}!`,
        `📅 Crossword lovers, a new puzzle awaits you: ${titulo}!`,
        `🌟 Challenge yourself with today's crossword: ${titulo}!`,
        `A new puzzle for your enjoyment: ${titulo}! Play now!`,
        `Let's see if you can crack this crossword: ${titulo}! 🧩`,
        `📢 New crossword alert! Click to play ${titulo}!`,
        `Take a break and solve our latest crossword: ${titulo}! 🕹️`,
        `🧠 Crossword challenge! Can you solve ${titulo}?`,
        `Today's crossword is ready for you: ${titulo}! Play here! 🌟`,
        `New day, new crossword: ${titulo}! Click and solve! 📅`,
        `Are you the crossword master? Prove it with ${titulo} now! 🧠`,
        `Ready, set, crossword: ${titulo}! Click to start playing! 🧩`,
        `🧠 Crossword challenge! Can you solve ${titulo}?`,
        `Test your skills with our latest crossword: ${titulo}! 📝`,
        `Feeling smart? Try our newest crossword puzzle: ${titulo}! 🧠`,
        `Test your brain with our latest crossword: ${titulo}!`,
        `Ready for the crossword of the day? Click to play ${titulo}! 🧩`,
        `Crossword fans, a new puzzle is live: ${titulo}! Play now! 📝`,
        `It's crossword time! Can you solve ${titulo}?`,
        `Let's get puzzling! New crossword available: ${titulo}!`,
        `A new word puzzle just for you: ${titulo}! Click to solve!`,
        `Break time! Enjoy our latest crossword: ${titulo}! 🧩`,
        `Puzzle time! Solve our latest crossword: ${titulo}!`,
        `New crossword puzzle! Click to play ${titulo} now! 📝`,
        `Can you handle this crossword challenge: ${titulo}? Click to play! 🧠`,
        `Crossword puzzle lovers, your challenge awaits: ${titulo}!`,
        `New puzzle, new challenge! Click and enjoy: ${titulo}!`,
        `Let's see how fast you can solve this crossword: ${titulo}! 🧩`,
        `Ready for the crossword challenge: ${titulo}? Click here!`,
        `Test your vocabulary with our latest crossword: ${titulo}!`,
        `🧩 It's puzzle time! Try our newest crossword: ${titulo}!`,
        `Crossword challenge! Can you beat ${titulo}?`,
        `Ready for a brain workout? Play our crossword: ${titulo}! 💪`,
        `New puzzle alert! Click to start playing ${titulo}! 🧩`,
        `Test your skills with the crossword ${titulo}!`, 
        `Enjoy solving the crossword ${titulo}!`, 
        `Take the challenge of ${titulo}!`, 
        `Dive into the crossword ${titulo}!`, 
        `Let's see if you can solve ${titulo}!`,
        `Ready for the puzzle of ${titulo}?`, 
        `Crack the crossword ${titulo}!`, 
        `Solve ${titulo} and have fun!`
  ]
  var chamadaAleatoria; 
  if(langURL.toLowerCase() == "en-us" || langURL == "en"){
    chamadaAleatoria = chamadasEN[Math.floor(Math.random() * chamadasEN.length)];
  }
  else{
    chamadaAleatoria = chamadasBR[Math.floor(Math.random() * chamadasBR.length)];
  }
    
  return chamadaAleatoria;

}

export async function gerarLinkTweet(userid, idCruzadinha){
  if(langURL != "en"){
    return `https://creaftar.com/${langURL.toLowerCase()}/play?cr=${idCruzadinha}`
  }
  return `https://creaftar.com/play?cr=${idCruzadinha}`
}

export function gerarHashtags(titulo) {
    var tituloHashtag;
    tituloHashtag = titulo.replace(/\s+/g, '');  
    tituloHashtag = titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    tituloHashtag = titulo.replace(/[^a-zA-Z0-9]/g, '');
    
    const qtdeHashtags = [2, 3, 4]
    const randomNumber = qtdeHashtags[Math.floor(Math.random() * qtdeHashtags.length)];
        
    // Seleciona até 4 hashtags aleatórias do banco
    const hashtagsAleatorias = [];
    while (hashtagsAleatorias.length < randomNumber) {
        //const randomHashtag = bancoDeHashtags[Math.floor(Math.random() * bancoDeHashtags.length)];
        var randomHashtag = hashtagViaLang(); 
        if (!hashtagsAleatorias.includes(randomHashtag)) {
            hashtagsAleatorias.push(randomHashtag);
        }
    }

    // Adiciona o título como uma hashtag obrigatória
    hashtagsAleatorias.push(`#${tituloHashtag.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`);
    return hashtagsAleatorias.join(' ');
}

function hashtagViaLang() {
  const hashtagsBR = [
    "#palavracruzada",
    "#palavrascruzadas",
    "#cruzadinha",
    "#cruzadinhas",
    "#cruzadas",
    "#quebracabeça",
    "#raciociniológico",
    "#desafiodiário",
    "#desafiomental",
    "#testemental",
    "#palavras",
    "#desafios",
    "#desafiológico",
    "#desafio",
    "#jogos",
    "#jogosmentais",
    "#diversão",
    "#cérebro",
    "#enigma",
    "#entretenimento"
  ];

  const hashtagsEN = [
    "#mindgame",
    "#mindgames",
    "#crossword",
    "#crosswords",
    "#crosswordlover",
    "#crosswordpuzzle",
    "#crosswordsolver",
    "#puzzle",
    "#dailypuzzle",
    "#puzzleenthusiast",
    "#wordpuzzle",
    "#wordgame",
    "#fun",
    "#challenge",
    "#entertainment",
    "#play",
    "#solve",
    "#words",
    "#braintraining",
    "#brainteaser",
    "#mentalexercise"
  ];

  var hashtagAleatoria;
  if (langURL.toLowerCase() == "en-us" || langURL == "en") {
    hashtagAleatoria = hashtagsEN[Math.floor(Math.random() * hashtagsEN.length)];
  } else {
    hashtagAleatoria = hashtagsBR[Math.floor(Math.random() * hashtagsBR.length)];
  }

  // Normalizar a hashtag removendo caracteres especiais
  hashtagAleatoria = hashtagAleatoria.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  return hashtagAleatoria;
}

async function gerarCaminhoImg() {
  const baseDir = "tt";
  const extension = ".jpg";

  // Gera um número aleatório de 0 a 30 (ou qualquer faixa que desejar)
  const { qtdeFotos } = await import("../VARIAVEIS.mjs");
  const randomNum = Math.floor(Math.random() * qtdeFotos) + 1; //0 (inclusivo) a 31 (exclusivo)

  return `${baseDir}${randomNum}${extension}`;
}

export async function postarTweet(mensagem, urlCruzadinha) {
  const imageName = await gerarCaminhoImg(); // Gera o caminho da imagem no Vercel

  if (!mensagem || mensagem.trim() === '') {
    console.error('Mensagem não pode estar vazia.');
    return;
  }
  fetch('https://crivras.vercel.app/api/tweet', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mensagem, imageName, url: urlCruzadinha, langURL }),
    keepalive: true
  });
}