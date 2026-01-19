const btnMobile = document.getElementById('btn-mobile');
const menuNav = document.getElementById('menu-mobile');
const iconBtn = btnMobile.querySelector('i');

function toggleMenu() {
    // Adiciona ou remove a classe 'aberto'
    menuNav.classList.toggle('aberto');
    
    // Troca o ícone (Se tiver aberto vira X, se fechado vira Lista)
    if (menuNav.classList.contains('aberto')) {
        iconBtn.classList.remove('ph-list');
        iconBtn.classList.add('ph-x');
        // Trava a rolagem da página atrás do menu
        document.body.style.overflow = 'hidden';
    } else {
        iconBtn.classList.remove('ph-x');
        iconBtn.classList.add('ph-list');
        // Destrava a rolagem
        document.body.style.overflow = 'auto';
    }
}

// Ouve o clique no botão
btnMobile.addEventListener('click', toggleMenu);

// Fecha o menu se clicar em um link (para navegar)
const linksMobile = document.querySelectorAll('.menu-mobile a');
linksMobile.forEach(link => {
    link.addEventListener('click', () => {
        toggleMenu(); // Fecha o menu
    });
});