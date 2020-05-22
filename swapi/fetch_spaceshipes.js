const spaceShipsUrl = 'https://swapi.dev/api/starships/';


const checkPassengers = (passengers, passengerQty) => {
  return parseFloat(passengers) > passengerQty;
};

const checkAutonomy = (consumables) => {
  let result = false;
  const arr = consumables.split(' ');
  if (arr.length > 1) {
    if (arr[1][0].match(/[wmy]/)) {
      result = true;
    } else if (arr[1][0] === 'd') {
      arr[0] >= 7 ? result = true : result = false;
    }
  }
  return result;
};


const checkMovies = async (movieUrls) => {
  let i = 0;
  while (i < movieUrls.length) {
    const value = await fetchMovie(movieUrls[i]);
    if (value) {
      return true;
      break;
    }
    i += 1;
  }
};

const fetchMovie = (movie) => {
  return fetch(movie)
      .then((response) => response.json())
      .then((data) => {
        return [1, 2, 3].includes(data['episode_id']);
      });
};


const fetchSpaceships = async (url, passengerQty) => {
  const results = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        return data['results'].map((spaceShip) => {
          const enoughSpace = checkPassengers(spaceShip['passengers'], passengerQty);
          const enoughAutonomy = checkAutonomy(spaceShip['consumables']);
          if (enoughSpace && enoughAutonomy) {
            return checkMovies(spaceShip['films']).then((goodMovies) => {
              if (goodMovies) {
                return {'name': spaceShip['name'], 'speed': spaceShip['MGLT']};
              } else {
                // return 'dont belong to good movies';
                return false;
              }
            });
          } else {
            // return 'not enough space or not enough autonomy';
            return false;
          }
        });
      });

  return Promise.all(results);
};

const fetchAll = async (url, passengerQty) => {
  const results = [];

  while (url) {
    results.push(await fetchSpaceships(url, passengerQty));
    url = await fetch(url).then((response) => response.json()).then((data) => data['next']);
  }


  cleanedResults = results.flat().filter(Boolean);

  let maxSpeed = 0;
  let fastestShip = '';
  let fastestShipId = 0;
  cleanedResults.forEach((ship, i) => {
    if (parseInt(ship['speed']) > maxSpeed) {
      maxSpeed = parseInt(ship['speed']);
      fastestShip = `${ship['name']} - (speed: ${ship['speed']} MGLT)`;
      fastestShipId = i;
    }
  });

  cleanedResults.splice(fastestShipId);


  if (!fastestShip) {
    fastestShip = `${cleanedResults[0]['name']} (unknown speed...)`;
  }

  displayResults(cleanedResults, fastestShip);
};


const displayResults = (ships, fastestShip) => {
  fastestShipDiv.innerHTML = '';
  otherResultsDiv.innerHTML = '';
  fastestShipDiv.innerHTML = `
    <p>The fastest starwars ship for your search is:</p>
    <p><span>${fastestShip}</span></p>`;

  otherResultsDiv.innerHTML = '<b>Here are other good candidates:</b>';
  ships.forEach((ship) => {
    otherResultsDiv.insertAdjacentHTML('beforeend', `<p>${ship['name']}</p>`);
  });
};


const input = document.querySelector('.qty-input');
const btn = document.querySelector('button');
const fastestShipDiv = document.querySelector('.fastest-ship');
const otherResultsDiv = document.querySelector('.other-results');

btn.addEventListener('click', (event) => {
  fetchAll(spaceShipsUrl, input.value);
});
