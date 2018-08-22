/**
 * Common database helper functions.
 */
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}`;
  }

  /**
   * Fetch all restaurants
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchRestaurants(callback) {
    const url = '/restaurants';

    fetch(`${DBHelper.DATABASE_URL}${url}`)
      .then(response => response.json())
      .then(restaurants => { callback(null, restaurants) })
      .catch(() => { callback(`Request failed (GET ${url})`, null) });
  }

  /**
   * Fetch a restaurant by its ID
   * @param {number} id - the if of the restaurant
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchRestaurantById(id, callback) {
    const url = `/restaurants/${id}`;

    fetch(`${DBHelper.DATABASE_URL}${url}`)
      .then(response => response.json())
      .then(restaurant => { callback(null, restaurant) })
      .catch(() => { callback(`Request failed (GET ${url})`, null) });
  }

  static fetchReviewsByRestaurantId(restaurantId, callback) {
    const url = `/reviews/?restaurant_id=${restaurantId}`;

    fetch(`${DBHelper.DATABASE_URL}${url}`)
      .then(response => response.json())
      .then(reviews => { callback(null, reviews) })
      .catch(() => { callback(`Request failed (GET ${url})`, null) });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling
   * @param {object} cuisine - the cuisine which is set by filter
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling
   * @param {object} neighborhood - the neighborhood which is set by filter
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling
   * @param {object} cuisine - the cuisine which is set by filter
   * @param {object} neighborhood - the neighborhood which is set by filter
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') { // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') { // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling
   * @param {function} callback - the callback of the fetching
   * @returns {void}
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL
   * @param {object} restaurant - the restaurant
   * @returns {string} url - url of viewed restaurant
   */
  static urlForRestaurant(restaurant) {
    return (`./restaurant.html?id=${restaurant.id}`);
  }

  /**
   * Restaurant image URL
   * @param {object} restaurant - the restaurant
   * @returns {string} imageUrl - url of the image of the restaurant
   */
  static imageUrlForRestaurant(restaurant) {
    return `/img/${restaurant.photograph || 10}.jpg`;
  }

  /**
   * Map marker for a restaurant
   * @param {object} restaurant - marked restaurant
   * @param {object} map - existing map
   * @returns {object} marker - marker on the map
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }

}
