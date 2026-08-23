import Fontmin from 'fontmin';
import path from 'path';
import fs from 'fs';
import ttf2woff2 from 'ttf2woff2';

// Defina os glyphs necessários (copiados dos valores de `content` no seu CSS)
const glyphs = `
  \u200b \u002e \uf0c9 \uf002 \uf007 \uf015 \uf0fe \uf185 \uf186 \uf14a \uf044 \uf1f8 \uf2ed \u002b \uf05e \uf00d \uf105 
  \uf104 \uf58e \uf58d \uf5ad \uf0d7 \uf0d8 \uf068 \uf3e5 \ue473 \uf00c \uf0c1 \ue13c \uf1da \uf028 \uf142 \uf09e \uf08e
  \uf16d \uf08b \uf39e \ue61b \ue07b \uf544 \uf466 \uf15e \ue2ca \uf15d \uf04b \uf04c \uf2ea \uf017 \uf031 \uf1a1 \uf0ac 
  \uf1a0 \uf19e \uf120 \uf085 \ue671 \uf173 \u003f \uf49e \uf144 \uf0c8 \uf338 \uf339 \u0041 \u0061 \uf0d3 \uf15e \uf15d
  \uf34e \uf281 \uf232 \uf3bf \uf148 \uf0a6 \uf61f \uf019 \uf002 \uf060 \uf053 \uf054 \uf129
`;
const rootPath = path.resolve('./'); 
const srcPath = path.join(rootPath, 'src/assets/styles/fontawesome/webfonts/');
const destPath = path.join(rootPath, 'src/assets/fonts/fontmin/');

const fontFiles = [
  'fa-regular-400.ttf',
  'fa-solid-900.ttf',
  'fa-brands-400.ttf'
];

async function processFonts() {
  console.log(`📂 Pasta de origem: ${srcPath}`);
  console.log(`📂 Pasta de destino: ${destPath}\n`);

  if (!fs.existsSync(srcPath)) {
    console.error("❌ ERRO: A pasta de origem não existe! Verifique o caminho.");
    return;
  }

  if (fs.existsSync(destPath)) {
    fs.rmSync(destPath, { recursive: true, force: true });
  }
  fs.mkdirSync(destPath, { recursive: true });

  for (const fileName of fontFiles) {
    const fullSrc = path.join(srcPath, fileName);
    
    if (!fs.existsSync(fullSrc)) {
      console.warn(`⚠️  Arquivo não encontrado, pulando: ${fileName}`);
      continue;
    }

    console.log(`✂️  Cortando ícones de: ${fileName}...`);

    const fontmin = new Fontmin()
      .src(fullSrc)
      .use(Fontmin.glyph({ text: glyphs.replace(/\s+/g, '') }))
      .use(Fontmin.ttf2woff())
      .dest(destPath);

    await new Promise((resolve) => {
      fontmin.run((err, files) => {
        if (err) {
          console.error(`❌ Erro no Fontmin para ${fileName}:`, err);
          return resolve();
        }

        if (files.length === 0) {
          console.error(`❌ Nenhum arquivo gerado para ${fileName}. Algo deu errado no processamento.`);
        }

        files.forEach(file => {
          const ext = path.extname(file.path);
          const baseName = path.basename(file.path, ext);
          const finalName = `subset-${baseName}${ext}`;
          const finalPath = path.join(destPath, finalName);

          fs.writeFileSync(finalPath, file.contents);
          console.log(`   ✅ Gerado: ${finalName} (${(file.contents.length / 1024).toFixed(2)} KB)`);

          if (ext === '.ttf') {
            console.log(`   ⚡ Convertendo para WOFF2...`);
            const woff2Buffer = ttf2woff2(file.contents);
            const woff2Path = path.join(destPath, `subset-${baseName}.woff2`);
            fs.writeFileSync(woff2Path, woff2Buffer);
            console.log(`   🚀 Sucesso: subset-${baseName}.woff2 (${(woff2Buffer.length / 1024).toFixed(2)} KB)`);
          }
        });
        resolve();
      });
    });
  }
  console.log('\n--- TUDO PRONTO! ---');
}

processFonts();