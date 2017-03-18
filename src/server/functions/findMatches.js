export default function findMatches(wordToMatch, cities) {
  return cities.filter(place => {
    const regex = new RegExp(wordToMatch, 'gi');
    return place.City.match(regex);
  });
}
