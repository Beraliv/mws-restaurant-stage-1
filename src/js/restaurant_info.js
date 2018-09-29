let restaurant;
let map;

/**
 * Initialize Google map, called from HTML
 * @returns {void}
 */
function initMap() {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: restaurant.latlng,
        scrollwheel: false
      });
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
    }
  });
};

/**
 * Get current restaurant from page URL
 * @param {function} callback - the callback of the fetching
 * @returns {void}
 */
function fetchRestaurantFromURL(callback) {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    callback('No restaurant id in URL', null);
  } else {
    DBHelper.fetchRestaurantById(id, (restaurantError, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(restaurantError);
        return;
      }
      fetchReviewsFromURL(id, reviewsError => {
        if (!reviews) {
          console.error(reviewsError);
          return;
        }
        fillRestaurantHTML();
      });
      callback(null, restaurant);
    });
  }
};

function fetchReviewsFromURL(restaurantId, callback) {
  if (self.review) {  // reviews already fetched!
    callback(null, self.reviews);
    return;
  }
  
  if (!restaurantId) {
    callback('No restaurant id in URL', null);
  } else {
    DBHelper.fetchReviewsByRestaurantId(restaurantId, (error, reviews) => {
      self.reviews = reviews;
      if (!reviews) {
        console.error(error);
        return;
      }
      callback(null, reviews);
    });
  }
}

/**
 * Create restaurant HTML and add it to the webpage
 * @param {object} restaurant - the restaurant
 * @returns {void}
 */
function fillRestaurantHTML(restaurant = self.restaurant) {
  const name = document.getElementsByClassName('restaurant__name')[0];
  name.innerHTML = restaurant.name;

  const address = document.getElementsByClassName('restaurant__address')[0];
  address.innerHTML = restaurant.address;

  const image = document.getElementsByClassName('restaurant__image')[0];
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.alt = [
    'restaurant',
    restaurant.name,
    restaurant.neighborhood
  ].join(' ').toLowerCase();

  const cuisine = document.getElementsByClassName('restaurant__cuisine')[0];
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage
 * @param {array} operatingHours - operating hours of the restaurant
 * @returns {void}
 */
function fillRestaurantHoursHTML(operatingHours = self.restaurant.operating_hours) {
  const hours = document.getElementsByClassName('restaurant__hours')[0];
  for (key in operatingHours) {
    if (operatingHours.hasOwnProperty(key)) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      day.tabIndex = 0;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      time.tabIndex = 0;
      row.appendChild(time);

      hours.appendChild(row);
    }
  }
};

/**
 * Create all reviews HTML and add them to the webpage
 * @param {array} reviews - reviews to the restaurant
 * @returns {void}
 */
function fillReviewsHTML(reviews = self.reviews) {
  const container = document.getElementsByClassName('reviews')[0];
  const title = document.createElement('h3');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementsByClassName('reviews-list')[0];
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage
 * @param {object} review - created review to the restaurant
 * @param {string} review.name - the name of the review
 * @param {number} review.createdAt - the creation date of the review
 * @param {number} review.updatedAt - the update date of the review
 * @param {number} review.rating - the rating of the review
 * @param {string} review.comments - the comments of the review
 * @returns {Element} li - the created review
 */
function createReviewHTML(review) {
  const li = document.createElement('li');
  const name = document.createElement('p');
  name.innerHTML = review.name;
  li.appendChild(name);

  const date = document.createElement('p');
  date.innerHTML = new Date(review.updatedAt || review.createdAt).toLocaleString();
  li.appendChild(date);

  const rating = document.createElement('p');
  rating.innerHTML = `Rating: ${review.rating}`;
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 * @param {object} restaurant - the restaurant
 * @returns {void}
 */
function fillBreadcrumb(restaurant = self.restaurant) {
  const breadcrumb = document.getElementsByClassName('breadcrumb')[0];
  const ol = breadcrumb.getElementsByTagName('ol')[0];
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  li.setAttribute('aria-current', 'page');
  ol.appendChild(li);
};

/**
 * Get a parameter by name from page URL
 * @param {string} name - the name of the parameter
 * @param {string} url - the url
 * @returns {string} parameter - the value of the parameter
 */
function getParameterByName(name, url) {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
