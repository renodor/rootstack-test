url = 'https://swapi.dev/api/starships/5/';

// const fetchSwapi = (url) => {
//   return fetch(url)
//       .then((response) => response.json())
//       .then((data) => data);
// };

// fetch function
const fetchSwapi = (url, callback) => {
  fetch(url).then((response) => response.json())
      .then((data) => callback(data));
};

const checkPassengers = (data) => {
  if (parseFloat(data['passengers']) > 10) {
    checkAutonomy(data);
  } else {
    console.log('nop');
    return false;
  }
};

const checkAutonomy = (data) => {
  let result = false;
  const arr = data['consumables'].split(' ');
  if (arr.length > 1) {
    if (arr[1][0].match(/[wmy]/)) {
      result = true;
    } else if (arr[1][0] === 'd') {
      arr[0] >= 7 ? result = true : result = false;
    }
  }
  if (result === true) {
    checkMovies(data);
  } else {
    console.log('nop');
    return false;
  }
};

const checkMovieId = (data) => {
  if ([4, 5, 6].includes(data['episode_id'])) {
    console.log('huuuuuurra');
    return true;
  } else {
    console.log('nooooooop');
    return false;
  }
};

const checkMovies = (data) => {
  const movies = data['films'];
  movies.forEach((movieUrl) => {
    fetchSwapi(movieUrl, checkMovieId);
  });
};

fetchSwapi(url, checkPassengers);

// fetch(url)
//     .then((response) => response.json())
//     .then((data) => {
//       const starShips = data['results'];

//       starShips.forEach((starShip) => {
//         // if (parseFloat(starShip['passengers']) > 10) {
//         //   console.log('hello')
//         // }

//         // if (checkAutonomy(starShip['consumables'])) {
//         //   console.log('yes');
//         // }

//         console.log(checkMovies(starShip['films']));

//       })
//     })


// fetchSwapi(url)
//     .then((data) => console.log(result));




// another functions
// const dataFunction = (data) => {
//   document.getElementById("myDiv").innerHTML = data['results'][0]['name'];
//   console.log(data['results'][0]);
// };



// fetchSwapi(url, dataFunction);

