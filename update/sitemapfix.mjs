import fs from 'fs';
import path from 'path';

// Caminho do sitemap gerado no build estático
const sitemapPath = path.resolve('dist/sitemap-0.xml'); // ou dist/sitemap-index.xml se for o caso

if (fs.existsSync(sitemapPath)) {
  let content = fs.readFileSync(sitemapPath, 'utf8');

  // Substitui estritamente a barra da home raiz por nada nas tags <loc> e <xhtml:link>
  // O regex busca "taptotool.com/" isolado (como no final da tag) para não afetar "/de/", "/es/", etc.
  content = content.replaceAll('https://taptotool.com/"', 'https://taptotool.com"');
  content = content.replaceAll('https://taptotool.com/</loc>', 'https://taptotool.com</loc>');

  fs.writeFileSync(sitemapPath, content, 'utf8');
  console.log('✅ Sitemap corrigido com sucesso! Barra da Home removida.');
} else {
  console.log('⚠️ Arquivo de sitemap não encontrado em:', sitemapPath);
}