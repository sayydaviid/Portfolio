$(document).ready(function() {
    // --- LÓGICA DO MENU MOBILE ---
    const mobileBtn = $('#mobile_btn');
    const overlay = $('#overlay');
    const centralizedMenu = $('#centralized-menu');
    const content = $('main');
    const header = $('header');

    // Função para fechar o menu (usada por cliques no overlay/links)
    function closeMenu() {
        if (mobileBtn.find('i').hasClass('fa-x')) {
            mobileBtn.trigger('click'); // Simula um clique no botão para fechar de forma consistente
        }
    }

    // Lógica principal de clique no botão do menu
    mobileBtn.on('click', function() {
        const isOpening = $(this).find('i').hasClass('fa-bars');

        // Alterna ícone e o texto de acessibilidade (aria-label)
        $(this).find('i').toggleClass('fa-bars fa-x');
        $(this).attr('aria-label', isOpening ? 'Fechar menu de navegação' : 'Abrir menu de navegação');

        // Abre ou fecha o menu com base no estado
        if (isOpening) {
            overlay.fadeIn(200);
            centralizedMenu.css('display', 'flex').fadeTo(200, 1);
            content.addClass('blur');
            header.addClass('blur');
        } else {
            centralizedMenu.fadeTo(200, 0, function() { $(this).hide(); });
            overlay.fadeOut(200);
            content.removeClass('blur');
            header.removeClass('blur');
        }
    });

    // Eventos para fechar o menu
    overlay.on('click', closeMenu);
    $('#centralized-menu a').on('click', closeMenu);
    $('#close-menu').on('click', closeMenu); // Garante que o 'X' dentro do menu também funcione

    // --- LÓGICA DE SCROLL (ROLAGEM DA PÁGINA) ---
    const sections = $('section');
    const navItems = $('.nav-item');
    const headerHeight = $('header').outerHeight();

    $(window).on('scroll', function() {
        const scrollPosition = $(window).scrollTop();

        if (scrollPosition > 10) {
            $('header').css('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)');
        } else {
            $('header').css('box-shadow', 'none');
        }

        let activeSectionIndex = 0;
        sections.each(function(i) {
            const sectionTop = $(this).offset().top - headerHeight - 20;
            const sectionBottom = sectionTop + $(this).outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });

        navItems.removeClass('active');
        $(navItems[activeSectionIndex]).addClass('active');
    });

    // --- LÓGICA DO TEMA ESCURO ---
    const themeSwitch = $('.switch');
    const body = $('body');
    const checkbox = $('#theme-switch');

    if (localStorage.getItem("darkMode") === "enabled") {
        body.addClass("dark-mode");
        checkbox.prop('checked', true);
    }

    themeSwitch.on('click', function() {
        body.toggleClass("dark-mode");
        localStorage.setItem("darkMode", body.hasClass("dark-mode") ? "enabled" : "disabled");
    });

    // --- ANIMAÇÕES COM SCROLLREVEAL ---
    ScrollReveal().reveal('#cta', {
        origin: 'left',
        duration: 1500,
        distance: '30%'
    });
    ScrollReveal().reveal('.dish', {
        origin: 'bottom',
        duration: 1000,
        distance: '30%',
        interval: 200
    });
    ScrollReveal().reveal('#testimonial_chef', {
        origin: 'left',
        duration: 1000,
        distance: '20%'
    });
    ScrollReveal().reveal('.feedback', {
        origin: 'right',
        duration: 1000,
        distance: '20%',
        interval: 200
    });

    // --- EFEITO DE DIGITAÇÃO ---
    const title = $("#cta .title");
    if (title.length) {
        setTimeout(() => {
            title.css("border-right", "none");
        }, 4000);
    }
});