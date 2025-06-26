document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DA ANIMAÇÃO DA LINHA DO TEMPO ---
  const timelineEvents = document.querySelectorAll(".timeline-event");

  // Garante que o código só rode se existirem eventos na página
  if (timelineEvents.length > 0) {
      function revealEventsOnScroll() {
          const windowHeight = window.innerHeight;

          timelineEvents.forEach((event) => {
              const eventPosition = event.getBoundingClientRect().top;

              // Adiciona a classe 'active' se o elemento estiver na área visível
              if (eventPosition < windowHeight - 100) {
                  event.classList.add("active");
              }
          });
      }

      // Adiciona o detector de scroll
      window.addEventListener("scroll", revealEventsOnScroll);

      // Chama a função uma vez no carregamento para verificar eventos já visíveis
      revealEventsOnScroll();
  }
});

// --- LÓGICA DO FADE-IN DA PÁGINA ---
// Espera o carregamento completo de todos os recursos (imagens, etc.)
window.addEventListener("load", function() {
  // Adiciona a classe 'show' ao body para ativar o efeito de fade-in do CSS
  document.body.classList.add("show");
});