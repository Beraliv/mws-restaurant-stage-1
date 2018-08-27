const startCacheName = 'restaurant-review-';
const staticCacheName = 'restaurant-review-static-cache';
const imagesCachesName = 'restaurant-review-images-cache';
const allCaches = [
  staticCacheName,
  imagesCachesName
];
const filesToCache = [
  // icon
  'img/icon.ico',
  'img/icon-128.png',
  'img/icon-144.png',
  'img/icon-256.png',
  'img/icon-512.png',
  // html
  'index.html',
  'restaurant.html',
  // css
  'css/responsive.css',
  'css/styles.css',
  // js
  'js/dbhelper.js',
  'js/idb.js',
  'js/main.js',
  'js/store.js',
];

const isNotInCache = cacheName =>
  cacheName.startsWith(startCacheName) && !allCaches.includes(cacheName);

const saveLocally = ({ name, rating, comments }) => {
  const root = document.querySelector('ul.reviews-list');

  const review = createReviewHTML({
    name,
    createdAt: new Date().getTime(),
    rating,
    comments
  });

  root.appendChild(review);
}

function registerHook() {
  self.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
      console.warn('Service worker: Availability ✓');
      navigator.serviceWorker.register('/sw.js')
        .then(registration => {
          console.warn('Service worker: Register ✓');
          console.warn(registration.scope);

          if ('sync' in registration) {
            const form = document.querySelector('#add-review-form');

            if (form !== null) {
              const username = form.querySelector('input[name=\'name\']');
              const id = form.querySelector('input[name=\'restaurant_id\']');
              const rating = form.querySelector('#rating');
              const comments = form.querySelector('textarea[name=\'comments\']');

              form.addEventListener('submit', event => {
                event.preventDefault();

                const form = {
                  name: username.value,
                  restaurant_id: Number(id.value),
                  rating: rating.value,
                  comments: comments.value
                };

                const clearForm = () => {
                  username.value = '';
                  id.value = '';
                  rating.value = '5';
                  comments.value = '';
                }

                const tryLater = () => {
                  store.outbox('readwrite')
                    .then(outbox => outbox.put(form))
                    .then(() => {
                      clearForm();
                      return registration.sync.register('outbox');
                    }).catch(error => {
                      console.log('IndexedDB: Save comment ✗', error);
                      form.submit();
                    });
                }

                saveLocally(form);
                if (navigator.onLine) {
                  clearForm();
                  postReview(form)
                    .catch(tryLater);
                } else {
                  tryLater();
                }
              });
            }
          }
        })
        .catch(error => {
          console.warn('Service worker: Register ✗');
          console.error(error);
        });
    } else {
      console.error('Service worker: Availability ✗');
    }
  });
}

function installHook() {
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(staticCacheName).then(cache => cache.addAll(filesToCache))
    );
  });
}

function activateHook() {
  self.addEventListener('activate', event => {
    console.warn('Service worker: Activating... ✓');
    event.waitUntil(
      caches.keys().then(cacheNames => Promise.all(
        cacheNames.filter(isNotInCache).map(cacheName => caches.delete(cacheName))
      ))
    );
  });
}

function getOrFetchImage(request) {
  const url = request.url;

  return caches.open(imagesCachesName).then(cache => {
    return cache.match(url).then(response => {
      return response || fetch(request).then(networkResponse => {
        cache.put(url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}

function fetchHook() {
  self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    if (url.origin === location.origin) {
      if (url.pathname === '/') {
        console.warn('Service worker: Fetching homepage ✓', event.request.url);
        event.respondWith(caches.match('index.html'));
        return;
      }
      if (url.pathname.startsWith('/img/')) {
        console.warn('Service worker: Fetching image ✓', event.request.url);
        event.respondWith(getOrFetchImage(event.request));
        return;
      }
    }

    event.respondWith(
      caches.match(event.request).then(response =>
        response || fetch(event.request)
      )
    );
  });
}

function messageHook() {
  self.addEventListener('message', event => {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });
}

function postReview(body) {
  return fetch('http://localhost:1337/reviews/', {
    method: 'POST',
    body: JSON.stringify(body)
  });
}

function syncHook() {
  const uploadReviews = () => {
    store.outbox('readonly')
        .then(outbox => outbox.getAll())
        .then(comments => Promise.all(
          comments.map(comment => {
            return postReview(comment)
              .then(response => response.json())
              .then(data => {
                if (data.result === 'success') {
                  return store.outbox('readwrite')
                    .then(outbox => outbox.delete(comment.id))
                }
                return Promise.resolve()
              })
          })
        ));
  };

  self.addEventListener('sync', uploadReviews);
  self.addEventListener('online', uploadReviews);
}

function app() {
  registerHook();
  installHook();
  activateHook();
  fetchHook();
  messageHook();
  syncHook();
}

app();
