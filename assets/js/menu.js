document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. ABRIR E FECHAR O MENU PRINCIPAL (Hambúrguer)
    // ==========================================
    const btnMobile = document.getElementById('btn-mobile');
    const menuNav = document.getElementById('menu-mobile');

    if (btnMobile && menuNav) {
        const iconBtn = btnMobile.querySelector('i');

        function toggleMenu() {
            window.requestAnimationFrame(() => {
                menuNav.classList.toggle('aberto');
                
                if (menuNav.classList.contains('aberto')) {
                    iconBtn.classList.remove('ph-list');
                    iconBtn.classList.add('ph-x');
                    document.body.style.overflow = 'hidden'; // Trava a rolagem do site
                } else {
                    iconBtn.classList.remove('ph-x');
                    iconBtn.classList.add('ph-list');
                    document.body.style.overflow = ''; // Destrava a rolagem
                }
            });
        }

        btnMobile.addEventListener('click', toggleMenu);
    }

    // ==========================================
    // 2. ACORDEÃO DAS SUBCATEGORIAS (Mega Menu Mobile)
    // ==========================================
    const mobileSubmenus = document.querySelectorAll('.has-submenu > a');
    
    mobileSubmenus.forEach(menuItem => {
        menuItem.addEventListener('click', (evento) => {
            // Impede que o clique recarregue a página ou suba para o topo
            evento.preventDefault();
            
            const parentLi = menuItem.parentElement;
            
            window.requestAnimationFrame(() => {
                // Efeito sanfona: se clicar em um, fecha os outros
                document.querySelectorAll('.has-submenu').forEach(li => {
                    if (li !== parentLi) {
                        li.classList.remove('ativo');
                    }
                });

                // Abre ou fecha o menu que foi clicado
                parentLi.classList.toggle('ativo');
            });
        });
    });
});