import fs from 'node:fs/promises';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { generateFonts } from '@twbs/fantasticon';

function normalizePath(p) {
  return p.replace(/\\/g, '/');
}

async function buildIcons() {
  const jsonPath = path.resolve('./public/assets/store/icons/jsons/icons.json');
  const tempSvgDir = path.resolve('temp-svgs');
  
  // Pasta base onde seus arquivos css e webfonts são salvos
  const packageDir = path.resolve('src/assets/styles/taptotool');
  const cssOutputDir = path.join(packageDir, 'css');
  const fontsOutputDir = path.join(packageDir, 'webfonts');

  console.log('1. Lendo arquivo JSON de:', jsonPath);
  const rawData = await fs.readFile(jsonPath, 'utf-8');
  const iconData = JSON.parse(rawData);

  // Limpar e criar diretórios
  await fs.rm(tempSvgDir, { recursive: true, force: true });
  await fs.mkdir(tempSvgDir, { recursive: true });
  await fs.mkdir(cssOutputDir, { recursive: true });
  await fs.mkdir(fontsOutputDir, { recursive: true });

  console.log('2. Gerando arquivos SVG na pasta temporária...');
  for (const icon of iconData.icons) {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${iconData.viewBox}"><path d="${icon.path}" /></svg>`;
    const filePath = path.join(tempSvgDir, `${icon.id}.svg`);
    await fs.writeFile(filePath, svgContent, 'utf-8');
  }

  console.log('3. Iniciando gerador Fantasticon...');
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

  // Ajusta o caminho da fonte dentro do CSS gerado
  const cssFilePath = path.join(cssOutputDir, `${iconData.prefix || 'ttt'}.css`);
  let cssContent = await fs.readFile(cssFilePath, 'utf-8');
  cssContent = cssContent.replace(
    new RegExp(`url\\("./${iconData.prefix || 'ttt'}.woff2`, 'g'),
    `url("../webfonts/${iconData.prefix || 'ttt'}.woff2`
  );
  await fs.writeFile(cssFilePath, cssContent, 'utf-8');

  // Limpa pasta temporária
  await fs.rm(tempSvgDir, { recursive: true, force: true });
  console.log('✅ Arquivos locais compilados com sucesso!');

  // --- AUTOMAÇÃO DO PACOTE NPM ---
  const pkgPath = path.join(packageDir, 'package.json');
  let currentVersion = '1.0.0';

  // Verifica se o package.json já existe em src/assets/styles/taptotool/ para incrementar a versão
  try {
    const existingPkg = JSON.parse(await fs.readFile(pkgPath, 'utf-8'));
    const versionParts = existingPkg.version.split('.').map(Number);
    
    // Só incrementa a versão se a flag --publish for informada
    if (process.argv.includes('--publish')) {
      versionParts[2] += 1;
      currentVersion = versionParts.join('.');
    } else {
      currentVersion = existingPkg.version;
    }
  } catch (e) {
    // Se o package.json ainda não existe, iniciará em 1.0.0
  }

  const npmPackageContent = {
    name: '@taptotool/icons',
    version: currentVersion,
    description: 'TapToTool Icons Library',
    author: 'jiyuu wo',
    license: 'MIT',
    main: 'css/ttt.css',
    style: 'css/ttt.css',
    files: [
      'css/',
      'webfonts/'
    ],
    publishConfig: {
      access: 'public'
    }
  };

  await fs.writeFile(pkgPath, JSON.stringify(npmPackageContent, null, 2), 'utf-8');

  // Executa a publicação no NPM apenas se a flag --publish estiver presente
  if (process.argv.includes('--publish')) {
    console.log(`🚀 Publicando versão v${currentVersion} no NPM...`);
    try {
      execSync('npm publish', { cwd: packageDir, stdio: 'inherit' });
      console.log(`✅ Publicado na CDN jsDelivr com sucesso!`);
    } catch (err) {
      console.error('❌ Erro na publicação. Certifique-se de estar logado no npm com "npm login".');
    }
  }
}

buildIcons().catch((err) => {
  console.error('❌ Erro durante a execução:', err);
});