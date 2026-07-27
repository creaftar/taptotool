import Fontmin from 'fontmin';
import fs from 'fs';
import path from 'path';

// Defina os glyphs necessários (copiados dos valores de `content` no seu CSS)
const glyphs = `
  \u200b \u002e \uf0c9 \uf002 \uf007 \uf015 \uf0fe \uf185 \uf186 \uf14a \uf044 \uf1f8 \uf2ed \u002b \uf05e \uf00d \uf105 
  \uf104 \uf58e \uf58d \uf5ad \uf0d7 \uf0d8 \uf068 \uf3e5 \ue473 \uf00c \uf0c1 \ue13c \uf1da \uf028 \uf142 \uf09e \uf08e
  \uf16d \uf08b \uf39e \ue61b \ue07b \uf544 \uf466 \uf15e \ue2ca \uf15d \uf04b \uf04c \uf2ea \uf017 \uf031 \uf1a1 \uf0ac 
  \uf1a0 \uf19e \uf120 \uf085 \ue671 \uf173 \u003f \uf49e \uf144 \uf0c8 \uf338 \uf339 \u0041 \u0061 \uf0d3 \uf15e \uf15d
  \uf34e
`;

// Caminho para os arquivos de fonte
const fonts = [
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-regular-400.ttf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-regular-400.ttf') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-solid-900.ttf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-solid-900.ttf') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-brands-400.ttf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-brands-400.ttf') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-regular-400.woff'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-regular-400.woff') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-solid-900.woff'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-solid-900.woff') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-brands-400.woff'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-brands-400.woff') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-regular-400.woff2'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-regular-400.woff2') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-solid-900.woff2'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-solid-900.woff2') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/fa-brands-400.woff2'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-brands-400.woff2') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-regular-400.ttf'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-regular-400.ttf') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-solid-900.ttf'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-solid-900.ttf') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-brands-400.ttf'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-brands-400.ttf') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-regular-400.woff'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-regular-400.woff') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-solid-900.woff'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-solid-900.woff') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-brands-400.woff'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-brands-400.woff') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-regular-400.woff2'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-regular-400.woff2') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-solid-900.woff2'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-solid-900.woff2') },
  { src: path.resolve('../dist/assets/styles/fontawesome/webfonts/fa-brands-400.woff2'), dest: path.resolve('../dist/assets/fonts/fontmin/subset-fa-brands-400.woff2') },


  /*REMOVER ESSAS TRES LINHAS ABAIXO*/
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/Font Awesome 7 Free-Regular-400.otf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-regular-400.ttf') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/Font Awesome 7 Free-Solid-900.otf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-solid-900.ttf') },
  { src: path.resolve('../public/assets/styles/fontawesome/webfonts/Font Awesome 7 Brands-Regular-400.otf'), dest: path.resolve('../public/assets/fonts/fontmin/subset-fa-brands-400.ttf') },
];

const fontminProcesses = fonts.map(({ src, dest }) => {
  const fontmin = new Fontmin()
    .src(src, { allowEmpty: true })
    .use(Fontmin.glyph({
      text: glyphs.replace(/\s+/g, ''),
    }))
    .dest(path.dirname(dest));

  return new Promise((resolve, reject) => {
    // Verificação se o arquivo de fonte existe antes de processar
    if (!fs.existsSync(src)) {
      console.error(`Arquivo de fonte não encontrado: ${src}`);
      resolve();
      return;
    }

    fontmin.run((err, files) => {
      if (err) {
        reject(err);
      } else {
        if (files && files.length > 0) {
          console.log(`Arquivo de fonte processado: ${files[0].path}`);
          fs.renameSync(files[0].path, dest);
          console.log(`Fonte otimizada salva em: ${dest}`);
        } else {
          console.error(`Nenhum arquivo gerado para a fonte: ${src}`);
        }
        resolve();
      }
    });
  });
});

Promise.all(fontminProcesses)
  .then(() => console.log('Fontes otimizadas criadas com sucesso!'))
  .catch(console.error);
