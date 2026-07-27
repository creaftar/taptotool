/*fetch(`https://www.bing.com/indexnow?url=https://taptotool.com/sitemap-index.xml&key=fd8f64d204674a1ea2a4df981281f642`)
  .then(() => console.log("Bing notificado!"))
  .catch(e => console.error("Erro ao avisar o Bing", e));*/

import fs from 'fs';
import path from 'path';

// --- CONFIGURAÇÕES ---
const CONFIG = {
  host: "taptotool.com",
  key: "fd8f64d204674a1ea2a4df981281f642", // Coloque sua chave real aqui
  sitemapPath: "./dist/sitemap-0.xml", // Caminho padrão do Astro
  testMode: false // mude para 'false' quando quiser enviar de verdade
};

async function run() {
  console.log(`🚀 Iniciando script IndexNow (Modo de Teste: ${CONFIG.testMode})`);

  // 1. Verificar se o sitemap existe
  if (!fs.existsSync(CONFIG.sitemapPath)) {
    console.error("❌ Erro: Arquivo sitemap não encontrado em " + CONFIG.sitemapPath);
    console.log("Dica: Rode 'npm run build' primeiro para gerar a pasta dist.");
    return;
  }

  // 2. Ler e extrair URLs do sitemap
  const sitemapContent = fs.readFileSync(CONFIG.sitemapPath, 'utf8');
  const urls = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

  if (urls.length === 0) {
    console.warn("⚠️ Nenhuma URL encontrada no sitemap.");
    return;
  }

  console.log(`🔗 Encontradas ${urls.length} URLs para indexação.`);

  // 3. Preparar o corpo da requisição
  const data = {
    host: CONFIG.host,
    key: CONFIG.key,
    keyLocation: `https://${CONFIG.host}/${CONFIG.key}.txt`,
    urlList: urls
  };

  if (CONFIG.testMode) {
    console.log("--- MODO DE TESTE ATIVO ---");
    console.log("Dados que seriam enviados:");
    console.log(JSON.stringify(data, null, 2));
    console.log("---------------------------");
    console.log("✅ Teste concluído com sucesso. Para enviar ao Bing, mude 'testMode' para false.");
  } else {
    // 4. Enviar de verdade
    try {
      const response = await fetch('https://www.bing.com/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log(`✅ Sucesso! ${urls.length} URLs enviadas ao Bing.`);
      } else {
        const errorText = await response.text();
        console.error(`❌ Erro na API (Status ${response.status}):`, errorText);
      }
    } catch (err) {
      console.error("❌ Erro ao fazer o fetch:", err);
    }
  }
}

run();