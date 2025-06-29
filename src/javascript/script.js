$(document).ready(function() {
  // --- LÓGICA DO MENU MOBILE ---
  const mobileBtn = $('#mobile_btn');
  const overlay = $('#overlay');
  const centralizedMenu = $('#centralized-menu');
  const content = $('main');
  const header = $('header');

  function openMenu() {
    overlay.fadeIn(200);
    centralizedMenu.css('display', 'flex').fadeTo(200, 1);
    content.addClass('blur');
    header.addClass('blur');
    mobileBtn.find('i').removeClass('fa-bars').addClass('fa-x');
    mobileBtn.attr('aria-label', 'Fechar menu de navegação');
  }
  function closeMenu() {
    centralizedMenu.fadeTo(200, 0, function() { $(this).hide(); });
    overlay.fadeOut(200);
    content.removeClass('blur');
    header.removeClass('blur');
    mobileBtn.find('i').removeClass('fa-x').addClass('fa-bars');
    mobileBtn.attr('aria-label', 'Abrir menu de navegação');
  }
  mobileBtn.on('click', function() {
    if ($(this).find('i').hasClass('fa-bars')) openMenu();
    else closeMenu();
  });
  $('#close-menu, #overlay, #centralized-menu a').on('click', closeMenu);

  // --- LÓGICA DA NAVEGAÇÃO PRINCIPAL ---
  const navItems = $('#nav_list .nav-item');
  const navUnderline = $('.nav-underline');
  let clickAction = false;
  function positionUnderline(el) {
    if (!el.length || !navUnderline.length) return;
    const item = el.parent();
    navUnderline.css({ left: item.position().left, width: item.outerWidth() });
  }
  $('#nav_list .nav-item a').on('click', function() {
    clickAction = true;
    navItems.removeClass('active');
    $(this).parent().addClass('active');
    positionUnderline($(this));
    setTimeout(() => clickAction = false, 800);
  });
  $(window).on('scroll', function() {
    if (clickAction) return;
    let activeIndex = 0;
    const headerH = header.outerHeight();
    $('section').each(function(i) {
      if ($(window).scrollTop() >= $(this).offset().top - headerH - 40) {
        activeIndex = i;
      }
    });
    const $new = $(navItems[activeIndex]);
    if (!$new.hasClass('active')) {
      navItems.removeClass('active');
      $new.addClass('active');
      positionUnderline($new.find('a'));
    }
  });

  // --- LÓGICA DO TEMA ESCURO ---
  const themeSwitch = $('.switch');
  if (localStorage.getItem('darkMode') === 'enabled') {
    $('body').addClass('dark-mode');
    $('#theme-switch').prop('checked', true);
  }
  themeSwitch.on('click', () => {
    $('body').toggleClass('dark-mode');
    localStorage.setItem('darkMode',
      $('body').hasClass('dark-mode') ? 'enabled' : 'disabled'
    );
  });

  // --- ANIMAÇÕES COM SCROLLREVEAL ---
  ScrollReveal().reveal('#cta, .dish, #testimonial_chef, .feedback', {
    origin: 'bottom', distance: '30px', duration: 1000, interval: 150
  });

  // --- EFEITO DE DIGITAÇÃO ---
  if (document.querySelector('#typed-text')) {
    new Typed('#typed-text', {
      strings: ['Tavares :)','Desenvolvedor','Pesquisador','Prof. de Robótica','Tavares :)'],
      typeSpeed: 70, backSpeed: 50, backDelay: 1500,
      startDelay: 500, loop: false, smartBackspace: true,
      showCursor: true, cursorChar: '|',
      onComplete: self => setTimeout(() => self.cursor.style.display = 'none', 1000)
    });
  }

  // --- REDIMENSIONAMENTO DA JANELA ---
  $(window)
    .on('resize', () => positionUnderline($('#nav_list .nav-item.active a')))
    .trigger('resize');

  // --- STACK VERTICAL DE CARDS COM SWIPE + AUTOPLAY ---
  const cardsData = [];
  $('#feedbacks .feedback-slide').each(function() {
    const $s = $(this);
    cardsData.push({
      href:   $s.find('a.feedback-link').attr('href'),
      imgSrc: $s.find('img').attr('src'),
      imgAlt: $s.find('img').attr('alt'),
      title:  $s.find('.feedback-content p').first().text(),
      desc:   $s.find('.feedback-content p').last().text()
    });
  });

  let firstIndex = 0, lastIndex = 1;
  const $viewport  = $('#feedbacks-viewport');
  const $container = $('#feedbacks');
  const cardHeight = $container.find('.feedback-slide').outerHeight();
  const gap        = parseInt($container.css('gap')) || 20;
  const threshold  = 50;
  const DURATION   = 300;
  let startY=0, deltaY=0, dragging=false, isDrag=false;
  const autoDelay = 5000, resumeDelay = 8000;
  let autoplayInterval, resumeTimeout;

  function makeSlide(d) {
    return $(`
      <div class="feedback-slide">
        <a href="${d.href}" class="feedback-link" draggable="false">
          <div class="feedback">
            <img src="${d.imgSrc}" class="sbpc" alt="${d.imgAlt}" draggable="false">
            <div class="feedback-content">
              <p>${d.title}</p><p>${d.desc}</p>
            </div>
          </div>
        </a>
      </div>
    `);
  }

  function renderInitial() {
    $container.empty()
      .append(makeSlide(cardsData[firstIndex]))
      .append(makeSlide(cardsData[lastIndex]))
      .css('transform','translateY(0)');
  }
  renderInitial();

  function slideNext() {
    const newIdx = (lastIndex + 1) % cardsData.length;
    const $new   = makeSlide(cardsData[newIdx]);
    $container.append($new);
    $container[0].offsetHeight; // force reflow
    $container.css('transform', `translateY(-${cardHeight+gap}px)`);
    setTimeout(() => {
      $container.children().first().remove();
      firstIndex = (firstIndex + 1) % cardsData.length;
      lastIndex  = newIdx;
      $container.css('transition','none').css('transform','translateY(0)');
      setTimeout(() => $container.css('transition', `transform ${DURATION}ms ease`), 20);
    }, DURATION);
  }

  function slidePrev() {
    const prevIdx = (firstIndex - 1 + cardsData.length) % cardsData.length;
    const $prev   = makeSlide(cardsData[prevIdx]);
    $container.prepend($prev)
      .css('transition','none')
      .css('transform', `translateY(-${cardHeight+gap}px)`);
    $container[0].offsetHeight;
    $container.css('transition', `transform ${DURATION}ms ease`)
      .css('transform','translateY(0)');
    setTimeout(() => {
      $container.children().last().remove();
      firstIndex = prevIdx;
      lastIndex  = (lastIndex - 1 + cardsData.length) % cardsData.length;
      $container.css('transition','none').css('transform','translateY(0)');
      setTimeout(() => $container.css('transition', `transform ${DURATION}ms ease`), 20);
    }, DURATION);
  }

  function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(slideNext, autoDelay);
  }
  startAutoplay();

  // prevent native drag and page scroll
  $viewport.find('a.feedback-link, img').on('dragstart', e => e.preventDefault());
  $viewport[0].addEventListener('touchmove', e => e.preventDefault(), { passive: false });

  $viewport.on('mousedown touchstart', e => {
    dragging = true; isDrag = false;
    clearInterval(autoplayInterval); clearTimeout(resumeTimeout);
    startY = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
  });

  $viewport.on('mousemove touchmove', e => {
    if (!dragging) return;
    const y = e.originalEvent.touches ? e.originalEvent.touches[0].pageY : e.pageY;
    deltaY = y - startY;
    if (Math.abs(deltaY) > 5) isDrag = true;
    $container.css('transform', `translateY(${deltaY}px)`);
  });

  $viewport.on('mouseup mouseleave touchend touchcancel', () => {
    if (!dragging) return;
    dragging = false;
    if (deltaY < -threshold) slideNext();
    else if (deltaY > threshold) slidePrev();
    else $container.css('transform','translateY(0)');
    deltaY = 0;
    resumeTimeout = setTimeout(startAutoplay, resumeDelay);
  });

  $viewport.on('click', 'a.feedback-link', e => {
    if (isDrag) e.preventDefault();
  });
});
