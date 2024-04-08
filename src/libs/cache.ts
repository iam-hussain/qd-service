import flatCache from 'flat-cache';
// loads the cache, if one does not exists for the given
// Id a new one will be prepared to be created
const cache = flatCache.load('cacheId');
cache.setKey('key', { foo: 'var' });

// get a key from the cache
cache.getKey('key'); // { foo: 'var' }

// fetch the entire persisted object
cache.all(); // { 'key': { foo: 'var' } }
