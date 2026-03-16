export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    mounted(el, binding) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add('active');
            // Optionnel: arrêter d'observer une fois révélé
            if (!binding.modifiers.repeat) {
              observer.unobserve(el);
            }
          } else if (binding.modifiers.repeat) {
            el.classList.remove('active');
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Ajouter la classe de base si elle n'est pas déjà là
      el.classList.add('reveal');
      
      const classList = Array.from(el.classList);
      if (!classList.some((c: any) => typeof c === 'string' && c.startsWith('reveal-'))) {
        el.classList.add('reveal-up');
      }

      observer.observe(el);
      el._revealObserver = observer;
    },
    unmounted(el) {
      if (el._revealObserver) {
        el._revealObserver.disconnect();
      }
    }
  });
});
