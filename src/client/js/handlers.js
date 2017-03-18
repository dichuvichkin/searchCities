import 'isomorphic-fetch';

export const changeInnerHTML = (items, text) => {
  const arr = items;
  if (!arr.length) return (arr.innerHTML = text || []);
  items.map(item => {
    const n = item;
    return (n.innerHTML = text || []);
  });
  return false;
};

export const fetchCities = (endpoint, valueToSend, quantity) => fetch(endpoint, {
  method: 'post',
  headers: {
    'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
  body: `word=${valueToSend}&count=${quantity}`,
});
