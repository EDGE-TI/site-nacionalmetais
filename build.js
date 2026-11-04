const fs = require('fs');

// Se você usa o renderStrapiBlocks, precisará trazer a lógica dele para cá
// const renderStrapiBlocks = require('./caminho-para-sua-funcao.js');

async function gerarPaginas() {
    const template = fs.readFileSync('template.html', 'utf-8');
    
    // Substitua pela URL real da sua API
    const response = await fetch('https://sua-api.com/api/posts?populate=*');
    const dados = await response.json();

    dados.data.forEach(post => {
        const info = post.attributes; // ou apenas post, dependendo da versão do Strapi
        
        // Aplique a sua função de conversão de blocos aqui
        const htmlConteudo = renderStrapiBlocks(info.conteudo || info.content);
        
        // Preenche o molde
        let htmlFinal = template
            .replace(/{{TITULO}}/g, info.title || '')
            .replace(/{{RESUMO}}/g, info.resumo || '')
            .replace(/{{IMAGEM}}/g, info.imagem_capa?.url || '')
            .replace('{{CONTEUDO_HTML}}', htmlConteudo);

        // Salva o arquivo final físico
        const nomeArquivo = `${info.slug}.html`;
        fs.writeFileSync(nomeArquivo, htmlFinal);
        console.log(`Sucesso: ${nomeArquivo}`);
    });
}

gerarPaginas();