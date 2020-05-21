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
        return [4, 5, 6, 1, 2, 3].includes(data['episode_id']);
      });
};


// const fetchOnePage = () => {

// }


const fetchSpaceships = async (url, passengerQty) => {
  const results = await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // if (data['next']) {
        //   fetchSpaceships(data['next'], passengerQty);
        // }
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

const fetchAll = async (url) => {
  const result1 = await fetchSpaceships(url, 10);

  const nextUrl = await fetch(url).then((response) => response.json()).then((data) => data['next']);

  const result2 = await fetchSpaceships(nextUrl, 10);

  // const result2 = await fetchSpaceships(url, 10);
  allStarShips = [];

  result1.forEach((result) => {
    if (result) {
      allStarShips.push(result);
    }
  });

  result2.forEach((result) => {
    if (result) {
      allStarShips.push(result);
    }
  });

  console.log(allStarShips);

  maxSpeed = 0;
  fastestShip = '';
  allStarShips.forEach((ship) => {
    if (parseInt(ship['speed']) > maxSpeed) {
      maxSpeed = parseInt(ship['speed']);
      fastestShip = ship['name'];
    }
  });

  console.log(fastestShip);
  console.log(maxSpeed);
};

fetchAll(spaceShipsUrl);

// const displayResults = (starShips) => {
//   let maxSpeed = 0;
//   starShips.forEach((ship) => {
//     if (ship['speed'] > maxSpeed) {
//       console.log(maxSpeed);
//       maxSpeed = ship['speed'];
//       // console.log('iiiiici ' + ship['name'] + " " + ship['speed']);
//     }
//   });
  // console.log(starShips);
  // let maxSpeed = 0;
  // let fastestStarship = '';

  // starShips.forEach((starShip) => {
  //   if (starShip) {
  //     if (starShip['speed'] > maxSpeed) {
  //       fastestStarship = starShip['name'];
  //     }
  //     resultsDiv.insertAdjacentHTML('beforeend', `<p>${starShip['name']}</p>`);
  //   }
  // });

  // console.log(fastestStarship);
// };


const input = document.querySelector('.qty-input');
const btn = document.querySelector('button');
const resultsDiv = document.querySelector('.results');

btn.addEventListener('click', (event) => {
  fetchSpaceships(spaceShipsUrl, input.value);
});
