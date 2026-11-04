const fs = require('fs');

// Se você usa o renderStrapiBlocks, precisará trazer a lógica dele para cá
// const renderStrapiBlocks = require('./caminho-para-sua-funcao.js');

async function gerarPaginas() {
    const template = fs.readFileSync('template.html', 'utf-8');
    
   const urlAPI = 'http://127.0.0.1:1337/api/posts?populate=*'; // Coloque a URL correta do seu Strapi aqui
const response = await fetch(urlAPI);

if (!response.ok) {
    console.error(`Falha na conexão. Código de erro: ${response.status}`);
    const respostaBruta = await response.text();
    console.error(`Conteúdo recebido: ${respostaBruta.substring(0, 100)}...`);
    return;
}

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