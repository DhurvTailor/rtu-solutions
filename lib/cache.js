// lib/cache.js
const cache = new Map();

export function getCached(key) {
  const item = cache.get(key);
  if (item && Date.now() < item.expiry) return item.data;
  return null;
}

export function setCache(key, data, ttlSeconds = 3600) {
  cache.set(key, { data, expiry: Date.now() + ttlSeconds * 1000 });
}

export function clearCache(key) {
  cache.delete(key);
}