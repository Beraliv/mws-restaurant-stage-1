if ('serviceWorker' in navigator) {
  console.warn('Service worker: Availability ✓');
  navigator.serviceWorker.register('/js/sw.js')
    .then(
      function success(registration) {
        console.warn('Service worker: Register ✓');
        console.warn(registration.scope);
      },
      function fail(error) {
        console.warn('Service worker: Register ✗');
        console.error(error);
      }
    );
} else {
  console.error('Service worker: Availability ✗');
}
