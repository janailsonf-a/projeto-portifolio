// ===================================
// LÓGICA PARA O SELETOR DE TEMA
// ===================================
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    // Salva a preferência do usuário
    if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
    } else {
        localStorage.setItem('theme', 'dark');
    }
}

// Verifica o tema salvo quando a página carrega
(function checkSavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
    }
})();


// ===================================
// LÓGICA PARA O MENU MOBILE
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const menuIcon = document.querySelector('.menu-icon');
    const navbar = document.querySelector('.navbar');

    if (menuIcon && navbar) {
        menuIcon.addEventListener('click', () => {
            // Alterna a classe 'active' no menu para exibi-lo ou escondê-lo
            navbar.classList.toggle('active');

            // Alterna a classe 'no-scroll' no body para travar/destravar a rolagem
            document.body.classList.toggle('no-scroll');
        });
        // Teclado: Enter ou Espaço abrem o menu (o ícone tem role="button")
        menuIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                menuIcon.click();
            }
        });
    }
});