// simple helper method to fetch an url and return result in JSON
const fetchData = (url) => {
  return fetch(url).then((response) => response.json());
};

// helper method to check if a ship has enough passenger capacity
// (compared to the quantity of passengers)
const checkPassengers = (passengers, passengerQty) => {
  return parseFloat(passengers) >= passengerQty;
};

// helper method to check if a ship has enough autonomy to travel during a week
const checkAutonomy = (consumables) => {
  // by default we considere that the ship has not enough autonomy
  // we will change this result to true during the method if needed
  let result = false;

  // in the API 'consumables' data is a value and a unit (ex: 30 days)
  // we spit it in an array to have the value first and the unit second
  const autonomy = consumables.split(' ');

  // sometimes the value is 'unknown', in that case our array only have one element
  // in that case we considere the ship has not enough autonomy, so we keep result has false
  if (autonomy.length > 1) {
    // if autonomy unit is 'week' (or 'weeks'), 'month' (or 'months') or 'year' (or 'years')
    // we know it is at least one week, so we are good
    if (autonomy[1][0].match(/[wmy]/)) {
      result = true;

    // if autonomy unti is 'day' (or 'days') value needs to be greater or equal to 7
    } else if (autonomy[1][0] === 'd') {
      autonomy[0] >= 7 ? result = true : result = false;
    }
  }
  return result;
};

// helper method to check if ship is part of the original trilogy
// (movies 4, 5 or 6)
const checkMovies = async (movieUrls) => {
  let i = 0;
  // ships may appear in several movies, so we need to loop all movie urls
  while (i < movieUrls.length) {
    // we need to fetch each url to get the 'episode_id' of the movie
    const goodMovie = await fetchData(movieUrls[i])
        // check if the episode id is eather 4, 5 or 6
        .then((data) => [4, 5, 6].includes(data['episode_id']));
    if (goodMovie) {
      // if we find at least one good movie, we can break the loop and return true
      return true;
      break;
    }
    i += 1;
  }
  // if we don't find any good movie, the method will return undefined
};

// method to fetch 1 page of the swapi starship API
const fetchShips = async (url, passengerQty) => {
  const ships = await fetchData(url)
      .then((data) => {
        return data['results'].map((ship) => {
          // Once we fetched the results of the page, we have to check if the ship has:
          // enough space and enough autonomy
          const enoughSpace = checkPassengers(ship['passengers'], passengerQty);
          const enoughAutonomy = checkAutonomy(ship['consumables']);

          // if we found one ship that has both enough space and enough autonomy
          // we hae to check if it appears in the good movies
          if (enoughSpace && enoughAutonomy) {
            return checkMovies(ship['films']).then((goodMovies) => {
              if (goodMovies) {
                // if we find a ship that passed all filters,
                // we return and object with its name and its speed
                return {'name': ship['name'], 'speed': ship['MGLT']};
              } else {
                // false here means the ship don't belong to the correct movies
                // (we could return a custom message instead of simple 'false')
                return false;
              }
            });
          } else {
            // false here means the ship don't don't have enough space or enough autonomy
            // (we could return a custom message instead of simple 'false')
            return false;
          }
        });
      });

  // we return all the ships we found, making sure to resolve al promises
  return Promise.all(ships);
};


// method to fetch all ships from the swapi API, and to clean results
const fetchAllShips = async (url, passengerQty) => {
  const results = [];

  // we have to featch page after page (to consolidate results in the same array)
  // so fetch one page, and as long as we find a 'next page', we continue
  while (url) {
    results.push(await fetchShips(url, passengerQty));
    url = await fetchData(url).then((data) => data['next']);
  }

  // once we got all results, we can flatten our array and remove 'false' value
  // to have only the ships that passed all filters
  cleanedResults = results.flat().filter(Boolean);

  // we define variables that will contain our fastest ship
  // its id in the cleanedResults array and its speed
  let maxSpeed = 0;
  let fastestShip = '';
  let fastestShipId = 0;

  // if we found more than 1 ship, we need to find the fastest one
  if (cleanedResults.length > 1) {
    // we loop over our found ships and compare its speed to the last one
    cleanedResults.forEach((ship, i) => {
      // if we find a ship faster than the last one we need to do three things:
      // - change the value of maxSpeed
      // - change the name of the fastest ship
      // - save the index of the fastest ship
      if (parseInt(ship['speed']) > maxSpeed) {
        maxSpeed = parseInt(ship['speed']);
        fastestShip = `${ship['name']} (speed: ${ship['speed']} MGLT)`;
        fastestShipId = i;
      }
    });

  // if we found only 1 ship, we put it as the fastest one by default
  } else if (cleanedResults.length == 1) {
    fastestShip = `${cleanedResults[0]['name']} (speed: ${cleanedResults[0]['speed']} MGLT)`;
  }

  // if we do have results but we can't determine what is the fastest ship
  // if may needs that all found ships have 'unknown' speed...
  // in that case we take the first one by default
  if (cleanedResults.length > 1 && !fastestShip) {
    fastestShip = `${cleanedResults[0]['name']} (speed: unknown...)`;
  }

  // i kept this console log if you want to check the raw retrieved data
  console.log(cleanedResults);

  // once we did all that, we can display results
  // (if we don't find anything, cleanedResults and fastestShip will be empty)
  displayResults(cleanedResults, fastestShip, fastestShipId);
};

// method to display our results in the html page
const displayResults = (ships, fastestShip, fastestShipId) => {
  // we automatically clean previous results
  fastestShipDiv.innerHTML = '';
  otherResultsDiv.innerHTML = '';

  // if we found a fastest ship, we display it
  // (otherwise we display a custom message)
  if (fastestShip) {
    fastestShipDiv.innerHTML = `
      <p>The fastest starwars ship for your search is:</p>
      <p><span>${fastestShip}</span></p>`;
  } else {
    fastestShipDiv.innerHTML = 'No fastest ship...';
  }

  // if we found other ships, we display it
  // (otherwise we display a custom message)
  if (ships.length > 1) {
    otherResultsDiv.innerHTML = '<b>Here are other good candidates:</b>';
    ships.forEach((ship, i) => {
      // we make sure to exclude the fastest ship from the other results,
      // otherwise it will be repeated on the page...
      if (i != fastestShipId) {
        otherResultsDiv.insertAdjacentHTML('beforeend', `<p>${ship['name']}</p>`);
      }
    });
  } else {
    otherResultsDiv.innerHTML = '<b>No other results...</b>';
  }
};

// the url to fetch
const spaceShipsUrl = 'https://swapi.dev/api/starships/';

// the input to get the number of passengers
const input = document.querySelector('.qty-input');

// the button that will trigger the action
const btn = document.querySelector('button');

// the divs where we will display results
const fastestShipDiv = document.querySelector('.best-result');
const otherResultsDiv = document.querySelector('.other-results');

// trigger the action when the button is clicked
btn.addEventListener('click', (event) => {
  // if the input is empty, we considere that there are no passengers
  if (input.value == null) {
    input.value = 0;
  }
  fetchAllShips(spaceShipsUrl, input.value);
});
