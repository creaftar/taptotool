self.onmessage = function(e) {
    const { texto, icones } = e.data;

    if (!texto || texto.trim() === "") {
        self.postMessage(icones);
        return;
    }

    const termo = texto.toLowerCase().trim();

    const resultado = icones.filter(icone => {
        const noNome = icone.name && icone.name.toLowerCase().includes(termo);
        const naCategoria = icone.category && icone.category.toLowerCase().includes(termo);
        const naTag = icone.tags && icone.tags.some(tag => tag.toLowerCase().includes(termo));

        return noNome || naCategoria || naTag;
    });

    self.postMessage(resultado);
};