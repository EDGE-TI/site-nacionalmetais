// Elementos do DOM
const btnMobile = document.getElementById('btn-mobile');
const menuNav = document.getElementById('menu-mobile');

if (btnMobile && menuNav) {
    const iconBtn = btnMobile.querySelector('i');

    function toggleMenu() {
        // window.requestAnimationFrame agrupa as mudanças no DOM para evitar o Reflow Forçado
        window.requestAnimationFrame(() => {
            // Adiciona ou remove a classe 'aberto'
            menuNav.classList.toggle('aberto');
            
            // Troca o ícone e trava/destrava a rolagem
            if (menuNav.classList.contains('aberto')) {
                iconBtn.classList.remove('ph-list');
                iconBtn.classList.add('ph-x');
                document.body.style.overflow = 'hidden';
            } else {
                iconBtn.classList.remove('ph-x');
                iconBtn.classList.add('ph-list');
                document.body.style.overflow = '';
            }
        });
    }

    btnMobile.addEventListener('click', toggleMenu);

    const linksMobile = menuNav.querySelectorAll('a');
    linksMobile.forEach(link => {
        link.addEventListener('click', () => {
            if (menuNav.classList.contains('aberto')) {
                toggleMenu(); 
            }
        });
    });
}