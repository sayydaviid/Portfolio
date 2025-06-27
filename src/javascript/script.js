$(document).ready(function() {
    // Funções que podem rodar assim que o HTML estiver pronto
    
    // --- LÓGICA DO MENU MOBILE ---
    const mobileBtn = $('#mobile_btn');
    const overlay = $('#overlay');
    const centralizedMenu = $('#centralized-menu');
    $('#close-menu, #overlay, #centralized-menu a').on('click', () => mobileBtn.trigger('click'));
    mobileBtn.on('click', function() {
        const isOpening = $(this).find('i').hasClass('fa-bars');
        $(this).find('i').toggleClass('fa-bars fa-x');
        $(this).attr('aria-label', isOpening ? 'Fechar menu' : 'Abrir menu');
        $('main, header').toggleClass('blur');
        overlay.fadeToggle(200);
        centralizedMenu.fadeToggle(200);
    });

    // --- LÓGICA DA NAVEGAÇÃO PRINCIPAL ---
    const navItems = $('#nav_list .nav-item');
    const navUnderline = $('.nav-underline');
    let clickAction = false, scrollTimeout;
    function positionUnderline(element) {
        if (element.length && navUnderline.length) {
            const item = element.parent();
            if (item.length && item.position()) {
                navUnderline.css({ left: item.position().left, width: item.outerWidth() });
            }
        }
    }
    $('#nav_list .nav-item a').on('click', function() {
        clickAction = true;
        clearTimeout(scrollTimeout);
        navItems.removeClass('active');
        $(this).parent().addClass('active');
        positionUnderline($(this));
        setTimeout(() => { clickAction = false; }, 800);
    });
    $(window).on('scroll', function() {
        if (clickAction) return;
        let activeSectionIndex = 0;
        $('section').each(function(i) {
            if ($(window).scrollTop() >= $(this).offset().top - $('header').outerHeight() - 40) {
                activeSectionIndex = i;
            }
        });
        const newActiveItem = $(navItems[activeSectionIndex]);
        if (!newActiveItem.hasClass('active')) {
            navItems.removeClass('active');
            newActiveItem.addClass('active');
            positionUnderline(newActiveItem.find('a'));
        }
    });

    // --- LÓGICA DO TEMA ESCURO ---
    const themeSwitch = $('.switch');
    if (localStorage.getItem("darkMode") === "enabled") {
        $('body').addClass("dark-mode");
        $('#theme-switch').prop('checked', true);
    }
    themeSwitch.on('click', () => {
        $('body').toggleClass("dark-mode");
        localStorage.setItem("darkMode", $('body').hasClass("dark-mode") ? "enabled" : "disabled");
    });

    // --- ANIMAÇÕES COM SCROLLREVEAL ---
    ScrollReveal().reveal('#cta, .dish, #testimonial_chef, .feedback', {
        origin: 'bottom', distance: '30px', duration: 1000, interval: 150
    });

    // --- EFEITO DE DIGITAÇÃO ---
    if (document.querySelector('#typed-text')) {
        const options = {
            strings: ['Tavares :)', 'Desenvolvedor', 'Pesquisador', 'Prof. de Robótica', 'Tavares :)'],
            typeSpeed: 70,
            backSpeed: 50,
            backDelay: 1500,
            startDelay: 500,
            loop: false, 
            smartBackspace: true,
            showCursor: true,
            cursorChar: '|',
            onComplete: function(self) {
                setTimeout(function() {
                    self.cursor.style.display = 'none';
                }, 1000);
            }
        };
        const typed = new Typed('#typed-text', options);
    }
    
    // --- LÓGICA DE REDIMENSIONAMENTO DA JANELA ---
    $(window).on('resize', () => positionUnderline($('#nav_list .nav-item.active a'))).trigger('resize');
});


// --- LÓGICA DO CARROSSEL (EXECUTADA SÓ APÓS O CARREGAMENTO TOTAL DA PÁGINA) ---
window.addEventListener('load', function() {
    const slider = document.querySelector('#feedbacks');
    if (slider) {
        const slideCount = slider.children.length;

        const sliderInstance = tns({
            container: '#feedbacks',
            axis: 'vertical',
            items: 2,
            slideBy: 'page',
            mouseDrag: true,
            loop: false,
            controls: false,
            nav: false,
            swipeAngle: false,
            // A biblioteca desativa automaticamente se não houver itens suficientes
        });

        const linksInsideSlider = slider.querySelectorAll('.feedback-link');
        linksInsideSlider.forEach(link => {
            link.addEventListener('dragstart', (e) => e.preventDefault());
        });
    }
});