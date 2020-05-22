const fetchData = (url) => {
  return fetch(url).then((response) => response.json());
};

const checkPassengers = (passengers, passengerQty) => {
  return parseFloat(passengers) > passengerQty;
};

const checkAutonomy = (consumables) => {
  let result = false;
  const autonomy = consumables.split(' ');
  if (autonomy.length > 1) {
    if (autonomy[1][0].match(/[wmy]/)) {
      result = true;
    } else if (autonomy[1][0] === 'd') {
      autonomy[0] >= 7 ? result = true : result = false;
    }
  }
  return result;
};

const checkMovies = async (movieUrls) => {
  let i = 0;
  while (i < movieUrls.length) {
    const goodMovie = await fetchData(movieUrls[i])
        .then((data) => [4, 5, 6].find((episodeId) => episodeId === data['episode_id']));
    if (goodMovie) {
      return true;
    }
    i += 1;
  }
};

const fetchShips = async (url, passengerQty) => {
  const ships = await fetchData(url)
      .then((data) => {
        return data['results'].map((ship) => {
          const enoughSpace = checkPassengers(ship['passengers'], passengerQty);
          const enoughAutonomy = checkAutonomy(ship['consumables']);
          if (enoughSpace && enoughAutonomy) {
            return checkMovies(ship['films']).then((goodMovies) => {
              if (goodMovies) {
                return {'name': ship['name'], 'speed': ship['MGLT']};
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

  return Promise.all(ships);
};

const fetchAllShips = async (url, passengerQty) => {
  const results = [];

  while (url) {
    results.push(await fetchShips(url, passengerQty));
    url = await fetchData(url).then((data) => data['next']);
  }


  cleanedResults = results.flat().filter(Boolean);

  let maxSpeed = 0;
  let fastestShip = '';
  let fastestShipId = 0;

  if (cleanedResults.length > 1) {
    cleanedResults.forEach((ship, i) => {
      if (parseInt(ship['speed']) > maxSpeed) {
        maxSpeed = parseInt(ship['speed']);
        fastestShip = `${ship['name']} (speed: ${ship['speed']} MGLT)`;
        fastestShipId = i;
      }
    });

    if (!fastestShip) {
      fastestShip = `${cleanedResults[0]['name']} (unknown speed...)`;
    }
  }

  displayResults(cleanedResults, fastestShip, fastestShipId);
};


const displayResults = (ships, fastestShip, fastestShipId) => {
  fastestShipDiv.innerHTML = '';
  otherResultsDiv.innerHTML = '';

  if (fastestShip) {
    fastestShipDiv.innerHTML = `
      <p>The fastest starwars ship for your search is:</p>
      <p><span>${fastestShip}</span></p>`;
  } else {
    fastestShipDiv.innerHTML = 'No fastest ship...';
  }

  if (ships.length > 2) {
    otherResultsDiv.innerHTML = '<b>Here are other good candidates:</b>';
    ships.forEach((ship, i) => {
      if (i != fastestShipId) {
        otherResultsDiv.insertAdjacentHTML('beforeend', `<p>${ship['name']}</p>`);
      }
    });
  } else {
    otherResultsDiv.innerHTML = '<b>No other results...</b>';
  }
};

const spaceShipsUrl = 'https://swapi.dev/api/starships/';
const input = document.querySelector('.qty-input');
const btn = document.querySelector('button');
const fastestShipDiv = document.querySelector('.fastest-ship');
const otherResultsDiv = document.querySelector('.other-results');


btn.addEventListener('click', (event) => {
  fetchAllShips(spaceShipsUrl, input.value);
});
