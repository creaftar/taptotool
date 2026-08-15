import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const supportedLanguages = ['en', 'pt', 'es', 'fr', 'it', 'de', 'id', 'hi', 'ru'];

export default defineConfig({
  site: 'https://taptotool.com', 
  trailingSlash: 'always',
  prefetch: false,
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: supportedLanguages,
    routing: {
      prefixDefaultLocale: false, 
    },
  },
  build: {
    format: 'directory',
    inlineStylesheets: 'always'
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en', pt: 'pt', es: 'es', fr: 'fr',
          it: 'it', de: 'de', id: 'id', hi: 'hi', ru: 'ru'
        },
      },
      serialize(item) {
        item.lastmod = new Date().toISOString().split('T')[0];

        // Função auxiliar para remover a barra APENAS da home principal
        const fixRootUrl = (urlStr) => {
          if (urlStr === 'https://taptotool.com/') {
            return 'https://taptotool.com';
          }
          return urlStr;
        };

        // 1. Aplica na tag <loc>
        item.url = fixRootUrl(item.url);

        // 2. Trata os links alternativos (hreflang)
        if (item.links) {
          // Ajusta as URLs existentes
          item.links = item.links.map(link => ({
            ...link,
            url: fixRootUrl(link.url)
          }));

          // Procura o link do idioma padrão ('en')
          const defaultLink = item.links.find(l => l.lang === 'en');

          // Se encontrar e ainda não existir x-default, adiciona ele no array!
          if (defaultLink && !item.links.some(l => l.lang === 'x-default')) {
            item.links.push({
              lang: 'x-default',
              url: defaultLink.url
            });
          }
        }

        return item;
      }
    })
  ],

  vite: {
    optimizeDeps: {
      include: ['axobject-query', 'aria-query'],
    },
    css: {
      devSourcemap: true,
    },
    server: {
      host: true,
      port: 4321,
      fs: {
        allow: ['..']
      }
    }
  },
});