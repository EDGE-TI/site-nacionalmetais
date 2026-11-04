const fs = require('fs');

// Função de conversão dos blocos do Strapi
function renderStrapiBlocks(content) {
    if (!content) return "";
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content.map(block => {
            if (block.type === 'paragraph') {
                const text = block.children.map(child => {
                    let t = child.text || "";
                    if (child.bold) t = `<strong>${t}</strong>`;
                    if (child.italic) t = `<em>${t}</em>`;
                    if (child.underline) t = `<u>${t}</u>`;
                    if (child.type === 'link') t = `<a href="${child.url}">${child.children[0].text}</a>`;
                    return t;
                }).join("");
                return `<p>${text}</p>`;
            }
            if (block.type === 'heading') {
                return `<h${block.level || 2}>${block.children.map(c => c.text).join("")}</h${block.level || 2}>`;
            }
            if (block.type === 'list') {
                const tag = block.format === 'ordered' ? 'ol' : 'ul';
                const items = block.children.map(item => `<li>${item.children.map(c => c.text).join("")}</li>`).join("");
                return `<${tag}>${items}</${tag}>`;
            }
            if (block.type === 'image') return `<img src="${block.image.url}" alt="${block.image.alternativeText || ''}">`;
            return "";
        }).join("");
    }
    return "";
}

async function gerarPaginas() {
    const template = fs.readFileSync('template.html', 'utf-8');
    
    // Utilize a URL correta do seu Strapi
    const urlAPI = 'https://nacionalmetais.com/api/posts?populate=*&pagination[limit]=1000';
    
    console.log("Buscando dados no Strapi...");
    const response = await fetch(urlAPI);

    if (!response.ok) {
        console.error(`Falha na conexão. Código de erro: ${response.status}`);
        return;
    }

    const dados = await response.json();

    if (!dados.data || dados.data.length === 0) {
        console.log("Nenhum post encontrado.");
        return;
    }

    dados.data.forEach(post => {
        const info = post.attributes || post; 
        
        // Converte o conteúdo
        const htmlConteudo = renderStrapiBlocks(info.conteudo || info.content);
        
        // Prepara a imagem e a URL completa
        let imgUrl = '';
        const midia = info.capa?.data || info.capa;
        if (midia) {
            const attrs = midia.attributes || midia;
            if (attrs.url) {
                imgUrl = attrs.url.startsWith('http') ? attrs.url : 'https://nacionalmetais.com' + attrs.url;
            }
        }
        
        // Prepara a data
        let dataFormatada = '';
        if (info.publishedAt) {
            dataFormatada = new Date(info.publishedAt).toLocaleDateString('pt-BR', { dateStyle: 'long' });
        }

        const esconderImagem = imgUrl ? '' : 'hidden';
        const tituloPost = info.title || info.titulo || '';

        // Preenche o molde
        let htmlFinal = template
            .replace(/{{TITULO}}/g, tituloPost)
            .replace(/{{RESUMO}}/g, info.resumo || '')
            .replace(/{{IMAGEM_URL}}/g, imgUrl)
            .replace(/{{ESCONDER_IMAGEM}}/g, esconderImagem)
            .replace(/{{DATA_PUBLICACAO}}/g, dataFormatada)
            .replace('{{CONTEUDO_HTML}}', htmlConteudo);

        const nomeArquivo = `${info.slug}.html`;
        fs.writeFileSync(nomeArquivo, htmlFinal);
        console.log(`Sucesso: ${nomeArquivo}`);
    });
}

gerarPaginas();