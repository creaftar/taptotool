import { langURL } from "../ferramentas/traducao/traducao";

/**
 * Função para redirecionar o usuário caso a cruzadinha não exista
 */
export async function RedirecionarUsuario(){
	const serverCanonical = `https://creaftar.com/${langURL === 'en' ? '' : langURL}`;
	const xDefaultTag = document.querySelector('link[rel="alternate"][hreflang="x-default"]');

    let canonicalTag = document.querySelector('link[rel="canonical"]');

    canonicalTag.setAttribute('href', serverCanonical);

    document.querySelectorAll('link[rel="alternate"]').forEach(link => {
		const lang = link.getAttribute('hreflang');
		if (lang === 'x-default' || lang === 'en') {
			link.setAttribute('href', 'https://creaftar.com/');
		} else if (lang) {
			link.setAttribute('href', `https://creaftar.com/${lang}`);
		}
	});
	
	const meta = document.createElement('meta');
	meta.httpEquiv = "refresh";
	meta.content = `0;url=${serverCanonical}`;
	xDefaultTag.href = "https://creaftar.com/";
	document.head.appendChild(meta);
	
	window.location.replace(serverCanonical);
}