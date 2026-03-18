export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', {
    // Sur le serveur, on ne fait rien pour les animations
    getSSRProps() {
      return {};
    }
  });
});
