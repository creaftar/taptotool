import fs from 'node:fs/promises';
import path from 'node:path';
import { generateFonts } from '@twbs/fantasticon';

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

async function buildIcons() {
  const jsonPath = path.resolve('./public/assets/store/icons/jsons/icons.json');
  const tempSvgDir = path.resolve('temp-svgs');
  
  // Pastas de saída sob a estrutura public/taptotool/
  const cssOutputDir = path.resolve('src/assets/styles/taptotool/css');
  const fontsOutputDir = path.resolve('src/assets/styles/taptotool/webfonts');

  console.log('1. Lendo arquivo JSON de:', jsonPath);
  const rawData = await fs.readFile(jsonPath, 'utf-8');
  const iconData = JSON.parse(rawData);

  console.log(`2. Total de ícones encontrados: ${iconData.icons?.length || 0}`);

  // Limpar e criar diretórios
  await fs.rm(tempSvgDir, { recursive: true, force: true });
  await fs.mkdir(tempSvgDir, { recursive: true });
  await fs.mkdir(cssOutputDir, { recursive: true });
  await fs.mkdir(fontsOutputDir, { recursive: true });

  console.log('3. Gerando arquivos SVG na pasta temporária...');
  for (const icon of iconData.icons) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconData.viewBox}"><path d="${icon.path}" /></svg>`;
    const filePath = path.join(tempSvgDir, `${icon.id}.svg`);
    await fs.writeFile(filePath, svgContent, 'utf-8');
  }

  const filesCreated = await fs.readdir(tempSvgDir);
  console.log(`4. Arquivos SVG gravados: ${filesCreated.length}`);

  console.log('5. Iniciando gerador Fantasticon...');
  await generateFonts({
    inputDir: normalizePath(tempSvgDir),
    outputDir: normalizePath(fontsOutputDir),
    fontTypes: ['woff2'],
    assetTypes: ['css'],
    name: iconData.prefix || 'ttt',
    prefix: `${iconData.prefix || 'ttt'}`,
    pathOptions: {
      css: normalizePath(path.join(cssOutputDir, `${iconData.prefix || 'ttt'}.css`))
    },
    fontHeight: 512,
    normalize: true,
    codepoints: iconData.icons.reduce((acc, icon) => {
      acc[icon.id] = parseInt(icon.unicode, 16);
      return acc;
    }, {})
  });

  // Ajusta a URL dentro do CSS para apontar de taptotool/css/ para taptotool/webfonts/
  const cssFilePath = path.join(cssOutputDir, `${iconData.prefix || 'ttt'}.css`);
  let cssContent = await fs.readFile(cssFilePath, 'utf-8');
  cssContent = cssContent.replace(
    new RegExp(`url\\("./${iconData.prefix || 'ttt'}.woff2`, 'g'),
    `url("../webfonts/${iconData.prefix || 'ttt'}.woff2`
  );
  await fs.writeFile(cssFilePath, cssContent, 'utf-8');

  // Limpa pasta temporária
  await fs.rm(tempSvgDir, { recursive: true, force: true });
  console.log('✅ Arquivos gerados com sucesso!');
  console.log(`   - CSS: public/taptotool/css/${iconData.prefix || 'ttt'}.css`);
  console.log(`   - WOFF2: public/taptotool/webfonts/${iconData.prefix || 'ttt'}.woff2`);
}

buildIcons().catch((err) => {
  console.error('❌ Erro durante a execução:', err);
});