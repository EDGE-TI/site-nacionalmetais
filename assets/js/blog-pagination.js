const API_URL = 'https://nacionalmetais.com'; 

// Configurações da Paginação
const POSTS_POR_PAGINA = 9; 
let paginaAtual = 1;
let totalPaginas = 1;

async function carregarLista(pagina = 1) {
    const container = document.getElementById('lista-posts');
    const loading = document.getElementById('loading');
    const areaPaginacao = document.getElementById('paginacao');

    if (container) container.innerHTML = '';
    if (loading) loading.style.display = 'block';
    if (areaPaginacao) areaPaginacao.classList.add('hidden');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const response = await fetch(`${API_URL}/api/posts?populate=*&sort=publishedAt:desc&pagination[page]=${pagina}&pagination[pageSize]=${POSTS_POR_PAGINA}`);
        
        if (!response.ok) throw new Error('Erro na conexão com o servidor');

        const json = await response.json();
        const posts = json.data;
        
        if (json.meta && json.meta.pagination) {
            const meta = json.meta.pagination;
            paginaAtual = meta.page;
            totalPaginas = meta.pageCount;
        }

        if (loading) loading.style.display = 'none';

        if (!posts || posts.length === 0) {
            if (container) container.innerHTML = '<p class="text-center col-span-3 text-gray-500">Nenhum post encontrado.</p>';
            return;
        }

        posts.forEach(post => {
            const info = post.attributes || post;
            
            // --- MUDANÇA AQUI: Pegando o Slug ou usando o ID como fallback ---
            const linkParam = info.slug ? `slug=${info.slug}` : `id=${post.id}`;

            let imgUrl = 'https://placehold.co/600x400?text=Sem+Imagem';
            const midia = info.capa?.data || info.capa;
            if (midia) {
                const url = midia.attributes?.url || midia.url;
                if (url) imgUrl = API_URL + url;
            }

            const data = new Date(info.publishedAt).toLocaleDateString('pt-BR');
            
            let resumo = 'Clique para ler mais.';
            if (info.resumo) resumo = info.resumo;
            else if (info.conteudo && Array.isArray(info.conteudo)) {
                const p = info.conteudo.find(b => b.type === 'paragraph');
                if (p && p.children) resumo = p.children.map(c=>c.text).join("").substring(0, 100) + "...";
            } else if (typeof info.conteudo === 'string') {
                resumo = info.conteudo.substring(0, 100).replace(/<[^>]*>?/gm, '') + '...';
            }

            // --- LINKS ATUALIZADOS PARA USAR O SLUG ---
            const html = `
                <div class="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col h-full border border-gray-100">
                    <a href="post.html?${linkParam}" class="h-48 overflow-hidden block group">
                        <img src="${imgUrl}" alt="${info.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500">
                    </a>
                    <div class="p-6 flex flex-col flex-grow">
                        <span class="text-xs font-semibold text-vinho-700 mb-2 block">${data}</span>
                        
                        <h2 class="text-xl font-bold text-gray-900 mb-3 leading-tight">
                            <a href="post.html?${linkParam}" class="hover:text-vinho-900 transition">
                                ${info.title || info.titulo}
                            </a>
                        </h2>
                        <p class="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">${resumo}</p>
                        
                        <a href="post.html?${linkParam}" class="mt-auto inline-flex items-center text-vinho-900 font-bold hover:underline">
                            Ler notícia completa <span class="ml-1">&rarr;</span>
                        </a>
                    </div>
                </div>
            `;
            if (container) container.innerHTML += html;
        });

        atualizarControlesPaginacao();

    } catch (e) {
        console.error(e);
        if (loading) loading.innerHTML = '<p class="text-red-500">Erro ao carregar lista de posts.</p>';
    }
}

function atualizarControlesPaginacao() {
    const areaPaginacao = document.getElementById('paginacao');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const infoPagina = document.getElementById('info-pagina');

    if (!areaPaginacao) return;

    if (totalPaginas > 1) {
        areaPaginacao.classList.remove('hidden');
        areaPaginacao.classList.add('flex');
        
        if (infoPagina) infoPagina.innerText = `Página ${paginaAtual} de ${totalPaginas}`;
        if (btnPrev) btnPrev.disabled = paginaAtual === 1;
        if (btnNext) btnNext.disabled = paginaAtual >= totalPaginas;
    } else {
        areaPaginacao.classList.add('hidden');
        areaPaginacao.classList.remove('flex');
    }
}

function mudarPagina(direcao) {
    const novaPagina = paginaAtual + direcao;
    if (novaPagina >= 1 && novaPagina <= totalPaginas) {
        carregarLista(novaPagina);
    }
}

document.addEventListener('DOMContentLoaded', () => carregarLista(1));