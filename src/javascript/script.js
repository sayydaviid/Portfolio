$(document).ready(function() {
    // --- LÓGICA DO MENU MOBILE ---
    const mobileBtn = $('#mobile_btn');
    const overlay = $('#overlay');
    const centralizedMenu = $('#centralized-menu');
    const content = $('main');
    const header = $('header');

    function closeMenu() {
        if (mobileBtn.find('i').hasClass('fa-x')) {
            mobileBtn.trigger('click');
        }
    }
    mobileBtn.on('click', function() {
        const isOpening = $(this).find('i').hasClass('fa-bars');
        $(this).find('i').toggleClass('fa-bars fa-x');
        $(this).attr('aria-label', isOpening ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
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
    overlay.on('click', closeMenu);
    $('#centralized-menu a').on('click', closeMenu);
    $('#close-menu').on('click', closeMenu);

    // --- LÓGICA DA NAVEGAÇÃO PRINCIPAL ---
    const navItems = $('#nav_list .nav-item');
    const navItemsWithLinks = navItems.find('a');
    const navUnderline = $('.nav-underline');
    const sections = $('section');
    const headerHeight = $('header').outerHeight();
    let clickAction = false;
    let scrollTimeout;

    function positionUnderline(element) {
        if (element && element.length && navUnderline.length) {
            const item = element.parent();
            if (item.length && item.position()) {
                navUnderline.css({
                    'left': item.position().left + 'px',
                    'width': item.outerWidth() + 'px'
                });
            }
        }
    }
    navItemsWithLinks.on('click', function() {
        clickAction = true;
        clearTimeout(scrollTimeout);
        navItems.removeClass('active');
        $(this).parent().addClass('active');
        positionUnderline($(this));
        scrollTimeout = setTimeout(() => {
            clickAction = false;
        }, 500);
    });
    $(window).on('scroll', function() {
        if (clickAction) {
            return;
        }
        const scrollPosition = $(window).scrollTop();
        if (scrollPosition > 10) {
            $('header').css('box-shadow', '0 2px 5px rgba(0, 0, 0, 0.1)');
        } else {
            $('header').css('box-shadow', 'none');
        }
        let activeSectionIndex = 0;
        sections.each(function(i) {
            const sectionTop = $(this).offset().top - headerHeight - 40;
            const sectionBottom = sectionTop + $(this).outerHeight();
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSectionIndex = i;
                return false;
            }
        });
        const newActiveItem = $(navItems[activeSectionIndex]);
        if (!newActiveItem.hasClass('active')) {
            navItems.removeClass('active');
            newActiveItem.addClass('active');
            const activeLink = newActiveItem.find('a');
            positionUnderline(activeLink);
        }
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
    
    // --- LÓGICA DE ARRASTAR PARA ROLAR (VERSÃO FINALÍSSIMA) ---
    const slider = document.querySelector('#feedbacks');
    if (slider) {
        let isDown = false;
        let startY;
        let scrollTop;

        const handleMove = (e) => {
            if (!isDown) return;
            e.preventDefault();
            const y = e.pageY || e.touches[0].pageY;
            const walk = (y - startY) * 2;
            slider.scrollTop = scrollTop - walk;
        };

        const handleUp = () => {
            isDown = false;
            slider.classList.remove('active-drag');
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleUp);
            window.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleUp);
        };

        const handleDown = (e) => {
            isDown = true;
            slider.classList.add('active-drag');
            startY = (e.pageY || e.touches[0].pageY);
            scrollTop = slider.scrollTop;
            window.addEventListener('mousemove', handleMove);
            window.addEventListener('mouseup', handleUp);
            window.addEventListener('touchmove', handleMove);
            window.addEventListener('touchend', handleUp);
        };
        
        // --- ADIÇÃO PARA CORRIGIR O BUG DO LINK ---
        // Impede o comportamento padrão de "arrastar link" do navegador.
        const linksInsideSlider = slider.querySelectorAll('a');
        linksInsideSlider.forEach(link => {
            link.addEventListener('dragstart', (e) => {
                e.preventDefault();
            });
        });
        // --- FIM DA ADIÇÃO ---

        slider.addEventListener('mousedown', handleDown);
        slider.addEventListener('touchstart', handleDown, { passive: true });
    }

    // --- ANIMAÇÕES COM SCROLLREVEAL ---
    ScrollReveal().reveal('#cta, .dish, #testimonial_chef, .feedback', {
        origin: 'bottom',
        distance: '30px',
        duration: 1000,
        interval: 150
    });

    // --- EFEITO DE DIGITAÇÃO ---
    const title = $("#cta .title");
    if (title.length) {
        setTimeout(() => {
            title.css("border-right", "none");
        }, 4000);
    }
    
    // --- LÓGICA DE REDIMENSIONAMENTO DA JANELA ---
    $(window).on('resize', function() {
        const currentActiveLink = $('#nav_list .nav-item.active a');
        positionUnderline(currentActiveLink);
    }).trigger('resize');
});