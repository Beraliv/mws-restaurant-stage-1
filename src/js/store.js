const store = {
  db: null,

  init: function() {
    if (store.db) {
      return Promise.resolve(store.db);
    }
    return idb.open('messages', 1, upgradeDb => {
      upgradeDb.createObjectStore('outbox', { autoIncrement: true, keyPath: 'id' });
    }).then(db => {
      return store.db = db;
    });
  },

  outbox: function(mode) {
    return store
      .init()
      .then(
        db => 
          db
            .transaction('outbox', mode)
            .objectStore('outbox')
      )
  }
}