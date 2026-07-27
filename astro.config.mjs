import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://taptotool.com', 
  trailingSlash: 'always',
  prefetch: false,
  output: 'static',
  i18n: {
    defaultLocale: 'en',
    locales: [
      'en', 
      'pt', 
      'es', 
      'fr', 
      'it', 
      'de',
      'id',
      'hi',
      'ru'
    ], // 1. ADICIONE AS NOVAS SIGLAS AQUI
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
          en: 'en',
          pt: 'pt',
          es: 'es',
          fr: 'fr',
          it: 'it',
          de: 'de',
          id: 'id',
          hi: 'hi',
          ru: 'ru'
        },
      },
      serialize(item) {
        item.lastmod = new Date().toISOString().split('T')[0];
        item.links = item.links || [];

        // 1. TRAVA: Só adicionamos o x-default se ele já não estiver na lista
        const jáTemXDefault = item.links.some(
          link => link.hreflang && link.hreflang.toLowerCase() === 'x-default'
        );

        if (!jáTemXDefault) {
          // 2. Procura se já existe um link com hreflang "en-us"
          const defaultLink = item.links.find(
            link => link.hreflang && link.hreflang.toLowerCase() === 'en-us'
          );

          if (defaultLink) {
            // Se achou o en-us, clona a URL dele para o x-default
            item.links.push({
              hreflang: 'x-default',
              url: defaultLink.url
            });
          } else {
            // 3. Fallback: Se o "en-us" ainda não estiver no loop, removemos a subpasta manualmente
            const urlObj = new URL(item.url);
            const cleanPath = urlObj.pathname.replace(/^\/(?:en-us|en-gb|en-au|en-sg|en-ph|pt-br|es-mx|es-es|ko-kr|ja-jp|tr-tr|vi-vn|de-de|fr-fr|it-it|pl-pl|el-gr|ro-ro|hu-hu|cs-cz|ru-ru|th-th|zh-tw|ar-ae)\//, '/');
            const defaultUrl = `${urlObj.origin}${cleanPath}`;

            item.links.push({
              hreflang: 'x-default',
              url: defaultUrl
            });
          }
        }

        return item;
      }
    }),
  ],

  vite: {
    optimizeDeps: {
      include: ['axobject-query', 'aria-query'],
    },
    css: {
      devSourcemap: true,
    },
    server: {
      host: true, // Isso expõe o servidor para a rede local
      port: 4321,
      fs: {
        allow: ['..']
      }
    }
  },
});